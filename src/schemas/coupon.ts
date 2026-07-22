import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code is required").max(20).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "flat"]),
  discountValue: z.number().min(0.01, "Discount value must be positive"),
  minimumOrder: z.number().min(0).optional().default(0),
  maximumDiscount: z.number().min(0).optional().default(0),
  usageLimit: z.number().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

export type CouponFormData = z.infer<typeof couponSchema>;
