import mongoose, { Schema, Document } from "mongoose";

export interface ISettingsDoc extends Document {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    pinterest: string;
  };
  announcementBar: {
    text: string;
    isActive: boolean;
  };
  metaTags: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const SettingsSchema = new Schema<ISettingsDoc>(
  {
    siteName: { type: String, default: "Little Closet" },
    siteDescription: { type: String, default: "Premium Children's Clothing" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      pinterest: { type: String, default: "" },
    },
    announcementBar: {
      text: { type: String, default: "Free Shipping on Orders Above ₹999!" },
      isActive: { type: Boolean, default: true },
    },
    metaTags: {
      title: { type: String, default: "Little Closet - Premium Kids Fashion" },
      description: { type: String, default: "Shop the latest trends in children's clothing" },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettingsDoc>("Settings", SettingsSchema);
