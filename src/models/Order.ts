import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDoc extends Document {
  orderId: string;
  invoiceNumber: string;
  user?: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode: string;
  shippingCharges: number;
  gst: number;
  total: number;
  paymentInfo: {
    paymentId: string;
    orderId: string;
    signature: string;
    method: string;
    status: "pending" | "completed" | "failed" | "refunded";
  };
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingStatus: "pending" | "shipped" | "in_transit" | "delivered";
  trackingNumber: string;
  notes: string;
}

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderId: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    shippingCharges: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentInfo: {
      paymentId: { type: String, default: "" },
      orderId: { type: String, default: "" },
      signature: { type: String, default: "" },
      method: { type: String, default: "razorpay" },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingStatus: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "delivered"],
      default: "pending",
    },
    trackingNumber: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ "customerInfo.email": 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);
