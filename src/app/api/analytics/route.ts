import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Analytics from "@/models/Analytics";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const analytics = await Analytics.find({ date: { $gte: startDate.toISOString().split("T")[0] } }).sort({ date: 1 }).lean();
    const totalRevenue = analytics.reduce((sum: number, a: any) => sum + a.revenue, 0);
    const totalOrders = analytics.reduce((sum: number, a: any) => sum + a.orders, 0);
    const totalVisitors = analytics.reduce((sum: number, a: any) => sum + a.visitors, 0);

    // Stock alerts
    const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true }).lean();

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        summary: { totalRevenue, totalOrders, totalVisitors, avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0, conversionRate: totalVisitors > 0 ? Math.round((totalOrders / totalVisitors) * 100 * 100) / 100 : 0 },
        lowStockProducts,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
