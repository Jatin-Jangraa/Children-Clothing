import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  icon: z.string().optional(),
  parentCategory: z.string().optional(),
  subcategories: z.array(z.object({ name: z.string(), slug: z.string() })).optional(),
  isActive: z.boolean().optional().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
