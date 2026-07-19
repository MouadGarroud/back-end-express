import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Session from './session.model.js';
import ResetToken from './resetToken.model.js';
import ActivationToken from './activationToken.model.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
      index: true,
    },
    bio: {
      type: String,
      maxlength: 250,
      default: '',
    },
    avatar: {
      type: String,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

userSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

userSchema.statics.findActiveById = function (id, projection = null) {
  return this.findOne({ _id: id, emailVerified: true, deletedAt: null }, projection);
};

userSchema.pre('save', async function () {
  if (this.isModified('deletedAt') && this.deletedAt !== null) {
    const userId = this._id;

    await Promise.all([
      Session.deleteMany({ userId }),
      ResetToken.deleteMany({ user: userId }),
      ActivationToken.deleteMany({ user: userId }),
    ]);
  }
});

userSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const userId = this._id;

  await Promise.all([
    Session.deleteMany({ userId }),
    ResetToken.deleteMany({ user: userId }),
    ActivationToken.deleteMany({ user: userId }),
  ]);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
