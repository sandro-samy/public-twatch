import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../../model/Order";
import Product from "../../../../model/Product";
import db from "../../../../utils/db";

const handler = nc();

handler.put(
  "/api/admin/orders/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const session: any = await getSession({ req });
    if (!session || (session && !session.isAdmin)) {
      await db.disconnect();
      res.status(401).json({ message: "unauthorized" });
    }
    const order = await Order.findById(req.query.id);
    if (order) {
      if (req.body?.isDelivered) {
        order.deliveredAt = Date.now();
        order.isDelivered = true;
      }
      if (req.body?.isPaid) {
        order.paidAt = Date.now();
        order.isPaid = true;
      }
      const updateOrder = await order.save();
      await db.disconnect();
      res.json(updateOrder);
    } else {
      await db.disconnect();
      res.status(404).json({ message: "Order Not Found!" });
    }
  }
);

export default handler;
