import db from "../../utils/db";
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import User from "../../model/User";
import Product from "../../model/Product";
import data from "../../utils/data";
import { getSession } from "next-auth/react";
import Order from "../../model/Order";

const handler = nc();

handler.get("/api/seed", async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === "production") {
    res.status(401).json({ message: "unauthorized" });
  }
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await User.deleteMany();
  await User.insertMany(data.users);
  await Order.deleteMany();
  res.json({ message: "seeded successfully" });
  return;
});

export default handler;
