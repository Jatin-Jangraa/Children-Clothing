import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentCategory?: mongoose.Types.ObjectId;
  subcategories: { name: string; slug: string }[];
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    subcategories: [{ name: { type: String }, slug: { type: String } }],
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });

export default mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);
