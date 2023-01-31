import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Order from "../../../model/Order";
import db from "../../../utils/db";

const handler = nc();

handler.get(
  "/api/order/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session: any = await getSession({ req });
      if (!session) {
        return res.status(401).send("Signin Required!");
      }
      await db.connect();
      console.log(req.query.id);
      const order: any = await Order.findById(req.query.id);

      await db.disconnect();
      if (order?.user !== session._id && !session.isAdmin) {
        res.status(403).json({ message: "Unauthenticated!" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Something went Wrong!" });
    }
  }
);

export default handler;
