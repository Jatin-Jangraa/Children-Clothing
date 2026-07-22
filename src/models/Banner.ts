import mongoose, { Schema, Document } from "mongoose";

export interface IBannerDoc extends Document {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: "hero" | "promo" | "offer" | "popup" | "video";
  position: number;
  isActive: boolean;
}

const BannerSchema = new Schema<IBannerDoc>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    link: { type: String, default: "#" },
    type: { type: String, enum: ["hero", "promo", "offer", "popup", "video"], default: "hero" },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BannerSchema.index({ type: 1, isActive: 1 });

export default mongoose.models.Banner || mongoose.model<IBannerDoc>("Banner", BannerSchema);
