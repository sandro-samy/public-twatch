import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import React from "react";
import Product from "../../../model/Product";
import db from "../../../utils/db";

const handler = nextConnect();

handler.get(
  "api/product/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    await db.connect();
    const product = await Product.find({ _id: id });
    await db.disconnect();
    res.json(product);
  }
);

export default handler;
