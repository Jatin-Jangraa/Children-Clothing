import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonialDoc extends Document {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
  isActive: boolean;
}

const TestimonialSchema = new Schema<ITestimonialDoc>(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    location: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonialDoc>("Testimonial", TestimonialSchema);
