import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../../model/Order";
import db from "../../../../utils/db";

const handler = nc();

handler.put(
  "/api/order/pay/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = getSession({ req });
    if (!session) {
      res.status(401).json({ message: "Unauthenticated!" });
    }

    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
      if (order.isPaid) {
        res.status(400).json({ message: "order is already paid!" });
      }
    
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
      };
      const paidOrder = await order.save();
      await db.disconnect();
      res
        .status(200)
        .json({ message: "order paid successfully", order: paidOrder });
    } else {
      await db.disconnect();
      res.status(404).json({ message: "Order Not Found!" });
    }
  }
);
export default handler;
