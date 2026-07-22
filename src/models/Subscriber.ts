import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriberDoc extends Document {
  email: string;
  isActive: boolean;
}

const SubscriberSchema = new Schema<ISubscriberDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Subscriber || mongoose.model<ISubscriberDoc>("Subscriber", SubscriberSchema);
