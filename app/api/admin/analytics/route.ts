import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [revenueData, orderStats, totalCustomers, topProducts, ordersByStatus, topCustomers, outOfStockProducts] =
    await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            name: { $first: "$items.name" },
            image: { $first: "$items.image" },
            sales: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: "$user",
            totalSpent: { $sum: "$total" },
            orderCount: { $sum: 1 },
            lastOrder: { $max: "$createdAt" },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            name: "$user.name",
            email: "$user.email",
            totalSpent: 1,
            orderCount: 1,
            lastOrder: 1,
          },
        },
      ]),
      Product.find({ stock: 0 }, { name: 1, slug: 1 }).lean(),
    ]);

  return NextResponse.json({
    totalRevenue: orderStats[0]?.total || 0,
    totalOrders: orderStats[0]?.count || 0,
    totalCustomers,
    revenueByMonth: revenueData.map((d) => ({ month: d._id, revenue: d.revenue })),
    topProducts,
    ordersByStatus: ordersByStatus.map((d) => ({ status: d._id, count: d.count })),
    topCustomers,
    outOfStockProducts,
  });
}
