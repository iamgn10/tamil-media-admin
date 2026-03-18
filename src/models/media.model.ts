import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  img_url: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    img_url: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
export default Media;
