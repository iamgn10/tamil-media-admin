import mongoose, { Schema, Document } from 'mongoose';
import { User } from './user.model';

export interface IUserLoginSession extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to User model
  token: string;
  isValid: boolean;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserLoginSessionSchema = new Schema<IUserLoginSession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencing the User model
      required: true,
    },
    token: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    lastUsedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const UserLoginSession = mongoose.model<IUserLoginSession>('UserLoginSession', UserLoginSessionSchema);

export default UserLoginSession;
