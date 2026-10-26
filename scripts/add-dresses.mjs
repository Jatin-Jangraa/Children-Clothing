import mongoose from "mongoose";

const dresses = [
  {
    name: "Sparkle Fairy Tulle Princess Dress",
    sku: "LC-GDR-002",
    description: "Exquisite layered tulle party frock with soft satin lining, shimmering flutter sleeves, and a delicate satin waist bow. Perfect for birthdays, weddings, and celebrations.",
    features: ["Multi-layered sparkle tulle skirt", "Soft 100% cotton inner lining", "Concealed back zipper with satin bow", "Gentle on sensitive skin"],
    careInstructions: ["Hand wash in cold water", "Do not wring", "Line dry in shade", "Warm iron on reverse side"],
    price: 1199,
    mrp: 1899,
    discount: 37,
    brand: "Princess Collection",
    ageGroup: "3-5Y",
    gender: "girls",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    colors: [{ name: "Lavender", hex: "#C4B5FD" }, { name: "Pink", hex: "#EC4899" }],
    material: "Silk Blend",
    subcategory: "Dresses",
    rating: 4.9,
    reviewCount: 34,
    stock: 40,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    showInHero: true,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=650&fit=crop",
  },
  {
    name: "Yellow Daisy Cotton Sundress",
    sku: "LC-GDR-003",
    description: "Vibrant sunny yellow sundress crafted from pure organic cotton, featuring sweet hand-embroidered daisy motifs, ruffled flutter straps, and elasticated back for a snug, flexible fit.",
    features: ["Pure breathable organic cotton", "Hand-embroidered daisy detailing", "Ruffle flutter sleeves", "Elastic smocked back for comfort"],
    careInstructions: ["Machine wash gentle cycle", "Tumble dry low", "Medium steam iron"],
    price: 699,
    mrp: 1099,
    discount: 36,
    brand: "Blossom Kids",
    ageGroup: "2-3Y",
    gender: "girls",
    sizes: ["18-24M", "2-3Y", "3-4Y", "4-5Y"],
    colors: [{ name: "Yellow", hex: "#EAB308" }, { name: "White", hex: "#FFFFFF" }],
    material: "100% Organic Cotton",
    subcategory: "Dresses",
    rating: 4.8,
    reviewCount: 42,
    stock: 50,
    isFeatured: false,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: true,
    showInHero: true,
    image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5c1?w=500&h=650&fit=crop",
  },
  {
    name: "Pastel Peach Polka Dot Tiered Dress",
    sku: "LC-GDR-004",
    description: "Playful peach fit-and-flare tiered dress with timeless white polka dots. Made with breezy lightweight cotton blend fabric that offers all-day comfort for casual outings and parties.",
    features: ["Tiered ruffle flare silhouette", "Classic polka dot print", "Lightweight and breathable", "Back button closure"],
    careInstructions: ["Machine wash cold", "Do not bleach", "Iron on medium heat"],
    price: 799,
    mrp: 1299,
    discount: 38,
    brand: "Little Closet",
    ageGroup: "3-5Y",
    gender: "girls",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"],
    colors: [{ name: "Peach", hex: "#FBBF9B" }, { name: "Coral", hex: "#FB7185" }],
    material: "Cotton Blend",
    subcategory: "Dresses",
    rating: 4.7,
    reviewCount: 28,
    stock: 45,
    isFeatured: true,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: false,
    showInHero: true,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=650&fit=crop",
  },
  {
    name: "Royal Maroon Velvet Party Frock",
    sku: "LC-GDR-005",
    description: "Rich wine maroon velvet dress featuring delicate gold lace collar and cuffs, paired with a pleated flare skirt. Luxurious choice for festive gatherings, birthdays, and winter celebrations.",
    features: ["Ultra-soft plush velvet texture", "Gold lace trim on Peter Pan collar", "Pleated flare silhouette", "Soft cotton inner lining"],
    careInstructions: ["Dry clean recommended", "Do not bleach", "Steam iron inside out"],
    price: 1399,
    mrp: 2199,
    discount: 36,
    brand: "Princess Collection",
    ageGroup: "5-7Y",
    gender: "girls",
    sizes: ["3-4Y", "4-5Y", "5-6Y", "7-8Y"],
    colors: [{ name: "Red", hex: "#EF4444" }, { name: "Navy", hex: "#1E3A5F" }],
    material: "Fleece",
    subcategory: "Dresses",
    rating: 4.9,
    reviewCount: 19,
    stock: 30,
    isFeatured: true,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=650&fit=crop",
  },
  {
    name: "Vintage Mint Green Smocked Frock",
    sku: "LC-GDR-006",
    description: "Classic vintage-inspired mint frock with delicate hand-smocked floral embroidery across the chest, scalloped Peter Pan collar, and flutter cap sleeves. A graceful everyday heirloom.",
    features: ["Intricate hand-smocked chest panel", "Embroidered Peter Pan collar", "Gathered airy skirt", "Back button placket"],
    careInstructions: ["Machine wash gentle with similar colors", "Line dry", "Warm iron"],
    price: 899,
    mrp: 1499,
    discount: 40,
    brand: "Tiny Trend",
    ageGroup: "2-3Y",
    gender: "girls",
    sizes: ["18-24M", "2-3Y", "3-4Y", "4-5Y"],
    colors: [{ name: "Mint", hex: "#A7F3D0" }, { name: "White", hex: "#FFFFFF" }],
    material: "100% Cotton",
    subcategory: "Dresses",
    rating: 4.8,
    reviewCount: 22,
    stock: 38,
    isFeatured: false,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&h=650&fit=crop",
  },
  {
    name: "Baby Pink Rainbow Tutu Dress",
    sku: "LC-GDR-007",
    description: "Enchanting baby pink knitted bodice merged with a pastel rainbow ombre layered tutu skirt. Features a matching removable satin ribbon belt for little dancing divas.",
    features: ["Soft ribbed cotton stretch bodice", "Pastel rainbow ombre layered tulle skirt", "Removable satin ribbon sash", "Scratch-free inner lining"],
    careInstructions: ["Hand wash recommended", "Hang to dry", "Do not iron tulle directly"],
    price: 999,
    mrp: 1599,
    discount: 38,
    brand: "Princess Collection",
    ageGroup: "3-5Y",
    gender: "girls",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    colors: [{ name: "Pink", hex: "#EC4899" }, { name: "Lavender", hex: "#C4B5FD" }],
    material: "Cotton Blend",
    subcategory: "Dresses",
    rating: 4.9,
    reviewCount: 31,
    stock: 44,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    showInHero: true,
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=500&h=650&fit=crop",
  },
];

