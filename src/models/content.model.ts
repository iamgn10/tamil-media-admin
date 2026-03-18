import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  _id: mongoose.Types.ObjectId;
  headline1: string;
  headline2: string;
  headline3?: string;
  seoTitle: string;
  url: string;
  headlineImage: string;
  category: string[];
  author: string;
  authorId: mongoose.Types.ObjectId;
  keywords?: string[];
  content: string;
  provinces?: string[];
  status: 'Draft' | 'Published' | 'Scheduled' | 'Canceled';
  isFeatured: boolean;
  isSpecial: boolean;
  isBreaking: boolean;
  isShownOnHome: boolean;
  scheduledPublishDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    headline1: {
      type: String,
      required: true,
    },
    headline2: {
        type: String,
        required: true,
    },
    headline3: {
        type: String,
    },
    seoTitle: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    headlineImage: {
        type: String,
        required: false,
    },
    category: [{
        name: { type: String, required: true },
        subCategory: { type: String }
    }],
    keywords: {
        type: [String]
    },
    provinces: {
      type: [String],
      required: true
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Scheduled', 'Canceled'],
        default: 'Draft', 
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false, 
    },
    isSpecial: {
        type: Boolean,
        default: false, 
    },
    isBreaking: {
        type: Boolean,
        default: false,
    },
    isShownOnHome: {
        type: Boolean,
        default: true,
    },
    scheduledPublishDate: {
        type: Date,
        required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model<IContent>('Content', ContentSchema);
export default Content;
