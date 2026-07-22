export const PRODUCT_SIZES = ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y", "10-11Y", "11-12Y", "12-13Y", "13-14Y"];

export const GENDERS = ["boys", "girls", "unisex"];

export const AGE_GROUPS = ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years", "3-5 Years", "5-8 Years", "8-12 Years", "12-14 Years"];

export const BRANDS = ["Little Closet", "Tiny Trend", "Kidz Fashion", "Mini Me", "Junior Style", "Blossom Kids", "Adventure Boys", "Princess Collection"];

export const COLORS = [
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#22C55E" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Orange", hex: "#F97316" },
  { name: "Black", hex: "#171717" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Peach", hex: "#FBBF9B" },
  { name: "Lavender", hex: "#C4B5FD" },
  { name: "Mint", hex: "#A7F3D0" },
  { name: "Coral", hex: "#FB7185" },
  { name: "Beige", hex: "#F5F0E6" },
];

export const MATERIALS = ["Cotton", "Polyester", "Cotton Blend", "Denim", "Fleece", "Silk Blend", "Linen", "Wool", "Organic Cotton", "Bamboo Fabric"];

export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"] as const;

export const ITEMS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
];
