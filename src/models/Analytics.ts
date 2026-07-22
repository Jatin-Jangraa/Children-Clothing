import mongoose, { Schema, Document } from "mongoose";

export interface IAnalyticsDoc extends Document {
  date: string;
  visitors: number;
  pageViews: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

const AnalyticsSchema = new Schema<IAnalyticsDoc>(
  {
    date: { type: String, required: true, unique: true },
    visitors: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AnalyticsSchema.index({ date: 1 });

export default mongoose.models.Analytics || mongoose.model<IAnalyticsDoc>("Analytics", AnalyticsSchema);
