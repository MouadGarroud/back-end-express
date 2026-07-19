# Auth System Review

Scope note: this review is limited strictly to the standalone authentication system. I did not evaluate JWT response packaging, tests, logs, documentation, rate limiting, or the broader backend architecture.

## Overall Assessment

The auth flow is structurally readable and the core primitives are mostly sound: passwords are hashed with bcrypt, reset and activation tokens are stored hashed, and the login flow correctly checks activation and account status before issuing a session-backed access token. That said, there are several important correctness and security issues in the registration, password-reset, and account-status paths that should be fixed before treating the system as robust.

## High Priority Findings

### 1) Password-reset tokens are exposed to the caller

The forgot-password controller returns `rawToken` and `resendToken` in the HTTP response after the use case already generates and emails the reset code. This means the reset secret is no longer protected by mailbox possession; anyone who can call the endpoint can complete the reset without access to the email inbox.

This is the most serious security issue in the current auth flow because it turns the password reset channel into a direct credential disclosure path. If this behavior is only for local testing, it should still be treated as temporary and removed from the actual flow before production hardening.

Relevant paths:

- `controllers/auth/forgetPassword.controller.js`
- `useCases/auth/forgetPassword.useCase.js`

### 2) Registration is not atomic and can leave orphaned accounts behind

The register use case creates the user first, then creates the activation token, then sends the activation email. If token creation or email delivery fails after the user insert succeeds, the account remains in the database in an unverified state with no guaranteed recovery path. That is a correctness flaw, not just a UX issue.

There is also a race window between the pre-insert duplicate checks and the final insert. The `findUserByUsername` / `findUserByEmail` checks reduce obvious duplicates, but they do not eliminate concurrent collisions. If the unique index rejects the insert, the service currently rethrows the raw DB error instead of normalizing it into an auth-specific error.

Relevant paths:

- `useCases/auth/register.useCase.js`
- `services/domain/user.service.js`

### 3) Password reset can crash on stale token-user state

`resetPasswordUseCase` fetches the token record first and then assumes the associated user always exists. If the token outlives the user or the relationship becomes stale for any reason, `findUserWithPasswordById` can return `null` and the subsequent `user.status` access will throw a runtime error.

This is a hidden control-flow bug in the auth path because it relies on token and user lifecycles staying perfectly aligned without explicitly checking the relationship.

Relevant path:

- `useCases/auth/resetPassword.useCase.js`

### 4) Account state errors are too specific and leak user existence

The login and forgot-password flows return different outcomes for `user not found`, `account not activated`, `banned`, `suspended`, and `bad password`. That makes the auth endpoints effective account-probing oracles. Even without brute-force concerns, an attacker can infer whether an email exists and what state the account is in.

For a standalone auth system, this is a meaningful security concern because the flow is revealing internal account metadata through behavior differences.

Relevant paths:

- `useCases/auth/login.useCase.js`
- `useCases/auth/forgetPassword.useCase.js`

## Logic and Token Handling Review

The token model is conceptually solid: activation and reset tokens are hashed with SHA-256 before storage, and lookup also hashes the incoming raw token before comparison. That is the right direction for handling one-time secrets.

The session creation flow is also coherent: login creates a DB-backed session and ties the JWT payload to that session identifier. From a core auth design perspective, that is a reasonable structure.

The main weakness is not the cryptographic primitive itself, but the lifecycle and error handling around those primitives. In particular:

- activation token creation is not guarded by a transaction with user creation;
- reset token lifecycle assumes the token and user always remain synchronized;
- several branches return different errors for states that could be flattened to reduce account enumeration;
- some service helpers return projected documents with slightly inconsistent field selection, which makes the code easier to misread than it needs to be.

## Code Quality and Structure

The code is modular and the separation between controller, use case, domain service, and token service is good. That structure makes the auth system easier to follow than a monolithic implementation.

Where the structure weakens is in duplication and narrowly repeated branching:

- login, activation, forget-password, and reset-password all repeat the same banned/suspended checks;
- error handling is wrapped in `try/catch` blocks that only rethrow the same error, which adds noise without value;
- some service helpers expose raw persistence details in a way that is harder to reason about than necessary.

This is maintainable today, but it will become harder to evolve if more auth states are added unless those repeated status checks are centralized.

## Password Handling

The password hashing approach is appropriate:

- bcrypt is used for hashing with a cost factor of 12;
- password comparison uses bcrypt compare rather than direct string comparison;
- the stored password field is excluded by default in the user schema.

I did not find a salt-handling bug or a plaintext comparison bug in the password pipeline.

One important edge case remains: password reset checks only whether the new password matches the current one after loading the existing hash. That is fine logically, but it depends on the current user document being present and loaded correctly. The null-check mentioned above should be added first.

## Bottom Line

The auth system has a solid skeleton, but it is not yet robust enough to trust for anything beyond local development.

The two most important fixes are:

1. Stop returning the raw password-reset secret to the client.
2. Make registration and token lifecycle handling resilient to partial failure and stale state.

Once those are addressed, the remaining work is mostly about tightening error semantics and reducing account-enumeration leakage.