const sampleReviews = [
  { productSku: "LC-GDR-002", customerName: "Ananya Iyer", customerEmail: "ananya@example.com", rating: 5, title: "Pure magic!", comment: "Bought this for my 4-year-old's birthday party. She looked like a real princess! The inner cotton lining is super soft so no itching at all.", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-002", customerName: "Meenakshi Sundaram", customerEmail: "meenakshi@example.com", rating: 5, title: "Stunning frock", comment: "The quality of the sparkle tulle and the bow is fantastic. Truly worth every rupee.", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-003", customerName: "Shalini Saxena", customerEmail: "shalini@example.com", rating: 5, title: "So cheerful and soft!", comment: "The daisy embroidery is so neat and the yellow color is bright and cheerful. Perfect lightweight dress for summer outings.", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-004", customerName: "Ritu Kapoor", customerEmail: "ritu@example.com", rating: 5, title: "Lovely twirl dress", comment: "My daughter loves spinning in this tiered dress. Peach color looks gorgeous and fabric washed very well.", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-005", customerName: "Sunita Roy", customerEmail: "sunita@example.com", rating: 5, title: "Royal festive look", comment: "The velvet fabric is rich and premium. The gold lace details give it a royal touch. Highly recommended for weddings!", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-006", customerName: "Bhavna Chawla", customerEmail: "bhavna@example.com", rating: 5, title: "Exceptional craftsmanship", comment: "The hand-smocked panel reminds me of classic boutique dresses. Exceeded my expectations!", isVerified: true, isApproved: true },
  { productSku: "LC-GDR-007", customerName: "Kritika Malhotra", customerEmail: "kritika@example.com", rating: 5, title: "Daughter's absolute favorite", comment: "The rainbow colors are soft pastel and the top is stretchy comfortable cotton. She never wants to take it off!", isVerified: true, isApproved: true },
];

async function run() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/children-clothing";
  console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, "//***:***@")}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    console.log("\nIf you are using MongoDB Atlas or a remote database, run:\n");
    console.log('  node --env-file=.env.local scripts/add-dresses.mjs');
    console.log('or set MONGODB_URI directly in your environment.');
    process.exit(1);
  }

  const db = mongoose.connection.db;
  const categoriesCollection = db.collection("categories");
  const productsCollection = db.collection("products");
  const reviewsCollection = db.collection("reviews");

  // Ensure "Girls Clothing" category exists
  let girlsCategory = await categoriesCollection.findOne({ slug: "girls-clothing" });
  if (!girlsCategory) {
    console.log("Creating 'Girls Clothing' category...");
    const catResult = await categoriesCollection.insertOne({
      name: "Girls Clothing",
      slug: "girls-clothing",
      description: "Adorable outfits for girls",
      icon: "👧",
      subcategories: [
        { name: "Dresses", slug: "dresses" },
        { name: "Tops", slug: "tops" },
        { name: "Skirts", slug: "skirts" },
        { name: "Ethnic Wear", slug: "ethnic-wear" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    girlsCategory = { _id: catResult.insertedId };
  }

  console.log(`Using Category ID for Girls Clothing: ${girlsCategory._id}`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of dresses) {
    const slug = item.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    const productDoc = {
      name: item.name,
      slug: slug,
      sku: item.sku,
      description: item.description,
      features: item.features,
      careInstructions: item.careInstructions,
      price: item.price,
      discount: item.discount,
      mrp: item.mrp,
      category: girlsCategory._id,
      subcategory: item.subcategory,
      brand: item.brand,
      ageGroup: item.ageGroup,
      gender: item.gender,
      sizes: item.sizes,
      colors: item.colors,
      material: item.material,
      thumbnail: item.image,
      images: [{ url: item.image, alt: item.name }],
      videos: [],
      tags: [item.gender, item.ageGroup, item.material, item.brand, "dresses", "girls dresses", "party wear"],
      rating: item.rating,
      reviewCount: item.reviewCount,
      stock: item.stock,
      isFeatured: item.isFeatured,
      isTrending: item.isTrending,
      isBestSeller: item.isBestSeller,
      isNewArrival: item.isNewArrival,
      showInHero: item.showInHero ?? false,
      isActive: true,
      seoTitle: `${item.name} | Little Closet`,
      seoDescription: item.description,
      seoKeywords: [item.name, "girls dress", "kids fashion", item.brand],
      updatedAt: new Date(),
    };

    const existing = await productsCollection.findOne({ sku: item.sku });
    if (existing) {
      await productsCollection.updateOne({ _id: existing._id }, { $set: productDoc });
      console.log(`Updated product: ${item.name} (${item.sku})`);
      updatedCount++;
    } else {
      productDoc.createdAt = new Date();
      await productsCollection.insertOne(productDoc);
      console.log(`Added new product: ${item.name} (${item.sku})`);
      insertedCount++;
    }
  }

  // Insert reviews for newly added dresses
  for (const r of sampleReviews) {
    const prod = await productsCollection.findOne({ sku: r.productSku });
    if (prod) {
      const existingReview = await reviewsCollection.findOne({ product: prod._id, customerEmail: r.customerEmail });
      if (!existingReview) {
        await reviewsCollection.insertOne({
          product: prod._id,
          customerName: r.customerName,
          customerEmail: r.customerEmail,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          isVerified: r.isVerified,
          isApproved: r.isApproved,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Added review by ${r.customerName} for ${r.productSku}`);
      }
    }
  }

  console.log(`\nDone! Successfully processed ${dresses.length} little girls' dresses (${insertedCount} inserted, ${updatedCount} updated).`);
  await mongoose.disconnect();
}

run();
