# Backend Auth Service

A production-ready Express.js authentication API built with a clean, layered architecture. This service handles user registration, email verification, secure login, password reset, session management, and protected routes with comprehensive rate limiting and security hardening.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Codebase Breakdown](#codebase-breakdown)
- [Feature Set](#feature-set)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoint Documentation](#api-endpoint-documentation)
- [Development](#development)

---

## Architecture Overview

This backend follows a **layered, clean architecture** pattern designed for maintainability, testability, and scalability:

```mermaid
flowchart TB
  Client["👤 Client / Frontend"]
  
  Client -->|HTTP Request| Express["Express App<br/>app.js + server.js"]
  
  Express -->|Routes| Routes["🔀 Route Layer<br/>auth.router.js<br/>advance.router.js"]
  
  Routes -->|Request| Controllers["🎮 Controller Layer<br/>auth controllers"]
  
  Controllers -->|Business Logic| UseCases["📋 Use Case Layer<br/>auth use cases"]
  
  UseCases -->|Data Access| Services["🔧 Service Layer<br/>Domain / JWT / Mail / Token"]
  
  Services -->|Query/Update| Models["📊 Models<br/>User / Session / Tokens"]
  
  Models -->|Persist| DB["🗄️ Data Layer<br/>MongoDB<br/>Redis"]
  
  Services -->|Send Email| Mail["📧 SMTP<br/>Nodemailer"]
```

### Architectural Principles

- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Injection**: Controllers depend on use cases, use cases depend on services
- **Validation at Every Layer**: Request validation + business logic validation
- **Error Handling**: Centralized error handler with custom error classes
- **Rate Limiting**: Global and endpoint-specific rate limits via Redis

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Framework** | Express 5.x | HTTP server framework |
| **Database** | MongoDB + Mongoose | Primary data storage |
| **Cache/Session** | Upstash Redis | Rate limiting and distributed caching |
| **Authentication** | JWT (jsonwebtoken) | Access token generation and verification |
| **Validation** | Joi | Request payload validation |
| **Password Hashing** | Bcrypt | Secure password storage |
| **Email** | Nodemailer | SMTP-based email delivery |
| **File Upload** | Multer + Sharp | Image processing and optimization |
| **Security** | Helmet, CORS, Cookie-Parser | HTTP headers, CORS, and cookie management |
| **Logging** | Morgan + Winston | HTTP request logging and error logging |
| **Rate Limiting** | express-rate-limit + Upstash | Request throttling |
| **Dev Tools** | Nodemon, ESLint, Prettier | Development and code quality |

---

## Codebase Breakdown

### Directory Structure

```
backend/
├── app.js                    # Express app initialization & middleware setup
├── server.js                 # HTTP server & MongoDB connection
├── package.json              # Dependencies and scripts
│
├── config/                   # External service configurations
│   ├── cookie.config.js      # Cookie security settings
│   ├── cors.config.js        # CORS policies
│   ├── db.config.js          # MongoDB connection
│   ├── env.config.js         # Environment variables loader
│   ├── helmet.config.js      # Security headers
│   ├── mail.config.js        # SMTP configuration
│   ├── morgan.config.js      # HTTP logging setup
│   ├── rateLimit.config.js   # Rate limit configuration
│   └── redis.config.js       # Upstash Redis client
│
├── constants/                # Application constants
│   ├── errorCodes.constant.js       # Error code mappings
│   ├── mailSubjects.constant.js     # Email subject lines
│   ├── responseMessages.constant.js # Success/error messages
│   ├── successCodes.constant.js     # Success code mappings
│   └── typesMail.constant.js        # Email type definitions
│
├── controllers/              # HTTP request handlers (thin layer)
│   └── auth/
│       ├── register.controller.js
│       ├── login.controller.js
│       ├── activation.controller.js
│       ├── logout.controller.js
│       ├── logoutFromAll.controller.js
│       ├── refresh.controller.js
│       ├── resendActivation.controller.js
│       ├── forgetPassword.controller.js
│       └── resetPassword.controller.js
│
├── errors/                   # Error handling
│   ├── appError.error.js     # Custom error class
│   └── errorHandler.error.js # Global error middleware
│
├── middlewares/              # Express middleware
│   ├── auth.middleware.js    # JWT verification & token refresh
│   ├── notFound.middleware.js # 404 handler
│   ├── rateLimit.middleware.js # Rate limiting rules
│   ├── uploadPicture.js      # Avatar upload handling
│   └── validate.middleware.js # Joi validation wrapper
│
├── models/                   # Mongoose schemas
│   ├── User.model.js         # User account schema
│   ├── Session.model.js      # Session tracking
│   ├── ActivationToken.model.js # Email activation tokens
│   └── ResetToken.model.js   # Password reset tokens
│
├── routes/                   # Express route definitions
│   ├── auth.router.js        # Public auth endpoints
│   └── advance.router.js     # Protected demo routes
│
├── services/                 # Business logic adapters
│   ├── domain/
│   │   └── user.service.js   # User data access layer
│   ├── JWT/
│   │   └── jwt.service.js    # JWT & session management
│   ├── mail/
│   │   ├── mail.service.js   # Email delivery
│   │   └── templates/        # HTML email templates
│   └── token/
│       └── Token.service.js  # Token persistence
│
├── useCases/                 # Core business logic
│   └── auth/
│       ├── register.useCase.js
│       ├── login.useCase.js
│       ├── activate.useCase.js
│       ├── logout.useCase.js
│       ├── logoutFromAll.useCase.js
│       ├── refresh.useCase.js
│       ├── resendActivation.useCase.js
│       ├── forgetPassword.useCase.js
│       └── resetPassword.useCase.js
│
├── utils/                    # Utility functions
│   ├── generateAccessToken.util.js  # JWT creation
│   ├── verifyJWT.util.js            # JWT validation
│   ├── hashPassword.util.js         # Bcrypt hashing
│   ├── comparePassword.util.js      # Bcrypt comparison
│   ├── assertValidUser.util.js      # User existence checks
│   ├── assertValidToken.util.js     # Token validation
│   ├── extractJWT.util.js           # Bearer token extraction
│   └── [other assertion utilities]
│
├── validators/               # Joi validation schemas
│   └── auth/
│       ├── register.validator.js
│       ├── login.validator.js
│       ├── activation.validator.js
│       ├── resetPassword.validator.js
│       └── [other validators]
│
├── uploads/                  # Local avatar storage
├── sockets/                  # Reserved for WebSocket features
└── .env.example              # Environment variable template
```

### Key File Descriptions

| File | Responsibility |
|------|-----------------|
| `app.js` | Initializes Express, applies global middleware (CORS, Helmet, Morgan), mounts routes, and sets up error boundaries |
| `server.js` | Connects to MongoDB, starts the HTTP server, and handles graceful shutdown |
| `config/*.js` | Centralize external service configurations (DB, Redis, Mail, CORS, etc.) |
| `controllers/auth/*.js` | Receive HTTP requests, extract data, delegate to use cases, and return responses |
| `useCases/auth/*.js` | Orchestrate business logic, coordinate services, and enforce business rules |
| `services/*/*.js` | Interface with databases, send emails, manage sessions, and handle cryptographic operations |
| `models/*.js` | Define MongoDB data schemas and validation rules |
| `utils/*.js` | Provide reusable helper functions (JWT, password hashing, assertions, etc.) |
| `validators/*.js` | Define Joi schemas for request validation at the controller level |
| `middlewares/*.js` | Intercept requests for authentication, validation, rate limiting, and file uploads |

---

## Feature Set

### Authentication & Authorization

✅ **User Registration**
- Input validation with Joi (email, username, password strength)
- Disposable email domain blocking
- Optional avatar upload with image format validation
- Automatic email activation link generation
- Secure password hashing with Bcrypt

✅ **Email Verification**
- Time-limited activation tokens (default: 24 hours)
- HTML email templates for activation links
- Resend activation email functionality
- Mark user as verified upon successful activation

✅ **Login & Sessions**
- Credential validation with Bcrypt password comparison
- Session creation in MongoDB
- JWT access token generation with configurable expiration
- Access token stored in secure, httpOnly cookies
- IP and User-Agent tracking for session validation

✅ **Protected Routes**
- Bearer token extraction and validation
- Automatic token refresh on expiration
- Role-based access control preparation
- Session validity verification

✅ **Logout Functionality**
- Single session logout (current device)
- Logout from all sessions (across all devices)
- Session cleanup in database

✅ **Password Management**
- Forgot password flow with time-limited reset codes
- 6-character alphanumeric reset codes
- Reset email delivery via SMTP
- Password update with old password validation
- Secure password reset endpoint

### Security Features

🔒 **Rate Limiting**
- Global rate limit (100 requests per 15 minutes)
- Auth endpoint rate limits (5 requests per 15 minutes)
- Email spam protection (3 requests per hour)
- Distributed rate limiting via Upstash Redis

🔒 **Security Headers**
- Helmet middleware for HTTP header hardening
- Content Security Policy (CSP)
- X-Frame-Options, X-Content-Type-Options, etc.

🔒 **CORS Protection**
- Configurable allowed origins
- Credentials included in cross-origin requests
- Preflight request handling

🔒 **Request Validation**
- Joi schema validation at controller layer
- Type checking and constraint enforcement
- Comprehensive error messages

🔒 **Password Security**
- Bcrypt hashing with configurable salt rounds
- Password must be >= 8 characters
- No plain-text password storage
- Secure comparison functions

🔒 **Token Management**
- Separate expiration times for access tokens and reset codes
- Secure token generation with cryptographic randomness
- Token hashing before database storage

### API Features

📡 **RESTful Endpoints**
- Clean resource-based URL structure
- Proper HTTP status codes
- JSON request/response format
- Standard error response shape

📡 **Request Logging**
- Morgan HTTP request logging
- Winston error logging
- Detailed request/response tracking

📡 **File Upload**
- Avatar upload during registration
- Image format validation (jpg, png, webp, gif)
- Sharp image processing (metadata stripping)
- Local file storage in `uploads/` directory

---

## Setup & Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher) - local or MongoDB Atlas
- **Upstash Redis** account (for rate limiting)
- **SMTP credentials** (Gmail, SendGrid, etc.)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies listed in `package.json`:
- Express, MongoDB/Mongoose, JWT, Joi, Bcrypt
- Email (Nodemailer), File handling (Multer, Sharp)
- Security (Helmet, CORS, Rate Limiting)
- Development tools (Nodemon, ESLint, Prettier)

### 3. Create Environment Configuration

Copy the example environment file and fill in your values:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

### 4. Configure External Services

Edit `.env` and configure the following:

#### MongoDB Setup

```env
MONGO_URI=mongodb://127.0.0.1:27017/your_database_name
# OR for MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**For Local MongoDB:**
```bash
# Windows: Download MongoDB Community Edition
# macOS: brew install mongodb-community
# Linux: Follow MongoDB documentation

# Start MongoDB service
mongod
```

#### Redis Setup (Upstash)

1. Go to [https://upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy the REST API URL and token:

```env
UPSTASH_REDIS_REST_URL=https://YOUR_ENDPOINT.upstash.io
UPSTASH_REDIS_REST_TOKEN=YOUR_TOKEN_HERE
```

#### Email (SMTP) Setup

For **Gmail**:
1. Enable 2-Step Verification
2. Generate an App Password (not your regular password)
3. Configure in `.env`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password_here
MAIL_FROM=<your_email@gmail.com>
```

For other providers (SendGrid, Mailgun, etc.), adjust `MAIL_HOST` and `MAIL_PORT` accordingly.

#### JWT & Token Configuration

```env
JWT_SECRET=your_ultra_secure_jwt_secret_key_here_min_32_chars
JWT_EXPIRES=600                    # 10 minutes (in seconds)
JWT_RESEND_EXPIRES=600             # Resend token lifetime
ACTIVATION_TOKEN_EXPIRES=86400     # 24 hours
RESET_TOKEN_EXPIRES=600            # 10 minutes
LENGTH_ACTIVATION_TOKEN=32         # Length of activation code
LENGTH_RESET_TOKEN=6               # Length of reset code
```

#### Client Configuration

```env
APP_URL=http://localhost:3000/api/v1/auth  # Backend base URL for email links
CLIENT_URL=http://localhost:4200           # Frontend URL for CORS
SERVER_PORT=3000                           # Backend server port
```

### 5. Verify Your Configuration

Your `.env` file should look like:

```env
NODE_ENV=development
APP_URL=http://localhost:3000/api/v1/auth
SERVER_PORT=3000
CLIENT_URL=http://localhost:4200

MONGO_URI=mongodb://127.0.0.1:27017/backend_db

UPSTASH_REDIS_REST_URL=https://YOUR_ENDPOINT.upstash.io
UPSTASH_REDIS_REST_TOKEN=YOUR_TOKEN_HERE

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password_here
MAIL_FROM=<your_email@gmail.com>

JWT_SECRET=your_ultra_secure_jwt_secret_key_here
JWT_EXPIRES=600
JWT_RESEND_EXPIRES=600
ACTIVATION_TOKEN_EXPIRES=86400
RESET_TOKEN_EXPIRES=600
LENGTH_ACTIVATION_TOKEN=32
LENGTH_RESET_TOKEN=6
```

### 6. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured `SERVER_PORT`).

You should see:
```
✓ Connected to MongoDB
✓ Server running on port 3000
```

---

## Environment Variables

| Variable | Default | Description | Used By |
|----------|---------|-------------|---------|
| `NODE_ENV` | `development` | Runtime environment (development/production) | Mongoose, error handling |
| `APP_URL` | `http://localhost:3000/api/v1/auth` | Base URL for email activation links | Activation use case |
| `SERVER_PORT` | `3000` | HTTP server port | server.js |
| `CLIENT_URL` | `http://localhost:4200` | Frontend origin for CORS | config/cors.config.js |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/your_database_name` | MongoDB connection string | config/db.config.js |
| `UPSTASH_REDIS_REST_URL` | - | Upstash Redis REST endpoint | config/redis.config.js |
| `UPSTASH_REDIS_REST_TOKEN` | - | Upstash Redis authentication token | config/redis.config.js |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server hostname | config/mail.config.js |
| `MAIL_PORT` | `465` | SMTP server port | config/mail.config.js |
| `MAIL_SECURE` | `true` | Use TLS for SMTP connection | config/mail.config.js |
| `MAIL_USER` | - | SMTP username/email address | config/mail.config.js |
| `MAIL_PASS` | - | SMTP password/app password | config/mail.config.js |
| `MAIL_FROM` | `noreply@example.com` | Default sender email address | config/mail.config.js |
| `JWT_SECRET` | - | Secret key for signing JWTs (use strong 32+ char value) | JWT utilities |
| `JWT_EXPIRES` | `600` | Access token lifetime in seconds (10 min) | Auth use cases |
| `JWT_RESEND_EXPIRES` | `600` | Resend/refresh token lifetime in seconds | Password reset use cases |
| `ACTIVATION_TOKEN_EXPIRES` | `86400` | Activation token lifetime in seconds (24 hours) | Activation use case |
| `RESET_TOKEN_EXPIRES` | `600` | Password reset code lifetime in seconds (10 min) | Password reset use case |
| `LENGTH_ACTIVATION_TOKEN` | `32` | Length of activation codes (alphanumeric) | Token generation |
| `LENGTH_RESET_TOKEN` | `6` | Length of reset codes (numeric) | Token generation |

---

## API Endpoint Documentation

### Base Paths

- **Public Auth**: `/api/v1/auth`
- **Protected Routes**: `/api/v1/adv` (requires Bearer token)

### Authentication

Protected endpoints require the JWT access token in one of these ways:

**Option 1: Authorization Header**
```http
GET /api/v1/adv/test HTTP/1.1
Authorization: Bearer <your_access_token>
```

**Option 2: Cookie (auto-set by login)**
```
Cookie: accessToken=<your_access_token>
```

### Response Format

#### Success Response
```json
{
  "message": "Operation successful",
  "token": { "accessToken": "..." },
  "data": {}
}
```

#### Error Response
```json
{
  "message": "Human-readable error message"
}
```

---

### Public Auth Endpoints

#### 1. Health Check

```http
GET /api/v1/auth/ping
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "auth service up"
}
```

---

#### 2. Register User

```http
POST /api/v1/auth/register
Content-Type: multipart/form-data

username=johndoe
firstName=John
lastName=Doe
email=john@example.com
password=SecurePass123!
avatar=<file> (optional)
```

**Request Body** (multipart/form-data):
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | string | ✅ | 3-20 chars, unique, alphanumeric |
| `firstName` | string | ✅ | 2-20 chars |
| `lastName` | string | ✅ | 2-20 chars |
| `email` | string | ✅ | Valid email, unique, not disposable domain |
| `password` | string | ✅ | 8+ chars, mixed case + number/symbol |
| `avatar` | file | ❌ | jpg, png, webp, gif (max 5MB) |

**Response** (201 Created):
```json
{
  "message": "Registration completed successfully! Please check your inbox to activate your account."
}
```

**Error Examples**:
- `409 Conflict`: Email or username already exists
- `400 Bad Request`: Validation failed
- `429 Too Many Requests`: Rate limit exceeded

---

#### 3. Activate Account

```http
GET /api/v1/auth/activate/ACTIVATION_TOKEN_HERE
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | string | 32-character token from email link |

**Response** (200 OK):
```json
{
  "message": "Account activated successfully! You can now log in."
}
```

**Error Examples**:
- `400 Bad Request`: Invalid or expired token
- `404 Not Found`: Token not found

---

#### 4. Resend Activation Email

```http
POST /api/v1/auth/resend-activate
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Request Body**:
| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |

**Response** (201 Created):
```json
{
  "message": "Activation email has been resent successfully. Please check your inbox."
}
```

**Rate Limit**: 3 requests per hour per IP

---

#### 5. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Request Body**:
| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response** (201 Created):
```json
{
  "message": "Welcome back! You have logged in successfully.",
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookies Set**:
- `accessToken`: Secure, httpOnly, expires in 10 minutes

**Error Examples**:
- `401 Unauthorized`: Invalid email/password
- `403 Forbidden`: Account not activated
- `429 Too Many Requests`: Too many login attempts

**Rate Limit**: 5 requests per 15 minutes per IP

---

#### 6. Logout (Current Session)

```http
GET /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "message": "You have been logged out successfully."
}
```

---

#### 7. Logout from All Sessions

```http
GET /api/v1/auth/logoutFromAll
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "message": "You have been logged out from all devices successfully."
}
```

---

#### 8. Forgot Password

```http
POST /api/v1/auth/forget-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Request Body**:
| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |

**Response** (201 Created):
```json
{
  "message": "A password reset link has been sent to your email. Please check your inbox.",
  "rawToken": "123456",
  "resendToken": "base64_encoded_token"
}
```

**What Happens**:
1. User receives email with 6-digit reset code
2. Code is valid for 10 minutes
3. `rawToken` is the 6-digit code
4. `resendToken` is used for requesting another reset code

**Rate Limit**: 3 requests per hour per IP

---

#### 9. Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "code": "123456",
  "newPassword": "NewSecurePass123!"
}
```

**Request Body**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `code` | string | ✅ | 6-digit code from email |
| `newPassword` | string | ✅ | 8+ chars, mixed case + number/symbol, different from old password |

**Response** (201 Created):
```json
{
  "message": "Your password has been reset successfully. Please log in with your new password."
}
```

**Error Examples**:
- `400 Bad Request`: Invalid code or expired code
- `409 Conflict`: New password same as old password

**Rate Limit**: 5 requests per 15 minutes per IP

---

#### 10. Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json
Cookie: accessToken=CURRENT_TOKEN
```

**Response - If Token Still Valid** (200 OK):
```json
{
  "message": "The access token is still active and valid."
}
```

**Response - If Token Refreshed** (200 OK):
```json
{
  "message": "Your access token has been refreshed successfully."
}
```

New `accessToken` cookie is set with 10-minute expiration.

---

### Protected Routes

#### Example Protected Endpoint

```http
GET /api/v1/adv/test
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "ok next",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "oldToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Rate Limiting

The API implements distributed rate limiting via Upstash Redis:

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| **Global** | 100 requests | 15 minutes |
| **Auth Endpoints** | 5 requests | 15 minutes |
| **Email Endpoints** | 3 requests | 1 hour |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1629734400
```

**When Rate Limited** (429 Too Many Requests):
```json
{
  "message": "Too many requests from this IP, please try again after 15 minutes."
}
```

---

## Development

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with auto-reload (Nodemon) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests (placeholder) |

### Code Quality

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

### Project Structure Best Practices

1. **Controllers** → Keep thin, focus on HTTP concerns
2. **Use Cases** → Contain all business logic
3. **Services** → Handle data access and external integrations
4. **Validators** → Centralize Joi schemas
5. **Utils** → Create reusable helper functions
6. **Models** → Define schemas and indexes

### Adding a New Endpoint

1. Create a validator in `validators/auth/`
2. Create a use case in `useCases/auth/`
3. Create a controller in `controllers/auth/`
4. Add the route in `routes/auth.router.js`
5. Add any required service methods in `services/`

### Testing Endpoints

Use Postman, Thunder Client, or cURL:

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","firstName":"Test","lastName":"User","email":"test@example.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Protected endpoint
curl -X GET http://localhost:3000/api/v1/adv/test \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Security Considerations

⚠️ **Important Security Notes**:

1. **JWT_SECRET**: Use a strong, randomly generated secret (32+ characters)
2. **Environment Variables**: Never commit `.env` to version control
3. **HTTPS**: Use HTTPS in production (not HTTP)
4. **CORS**: Restrict `CLIENT_URL` to your actual frontend domain
5. **Rate Limiting**: Adjust limits based on your requirements
6. **MongoDB**: Use strong credentials and IP whitelisting
7. **Bcrypt**: Default salt rounds are 10; increase for production if needed
8. **Token Expiration**: Keep access tokens short-lived (10 min) with refresh tokens

---

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions**:
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` is correct in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Redis Connection Error

```
Error: Error making request to Upstash: ...
```

**Solutions**:
- Verify `UPSTASH_REDIS_REST_URL` and token in `.env`
- Check Upstash dashboard for active database
- Ensure network connectivity

### Email Not Sending

```
Error: Invalid login: ...
```

**Solutions**:
- For Gmail: Use App Password, not regular password
- Check `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`
- Test SMTP credentials using Nodemailer test account

### Token Validation Errors

```
Error: Invalid token
```

**Solutions**:
- Ensure `JWT_SECRET` matches between token generation and verification
- Check token hasn't expired
- Verify Bearer token format in Authorization header

---

## License

ISC

## Author

M003aad

---

## Support

For issues or questions, please check the code comments, error messages, and this documentation before reporting bugs.
