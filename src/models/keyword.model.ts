import mongoose, { Schema, Document } from 'mongoose';

export interface IKeyword extends Document {
  _id: mongoose.Types.ObjectId;
  keyword: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const KeywordSchema = new Schema<IKeyword>(
  {
    keyword: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Keyword = mongoose.model<IKeyword>('Keyword', KeywordSchema);
export default Keyword;
