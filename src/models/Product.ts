import mongoose, { Schema, Document } from "mongoose";

export interface IProductDoc extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  features: string[];
  careInstructions: string[];
  price: number;
  discount: number;
  mrp: number;
  category: mongoose.Types.ObjectId;
  subcategory: string;
  brand: string;
  ageGroup: string;
  gender: "boys" | "girls" | "unisex";
  sizes: string[];
  colors: { name: string; hex: string }[];
  material: string;
  images: { url: string; alt: string }[];
  videos: { url: string; alt: string }[];
  thumbnail: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    careInstructions: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    mrp: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: String, default: "" },
    brand: { type: String, required: true },
    ageGroup: { type: String, required: true },
    gender: { type: String, enum: ["boys", "girls", "unisex"], required: true },
    sizes: [{ type: String }],
    colors: [{ name: { type: String }, hex: { type: String } }],
    material: { type: String, required: true },
    images: [{ url: { type: String }, alt: { type: String } }],
    videos: [{ url: { type: String }, alt: { type: String } }],
    thumbnail: { type: String, default: "" },
    tags: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isTrending: 1 });
ProductSchema.index({ isBestSeller: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);
