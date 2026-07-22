import mongoose, { Schema, Document } from "mongoose";

export interface IVideoDoc extends Document {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  type: "homepage" | "product" | "promo";
  position: number;
  isActive: boolean;
}

const VideoSchema = new Schema<IVideoDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    type: { type: String, enum: ["homepage", "product", "promo"], default: "homepage" },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideoDoc>("Video", VideoSchema);
