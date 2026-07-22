export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  features: string[];
  careInstructions: string[];
  price: number;
  discount: number;
  mrp: number;
  category: ICategory;
  subcategory: string;
  brand: string;
  ageGroup: string;
  gender: "boys" | "girls" | "unisex";
  sizes: string[];
  colors: { name: string; hex: string }[];
  material: string;
  images: { url: string; alt: string }[];
  videos: { url: string; alt: string }[];
  thumbnail: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentCategory?: string;
  subcategories: { name: string; slug: string }[];
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  invoiceNumber: string;
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
    product: IProduct;
    quantity: number;
    size: string;
    color: string;
    price: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minimumOrder: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBanner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: "hero" | "promo" | "offer" | "popup" | "video";
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  type: "homepage" | "product" | "promo";
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  product: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITestimonial {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export interface ISubscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface ISettings {
  _id: string;
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
  metaTags: {
    title: string;
    description: string;
    keywords: string[];
  };
  updatedAt: string;
}

export interface IAnalytics {
  _id: string;
  date: string;
  visitors: number;
  pageViews: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  size: string;
  color: string;
}

export interface ICartState {
  items: ICartItem[];
  isOpen: boolean;
  coupon: ICoupon | null;
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (coupon: ICoupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getGst: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  gender?: string;
  ageGroup?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  discount?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}
