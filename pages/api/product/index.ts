import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import React from "react";
import Product from "../../../model/Product";
import db from "../../../utils/db";

const handler = nc();

handler.get(
  "api/product",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const page = (req?.query?.page && parseInt(req?.query?.page[0])) || 1;
    const type = req?.query?.page;
    await db.connect();
    if (page && typeof type === undefined) {
      const products = await Product.find({})
        .skip((page - 1) * 16)
        .limit(16);
      const pagesNum = Math.ceil((await Product.find({}).count()) / 16);
      await db.disconnect();
      res.json({ products, pagesNum });
    } else if (type === "search") {
      const options = await Product.find({}).select({
        value: "$slug",
        label: "$name",
      });
      await db.disconnect();
      res.json({ options });
    }
  }
);

export default handler;
