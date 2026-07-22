import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  image: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
