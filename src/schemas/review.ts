import { z } from "zod";

export const reviewSchema = z.object({
  product: z.string().min(1),
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  rating: z.number().min(1).max(5),
  title: z.string().min(1, "Review title is required"),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
