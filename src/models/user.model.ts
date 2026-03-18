import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  username: string;
  profilePicture?: string;
  bio: string;
  email: string;
  password: string;
  mobile?: string;
  roleName: string; // Optional field to store role name
  roleId: mongoose.Schema.Types.ObjectId; // Reference to Role model
  category: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    profilePicture: {
      type: String,
      required: false, 
    },
    bio: {
      type: String,
      required: false,
      maxlength: 500, // Optional bio with a maximum length
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    mobile: {
      type: String,
      required: false,
      minlength: 10,
      maxlength: 15,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role', // Referencing the Role model
      required: true,
    },
    roleName: {
      type: String,
      ref: 'Role',
      required: true,
    },
    category: {
      type: [String],
      required:false
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);


// UserSchema.index({ email: 1 });
// UserSchema.index({ username: 1 });
// UserSchema.index({ roleId: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);

export default User;


