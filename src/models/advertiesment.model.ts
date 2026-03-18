import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertiesment extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
    description?: string;
    adImage: string;
    adImageUrl: string;
    position: string;
    countries: Array<{
        code: string;
        name: string;
    }>;
    isWebsiteHave: boolean;
    adUrl?: string;
    email?: string;
    whatsappNo?: string;
    phoneNo?: string;
    fbProfile?: string;
    startDatetime: Date;
    endDatetime: Date;
    status: 'draft' | 'published' | 'expired' | 'toPublish';
  createdAt?: Date;
  updatedAt?: Date;
}

const AdvertiesmentSchema = new Schema<IAdvertiesment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
        type: String,
    },
    adImage: {
        type: String,
        required: true,
    },
    position: {
      type: String,
      required: true,
    },
    countries: [{
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    isWebsiteHave: {
        type: Boolean,
        required: true,
    },
    adUrl: {
        type: String,
    },
    email: {
        type: String,
    },
    whatsappNo: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    fbProfile: {
        type: String,
    },
    startDatetime: {
        type: Date,
        required: true,
    },
    endDatetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'expired', 'toPublish'],
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Advertiesment = mongoose.model<IAdvertiesment>('Advertiesment', AdvertiesmentSchema);
export default Advertiesment;
