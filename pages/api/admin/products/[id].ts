import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import Product from "../../../../model/Product";
import db from "../../../../utils/db";

const handler = nc();

handler.use(
  "/api/admin/products:id",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    console.log(req);
    const session: any = await getSession({ req });
    if (!session || (session && !session.isAdmin)) {
      res.status(401).json({ message: "unauthorized" });
    }
    next();
  }
);

handler.put(
  "/api/admin/products/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
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
        await db.disconnect();
        res.status(400).json({ message: "Bad Request!" });
      }
      product.name = name;
      product.slug = slug;
      product.price = price;
      product.image = image;
      product.gender = gender;
      product.brand = brand;
      product.countInStock = countInStock;
      product.description = description;
      await product.save();
      await db.disconnect();
      res.json({ message: `product ${name} updated successfully`, product });
    } else {
      await db.disconnect();
      res.status(404).json({ message: "product not found!" });
    }
  }
);

handler.delete(
  "/api/admin/products/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
      const { name } = product;
      await product.remove();
      await db.disconnect();
      res.json({ message: `product ${name} deleted successfully` });
    } else {
      await db.disconnect();
      res.status(404).json({ message: `product not found!` });
    }
  }
);

export default handler;
