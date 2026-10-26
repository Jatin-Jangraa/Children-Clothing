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
  heroBanner: {
    badgeText: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    button1Text: string;
    button1Link: string;
    button2Text: string;
    button2Link: string;
    isActive: boolean;
  };
  countdownTimer: {
    tagline: string;
    heading: string;
    subheading: string;
    hours: number;
    minutes: number;
    seconds: number;
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
  whatsappNumber: { type: String, default: "" },
  showCallButton: { type: Boolean, default: true },
  showWhatsappButton: { type: Boolean, default: true },
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
      text: { type: String, default: "Free Shipping on Orders Above ₹999 | Use Code WELCOME10 for 10% Off" },
      isActive: { type: Boolean, default: true },
    },
    heroBanner: {
      badgeText: { type: String, default: "New Summer Collection 2026" },
      headingLine1: { type: String, default: "Dress Your" },
      headingLine2: { type: String, default: "Little Stars" },
      description: { type: String, default: "Premium children's clothing that combines comfort, quality, and the latest trends. Make every moment special." },
      button1Text: { type: String, default: "Shop Now" },
      button1Link: { type: String, default: "/shop" },
      button2Text: { type: String, default: "New Arrivals" },
      button2Link: { type: String, default: "/shop?sort=newest" },
      isActive: { type: Boolean, default: true },
    },
    countdownTimer: {
      tagline: { type: String, default: "Limited Time Offer" },
      heading: { type: String, default: "Summer Sale Up to 50% Off" },
      subheading: { type: String, default: "Hurry! This deal ends soon" },
      hours: { type: Number, default: 23 },
      minutes: { type: Number, default: 59 },
      seconds: { type: Number, default: 41 },
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
