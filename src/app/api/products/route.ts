import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const slug = searchParams.get("slug");
    const sort = searchParams.get("sort") || "newest";
    const includeInactive = searchParams.get("includeInactive") === "true";
    const idsParam = searchParams.get("ids");

    let filter: any = {};

    if (!includeInactive) {
      filter.isActive = true;
    }

    if (idsParam) {
      const ids = idsParam.split(",").map((s) => s.trim()).filter((id) => mongoose.isValidObjectId(id));
      if (ids.length > 0) {
        filter._id = { $in: ids };
      }
    }

    if (slug) filter.slug = slug;

    // Smart category matching
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      if (mongoose.isValidObjectId(categoryParam)) {
        filter.category = categoryParam;
      } else {
        const cat: any = await Category.findOne({
          $or: [
            { slug: categoryParam.toLowerCase() },
            { name: new RegExp(`^${categoryParam}$`, "i") },
          ],
        }).lean();

        if (cat) {
          filter.category = cat._id;
        } else {
          filter.$or = [
            { subcategory: new RegExp(`^${categoryParam}$`, "i") },
            { tags: new RegExp(`^${categoryParam}$`, "i") },
          ];
        }
      }
    }

    if (searchParams.get("subcategory")) {
      filter.subcategory = new RegExp(`^${searchParams.get("subcategory")}$`, "i");
    }

    if (searchParams.get("gender")) filter.gender = searchParams.get("gender");

    const ageGroupParam = searchParams.get("ageGroup") || searchParams.get("ageGroups");
    if (ageGroupParam) {
      const ages = ageGroupParam.split(",").map((a) => a.trim()).filter(Boolean);
      if (ages.length === 1) {
        filter.$or = [
          { ageGroup: ages[0] },
          { ageGroups: ages[0] },
          { ageGroups: { $in: ages } },
        ];
      } else if (ages.length > 1) {
        filter.$or = [
          { ageGroup: { $in: ages } },
          { ageGroups: { $in: ages } },
        ];
      }
    }

    if (searchParams.get("brand")) filter.brand = searchParams.get("brand");
    if (searchParams.get("color")) filter["colors.name"] = searchParams.get("color");
    if (searchParams.get("size")) filter.sizes = searchParams.get("size");
    if (searchParams.get("isFeatured") === "true") filter.isFeatured = true;
    if (searchParams.get("isNewArrival") === "true") filter.isNewArrival = true;
    if (searchParams.get("isTrending") === "true") filter.isTrending = true;
    if (searchParams.get("isBestSeller") === "true") filter.isBestSeller = true;
    if (searchParams.get("showInHero") === "true") filter.showInHero = true;
    if (searchParams.get("inStock") === "true") filter.stock = { $gt: 0 };
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
      filter.price = {};
      if (searchParams.get("minPrice")) filter.price.$gte = parseInt(searchParams.get("minPrice")!);
      if (searchParams.get("maxPrice")) filter.price.$lte = parseInt(searchParams.get("maxPrice")!);
    }
    if (searchParams.get("discount")) {
      filter.discount = { $gte: parseInt(searchParams.get("discount")!) };
    }

    let sortObj: any = {};
    switch (sort) {
      case "price_asc": sortObj = { price: 1 }; break;
      case "price_desc": sortObj = { price: -1 }; break;
      case "popularity": sortObj = { reviewCount: -1 }; break;
      case "rating": sortObj = { rating: -1 }; break;
      case "discount": sortObj = { discount: -1 }; break;
      default: sortObj = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();

    if (body.ageGroups && Array.isArray(body.ageGroups) && body.ageGroups.length > 0) {
      if (!body.ageGroup) body.ageGroup = body.ageGroups.join(", ");
    } else if (body.ageGroup && (!body.ageGroups || body.ageGroups.length === 0)) {
      body.ageGroups = [body.ageGroup];
    }

    const slug = body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const product = await Product.create({ ...body, slug });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/admin/products");
    } catch {}

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
