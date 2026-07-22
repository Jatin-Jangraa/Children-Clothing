import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(price: number, mrp: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function generateSKU(category: string, id: string): string {
  const prefix = category.substring(0, 3).toUpperCase();
  return `${prefix}-${id.substring(0, 6).toUpperCase()}`;
}

export function generateInvoiceNumber(orderCount: number): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const num = String(orderCount).padStart(4, "0");
  return `LC${year}${month}${num}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-50",
    confirmed: "text-blue-600 bg-blue-50",
    processing: "text-purple-600 bg-purple-50",
    shipped: "text-indigo-600 bg-indigo-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    refunded: "text-orange-600 bg-orange-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
}

export function generateGoogleStructuredData(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img: any) => img.url) || [],
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  };
}
