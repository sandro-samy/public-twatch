import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Product from "../../../model/Product";
import User from "../../../model/User";
import db from "../../../utils/db";

const handler = nc();

handler.get(
  "/api/wishlist",
  async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const session: any = await getSession({ req });
    if (!session._id) {
      res.json([]);
    }
    const user = (Product && await User.findById(session._id).populate("wishList")) || [];
    await db.disconnect();
    const { wishList } = user;
    res.json(wishList);
  }
);
handler.post(
  "/api/wishlist",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = await getSession({ req });
    if (!session._id) {
      res.status(401).json({ message: "unauthorized!" });
    }
    const { productId } = req.query;
    if (!productId) {
      return res.status(40).json({ message: "product id is required!" });
    }
    await db.connect();
    const user = await User.findById(session._id);
    const wishList = JSON.parse(JSON.stringify(user?.wishList)) || [];
    if (wishList.includes(productId)) {
      await db.disconnect();

      return res.json({ message: "product already in wishList" });
    }
    user.wishList = [...wishList, productId];
    await user.save();
    await db.disconnect();
    res.json({ message: "added to wishList successfully" });
  }
);
handler.delete(
  "/api/wishlist",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = await getSession({ req });
    if (!session._id) {
      res.status(401).json({ message: "unauthorized!" });
    }
    const { productId } = req.query;
    if (!productId) {
      res.status(40).json({ message: "product id is required!" });
    }
    await db.connect();
    const user = await User.findById(session._id);
    user.wishList = JSON.parse(JSON.stringify(user.wishList)).filter(
      (id: string) => id !== productId
    );
    await user.save();
    await db.disconnect();
    res.json({ message: "updated wishList successfully" });
  }
);
export default handler;
