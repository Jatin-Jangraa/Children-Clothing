import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDoc extends Document {
  product: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1 });
ReviewSchema.index({ isApproved: 1 });

export default mongoose.models.Review || mongoose.model<IReviewDoc>("Review", ReviewSchema);
