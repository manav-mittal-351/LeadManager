import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: ['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
