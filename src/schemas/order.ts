import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required").max(15),
  email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().min(6, "Valid PIN code is required").max(6),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
