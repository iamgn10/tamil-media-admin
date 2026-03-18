import mongoose, { Schema, Document } from 'mongoose';

export interface ILogo extends Document {
  _id: mongoose.Types.ObjectId;
  url: string;
  type: 'header' | 'footer';
  createdAt?: Date;
  updatedAt?: Date;
}

const LogoSchema = new Schema<ILogo>(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['header', 'footer'],
    }
  },
  {
    timestamps: true,
  }
);

export const Logo = mongoose.model<ILogo>('Logo', LogoSchema);
export default Logo;
