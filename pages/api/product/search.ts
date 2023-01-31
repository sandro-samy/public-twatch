import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import React from "react";
import Product from "../../../model/Product";
import db from "../../../utils/db";

const handler = nc();

handler.get(
  "/api/product/search",
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await db.connect();
      const options = await Product.find({}).select({
        value: "$slug",
        label: "$name",
      });
      await db.disconnect();
      res.json({ options });
    } catch (error: any) {
      res.json({ message: error.message });
    }
  }
);

export default handler;
