export const siteConfig = {
  name: "Little Closet",
  description: "Premium Children's Clothing - Where Style Meets Comfort",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@littlecloset.in",
  phone: "+91 98765 43210",
  address: "Mumbai, Maharashtra, India",
  social: {
    facebook: "https://facebook.com/littlecloset",
    instagram: "https://instagram.com/littlecloset",
    twitter: "https://twitter.com/littlecloset",
    youtube: "https://youtube.com/littlecloset",
    pinterest: "https://pinterest.com/littlecloset",
  },
  razorpay: {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  },
};
