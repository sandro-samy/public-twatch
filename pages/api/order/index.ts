import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../model/Order";
import db from "../../../utils/db";

const handler = nc();

handler.post(
  "/api/order",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Signin Required!" });
    }
    const { orderItems } = req.body;
    await db.connect();
    const newOrder = new Order({
      user: session._id,
      ...req.body,
    });

    const order = await newOrder.save();
    await db.disconnect();
    res.status(201).json(order);
  }
);

export default handler;
