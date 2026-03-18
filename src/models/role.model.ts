import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  role_name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt & updatedAt fields
  }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;
