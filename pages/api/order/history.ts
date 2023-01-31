import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../model/Order";
import db from "../../../utils/db";

const handler = nc();

handler.get(
  "/api/order/history",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: "Signin Required!" });
    }

    const page = (req?.query?.page && parseInt(req?.query?.page[0])) || 1;
    await db.connect();
    const orders = await Order.find({ user: session._id })
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 });

    const pagesNum = Math.ceil(
      (await Order.find({ user: session._id }).count()) / 10
    );
    await db.disconnect();
    res.json({ orders, pagesNum });
  }
);

export default handler;
