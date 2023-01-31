import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../model/Order";
import Product from "../../../model/Product";
import User from "../../../model/User";
import db from "../../../utils/db";

const handler = nc();

handler.get(
  "/api/admin/summary",
  async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();

    const session: any = await getSession({ req });
    if (!session || (session && !session.isAdmin)) {
      await db.disconnect();
      res.status(401).json({ message: "unauthorized" });
    }

    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const ordersPriceGroup = await Order.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%m-%Y", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    await db.disconnect();
    res.json({
      ordersCount,
      productsCount,
      usersCount,
      ordersPrice,
      salesData,
    });
  }
);

export default handler;
