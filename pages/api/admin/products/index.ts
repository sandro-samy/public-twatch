import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Product from "../../../../model/Product";
import db from "../../../../utils/db";

const handler = nc();

handler.use(
  "/api/admin/products",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    await db.connect();
    const session: any = await getSession({ req });
    if (!session || (session && !session.isAdmin)) {
      await db.disconnect();
      res.status(401).json({ message: "unauthorized" });
    }
    next();
  }
);

handler.get(
  "/api/admin/products",
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const page = (req?.query?.page && parseInt(req?.query?.page[0])) || 1;

      const products = await Product.find({})
        .skip((page - 1) * 8)
        .limit(8)
        .sort({ createdAt: -1 });
      const pagesNum = Math.ceil((await Product.find({}).count()) / 8);
      await db.disconnect();
      res.json({ products, pagesNum });
    } catch (error: any) {
      res.json({ message: error.message });
    }
  }
);

handler.post(
  "/api/admin/products",
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const {
        name,
        slug,
        price,
        image,
        gender,
        brand,
        countInStock,
        description,
      } = req.body;
      if (
        !name ||
        !slug ||
        !price ||
        !image ||
        !gender ||
        !brand ||
        (!countInStock && countInStock !== 0) ||
        !description
      ) {
        res.status(400).json({ message: "Bad Request!" });
      }
      await db.connect();
      const newProduct = await new Product({
        name,
        slug,
        price,
        image,
        gender,
        brand,
        countInStock,
        description,
      });
      const product = await newProduct.save();
      await db.disconnect();
      res.json({ message: `product ${product.name} created succcessfully!` });
    } catch (error: any) {
      console.log(error.message);
      res.json({ message: error.message });
    }
  }
);

export default handler;
