import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Review from "@/models/Review";

const categories = [
  { name: "Boys Clothing", slug: "boys-clothing", description: "Trendy outfits for boys", icon: "👦", subcategories: [
    { name: "T-Shirts", slug: "t-shirts" },
    { name: "Shirts", slug: "shirts" },
    { name: "Pants", slug: "pants" },
    { name: "Shorts", slug: "shorts" },
    { name: "Denim", slug: "denim" },
  ]},
  { name: "Girls Clothing", slug: "girls-clothing", description: "Adorable outfits for girls", icon: "👧", subcategories: [
    { name: "Dresses", slug: "dresses" },
    { name: "Tops", slug: "tops" },
    { name: "Skirts", slug: "skirts" },
    { name: "Ethnic Wear", slug: "ethnic-wear" },
  ]},
  { name: "Newborn", slug: "newborn", description: "Soft and gentle for newborns", icon: "👶", subcategories: [
    { name: "Onesies", slug: "onesies" },
    { name: "Sleepwear", slug: "sleepwear" },
  ]},
  { name: "Footwear", slug: "footwear", description: "Comfortable shoes for kids", icon: "👟", subcategories: [
    { name: "Sneakers", slug: "sneakers" },
    { name: "Sandals", slug: "sandals" },
  ]},
  { name: "Accessories", slug: "accessories", description: "Complete the look", icon: "🎀", subcategories: [
    { name: "Caps", slug: "caps" },
    { name: "Bags", slug: "bags" },
  ]},
  { name: "Ethnic Wear", slug: "ethnic-wear", description: "Traditional Indian outfits", icon: "🪷", subcategories: [
    { name: "Kurtas", slug: "kurtas" },
    { name: "Lehengas", slug: "lehengas" },
  ]},
];

const placeholderImages = [
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1518831959646-743e1f392f91?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1543854589-fc4a778f8b87?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1596870230751-eb2ce1d4a35c?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop",
];

const productImages: Record<string, string> = {
  "LC-BTS-001": "https://images.unsplash.com/photo-1598731470675-fd2af8f004c6?w=500&h=650&fit=crop",
  "LC-GDR-001": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=650&fit=crop",
  "LC-BJM-001": "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=500&h=650&fit=crop",
  "LC-ETH-001": "https://images.unsplash.com/photo-1725147874926-dfebe6d996ef?w=500&h=650&fit=crop",
  "LC-ETH-002": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=650&fit=crop",
  "LC-BSH-001": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=650&fit=crop",
  "LC-GTP-001": "https://images.unsplash.com/photo-1543854589-fc4a778f8b87?w=500&h=650&fit=crop",
  "LC-BFS-001": "https://images.unsplash.com/photo-1733924304841-7320116fbe69?w=500&h=650&fit=crop",
  "LC-NB-001": "https://images.unsplash.com/photo-1622290291720-ac961c43ee30?w=500&h=650&fit=crop",
  "LC-FW-001": "https://images.unsplash.com/photo-1596870230751-eb2ce1d4a35c?w=500&h=650&fit=crop",
  "LC-BPS-001": "https://images.unsplash.com/photo-1591845466147-c6c601063c3a?w=500&h=650&fit=crop",
  "LC-GAN-001": "https://images.unsplash.com/photo-1518831959646-743e1f392f91?w=500&h=650&fit=crop",
  "LC-BTP-001": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=650&fit=crop",
  "LC-GSK-001": "https://images.unsplash.com/photo-1719408386140-5fbac6ffdcbd?w=500&h=650&fit=crop",
  "LC-AC-001": "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=500&h=650&fit=crop",
  "LC-BCS-001": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=650&fit=crop",
};

