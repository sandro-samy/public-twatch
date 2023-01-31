import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../../model/Order";
import db from "../../../../utils/db";

const handler = nc();

handler.get(
  "/api/admin/orders",
  async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const session: any = await getSession({ req });
    if (!session || (session && !session.isAdmin)) {
      await db.disconnect();
      res.status(401).json({ message: "unauthorized" });
    }
    const page = (req?.query?.page && parseInt(req?.query?.page[0])) || 1;

    const orders = await Order.find({})
      .populate("user", "name")
      .skip((page - 1) * 8)
      .limit(8)
      .sort({ createdAt: -1 });
    const pagesNum = Math.ceil((await Order.find({}).count()) / 8);
    await db.disconnect();
    res.json({ orders, pagesNum });
  }
);

export default handler;