const products = [
  { name: "Blue Cotton T-Shirt", sku: "LC-BTS-001", description: "Soft cotton t-shirt for boys", price: 499, mrp: 799, discount: 38, brand: "Little Closet", ageGroup: "3-5Y", gender: "boys", sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"], colors: [{ name: "Blue", hex: "#3B82F6" }, { name: "Navy", hex: "#1E3A5F" }], material: "100% Cotton", subcategory: "T-Shirts", rating: 4.5, reviewCount: 124, stock: 50, isFeatured: true, isTrending: true, isNewArrival: true, isBestSeller: true },
  { name: "Pink Floral Dress", sku: "LC-GDR-001", description: "Beautiful floral print dress for girls", price: 799, mrp: 1299, discount: 38, brand: "Little Closet", ageGroup: "3-5Y", gender: "girls", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: [{ name: "Pink", hex: "#EC4899" }, { name: "White", hex: "#FFFFFF" }], material: "Cotton Blend", subcategory: "Dresses", rating: 4.8, reviewCount: 89, stock: 35, isFeatured: true, isBestSeller: true, isNewArrival: true },
  { name: "Denim Jeans for Boys", sku: "LC-BJM-001", description: "Classic denim jeans with stretch comfort", price: 899, mrp: 1499, discount: 40, brand: "Little Closet", ageGroup: "5-7Y", gender: "boys", sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"], colors: [{ name: "Blue", hex: "#2563EB" }, { name: "Black", hex: "#1F2937" }], material: "Denim", subcategory: "Denim", rating: 4.6, reviewCount: 67, stock: 40, isFeatured: true, isTrending: true },
  { name: "Yellow Kurta Set", sku: "LC-ETH-001", description: "Traditional yellow kurta with white pajama", price: 1199, mrp: 1999, discount: 40, brand: "Little Closet", ageGroup: "5-7Y", gender: "boys", sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: [{ name: "Yellow", hex: "#F59E0B" }, { name: "Green", hex: "#10B981" }], material: "Cotton", subcategory: "Kurtas", rating: 4.7, stock: 25, isFeatured: true, isNewArrival: true },
  { name: "Red Lehenga Choli", sku: "LC-ETH-002", description: "Stunning red lehenga with mirror work", price: 1599, mrp: 2499, discount: 36, brand: "Little Closet", ageGroup: "3-5Y", gender: "girls", sizes: ["2-3Y", "4-5Y", "6-7Y"], colors: [{ name: "Red", hex: "#EF4444" }, { name: "Maroon", hex: "#7F1D1D" }], material: "Silk Blend", subcategory: "Lehengas", rating: 4.9, reviewCount: 45, stock: 15, isFeatured: true, isBestSeller: true },
  { name: "White Cotton Shorts", sku: "LC-BSH-001", description: "Comfortable white cotton shorts", price: 349, mrp: 599, discount: 42, brand: "Little Closet", ageGroup: "1-3Y", gender: "boys", sizes: ["1-2Y", "2-3Y", "3-4Y", "5-6Y"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Grey", hex: "#9CA3AF" }], material: "100% Cotton", subcategory: "Shorts", rating: 4.3, reviewCount: 156, stock: 60, isTrending: true, isBestSeller: true },
  { name: "Rainbow Striped Top", sku: "LC-GTP-001", description: "Colorful striped top for girls", price: 449, mrp: 699, discount: 36, brand: "Little Closet", ageGroup: "3-5Y", gender: "girls", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: [{ name: "Rainbow", hex: "#A855F7" }], material: "Cotton Jersey", subcategory: "Tops", rating: 4.4, stock: 45, isNewArrival: true, isTrending: true },
  { name: "Green Formal Shirt", sku: "LC-BFS-001", description: "Elegant green formal shirt for special occasions", price: 699, mrp: 999, discount: 30, brand: "Little Closet", ageGroup: "7-10Y", gender: "boys", sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: [{ name: "Green", hex: "#059669" }, { name: "Light Green", hex: "#6EE7B7" }], material: "Cotton Blend", subcategory: "Shirts", rating: 4.5, stock: 30, isNewArrival: true },
  { name: "Toddler Onesie Set (3 Pack)", sku: "LC-NB-001", description: "Soft cotton onesie set for newborns", price: 899, mrp: 1499, discount: 40, brand: "Little Closet", ageGroup: "0-6M", gender: "unisex", sizes: ["0-3M", "3-6M", "6-12M"], colors: [{ name: "Pastel Mix", hex: "#FCD34D" }], material: "100% Organic Cotton", subcategory: "Onesies", rating: 4.8, reviewCount: 203, stock: 100, isBestSeller: true, isFeatured: true },
  { name: "Pink Canvas Sneakers", sku: "LC-FW-001", description: "Lightweight pink canvas shoes", price: 599, mrp: 999, discount: 40, brand: "Little Closet", ageGroup: "3-5Y", gender: "girls", sizes: ["10-11 UK", "12-13 UK", "1-2 UK"], colors: [{ name: "Pink", hex: "#EC4899" }, { name: "White", hex: "#FFFFFF" }], material: "Canvas", subcategory: "Sneakers", rating: 4.2, stock: 40, isNewArrival: true },
  { name: "Blue Plaid Shirt", sku: "LC-BPS-001", description: "Classic plaid shirt for boys", price: 599, mrp: 899, discount: 33, brand: "Little Closet", ageGroup: "5-7Y", gender: "boys", sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: [{ name: "Blue Plaid", hex: "#3B82F6" }], material: "Flannel Cotton", subcategory: "Shirts", rating: 4.4, stock: 35, isTrending: true },
  { name: "Ethnic Anarkali Dress", sku: "LC-GAN-001", description: "Beautiful Anarkali dress with embroidery", price: 1299, mrp: 1999, discount: 35, brand: "Little Closet", ageGroup: "5-7Y", gender: "girls", sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: [{ name: "Purple", hex: "#8B5CF6" }, { name: "Pink", hex: "#F472B6" }], material: "Georgette", subcategory: "Ethnic Wear", rating: 4.7, reviewCount: 38, stock: 20, isFeatured: true, isNewArrival: true },
  { name: "Navy Blue Track Pants", sku: "LC-BTP-001", description: "Comfortable track pants for active kids", price: 549, mrp: 899, discount: 39, brand: "Little Closet", ageGroup: "5-7Y", gender: "boys", sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"], colors: [{ name: "Navy", hex: "#1E3A5F" }, { name: "Black", hex: "#1F2937" }], material: "Polyester Blend", subcategory: "Pants", rating: 4.3, stock: 55, isBestSeller: true },
  { name: "Floral Print Skirt", sku: "LC-GSK-001", description: "Cute floral print gathered skirt", price: 499, mrp: 799, discount: 38, brand: "Little Closet", ageGroup: "3-5Y", gender: "girls", sizes: ["2-3Y", "4-5Y", "6-7Y"], colors: [{ name: "Pink Floral", hex: "#F9A8D4" }, { name: "Blue Floral", hex: "#93C5FD" }], material: "Cotton", subcategory: "Skirts", rating: 4.5, stock: 30, isNewArrival: true, isTrending: true },
  { name: "Summer Sun Cap", sku: "LC-AC-001", description: "UV protection sun cap for kids", price: 299, mrp: 499, discount: 40, brand: "Little Closet", ageGroup: "1-3Y", gender: "unisex", sizes: ["S", "M", "L"], colors: [{ name: "Beige", hex: "#D4A574" }, { name: "White", hex: "#FFFFFF" }], material: "Cotton", subcategory: "Caps", rating: 4.1, stock: 80, isTrending: true },
  { name: "Casual Cargo Shorts", sku: "LC-BCS-001", description: "Multi-pocket cargo shorts for boys", price: 599, mrp: 999, discount: 40, brand: "Little Closet", ageGroup: "7-10Y", gender: "boys", sizes: ["5-6Y", "7-8Y", "9-10Y"], colors: [{ name: "Khaki", hex: "#C4A76C" }, { name: "Olive", hex: "#6B8E23" }], material: "Cotton Twill", subcategory: "Shorts", rating: 4.6, stock: 25, isNewArrival: true },
];

const sampleReviews = [
  { productSku: "LC-BTS-001", customerName: "Priya Sharma", customerEmail: "priya@example.com", rating: 5, title: "Amazing quality!", comment: "My son loves this t-shirt. The cotton is very soft and the color hasn't faded after multiple washes. Will buy more!", isVerified: true, isApproved: true },
  { productSku: "LC-BTS-001", customerName: "Rahul Verma", customerEmail: "rahul@example.com", rating: 4, title: "Good value for money", comment: "Nice t-shirt, fits true to size. Only minor issue is the stitching near the collar could be better.", isVerified: true, isApproved: true },
  { productSku: "LC-BTS-001", customerName: "Sneha Patel", customerEmail: "sneha@example.com", rating: 5, title: "Perfect fit!", comment: "Bought this for my 5-year-old and it fits perfectly. The material is breathable and comfortable for summer.", isVerified: false, isApproved: true },
  { productSku: "LC-GDR-001", customerName: "Anita Desai", customerEmail: "anita@example.com", rating: 5, title: "Beautiful dress!", comment: "My daughter looks absolutely adorable in this floral dress. The print is vibrant and the fabric is high quality.", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-001", customerName: "Kavita Joshi", customerEmail: "kavita@example.com", rating: 4, title: "Lovely dress", comment: "Great dress for parties. The stitching is neat. Would have given 5 stars if the zipper was smoother.", isVerified: true, isApproved: true },
  { productSku: "LC-BJM-001", customerName: "Vikram Singh", customerEmail: "vikram@example.com", rating: 5, title: "Best jeans for kids", comment: "Very comfortable with good stretch. My active 7-year-old can play freely in these. Highly recommend!", isVerified: true, isApproved: true },
  { productSku: "LC-ETH-001", customerName: "Meera Gupta", customerEmail: "meera@example.com", rating: 5, title: "Perfect for festivals", comment: "Bought this for Diwali and my son looked hands down. The kurta is well-stitched and the color is vibrant.", isVerified: true, isApproved: true },
  { productSku: "LC-ETH-002", customerName: "Pooja Reddy", customerEmail: "pooja@example.com", rating: 5, title: "Stunning lehenga!", comment: "The mirror work is beautiful and my daughter felt like a princess. Worth every rupee!", isVerified: true, isApproved: true },
  { productSku: "LC-BSH-001", customerName: "Arun Nair", customerEmail: "arun@example.com", rating: 4, title: "Good everyday shorts", comment: "Comfortable shorts for daily wear. The cotton quality is good but could be a bit thicker.", isVerified: true, isApproved: true },
  { productSku: "LC-NB-001", customerName: "Deepa Menon", customerEmail: "deepa@example.com", rating: 5, title: "Softest onesies ever!", comment: "Perfect for newborns. The organic cotton is incredibly gentle on my baby's skin. Great pack!", isVerified: true, isApproved: true },
  { productSku: "LC-NB-001", customerName: "Rohit Kumar", customerEmail: "rohit@example.com", rating: 5, title: "Must buy for new parents", comment: "Excellent quality and the snap buttons are easy to use. My wife and I love these onesies.", isVerified: true, isApproved: true },
  { productSku: "LC-FW-001", customerName: "Nisha Agarwal", customerEmail: "nisha@example.com", rating: 4, title: "Cute sneakers", comment: "My daughter loves wearing these. They're lightweight and easy to put on. The pink color is lovely.", isVerified: true, isApproved: true },
  { productSku: "LC-GAN-001", customerName: "Fatima Khan", customerEmail: "fatima@example.com", rating: 5, title: "Gorgeous Anarkali", comment: "The embroidery work is exquisite. My daughter wore this for a wedding and got so many compliments!", isVerified: true, isApproved: true },
  { productSku: "LC-BTP-001", customerName: "Sanjay Mehta", customerEmail: "sanjay@example.com", rating: 4, title: "Good track pants", comment: "Comfortable and durable. My son wears these to school every day. The elastic waistband is stretchy and holds well.", isVerified: true, isApproved: true },
  { productSku: "LC-GSK-001", customerName: "Divya Rao", customerEmail: "divya@example.com", rating: 5, title: "Adorable skirt!", comment: "The floral print is so pretty and the skirt twirls perfectly. My daughter doesn't want to take it off!", isVerified: true, isApproved: true },
  { productSku: "LC-AC-001", customerName: "Manish Tiwari", customerEmail: "manish@example.com", rating: 4, title: "Nice sun cap", comment: "Good quality cap with proper UV protection. Fits well and stays on even on windy days.", isVerified: true, isApproved: true },
];

export async function POST() {
  try {
    await connectDB();

    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return NextResponse.json({ success: false, error: "Database already has products. Use PATCH /api/seed to re-seed." }, { status: 400 });
    }

    return await seedAll();
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await connectDB();
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    return await seedAll();
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function seedAll() {
    const createdCategories = await Category.insertMany(categories);
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    createdCategories.forEach((cat) => { categoryMap[cat.slug] = cat._id; });

    const categorySlugMap: Record<string, string> = {
      "t-shirts": "boys-clothing",
      "shirts": "boys-clothing",
      "pants": "boys-clothing",
      "shorts": "boys-clothing",
      "denim": "boys-clothing",
      "dresses": "girls-clothing",
      "tops": "girls-clothing",
      "skirts": "girls-clothing",
      "ethnic wear": "ethnic-wear",
      "onesies": "newborn",
      "sleepwear": "newborn",
      "sneakers": "footwear",
      "sandals": "footwear",
      "caps": "accessories",
      "bags": "accessories",
      "kurtas": "ethnic-wear",
      "lehengas": "ethnic-wear",
    };

    const productsToInsert = products.map((p, i) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+/, "").replace(/-+$/, ""),
      category: categoryMap[categorySlugMap[p.subcategory] || "boys-clothing"],
      thumbnail: productImages[p.sku] || placeholderImages[i % placeholderImages.length],
      images: [{ url: productImages[p.sku] || placeholderImages[i % placeholderImages.length], alt: p.name }],
      tags: [p.gender, p.ageGroup, p.material, p.brand],
      isActive: true,
    }));

    await Product.insertMany(productsToInsert);

    // Create a SKU-to-product-ID map for reviews
    const createdProducts = await Product.find({ sku: { $in: sampleReviews.map((r) => r.productSku) } }).lean();
    const skuToId: Record<string, mongoose.Types.ObjectId> = {};
    createdProducts.forEach((p: any) => { skuToId[p.sku] = p._id; });

    const reviewsToInsert = sampleReviews
      .filter((r) => skuToId[r.productSku])
      .map((r) => ({
        product: skuToId[r.productSku],
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerified: r.isVerified,
        isApproved: r.isApproved,
      }));

    if (reviewsToInsert.length > 0) {
      await Review.insertMany(reviewsToInsert);
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdCategories.length} categories, ${productsToInsert.length} products, and ${reviewsToInsert.length} reviews`,
    });
}
