import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import User from "../../../../model/User";
import db from "../../../../utils/db";

const handler = nc();

handler.use(async (req: NextApiRequest, res: NextApiResponse, next: any) => {
  await db.connect();
  const session: any = await getSession({ req });
  if (!session || (session && !session.isAdmin)) {
    await db.disconnect();
    res.status(401).json({ message: "unauthorized" });
  }
  next();
});

handler.get(
  "/api/admin/users",
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const page = (req?.query?.page && parseInt(req?.query?.page[0])) || 1;

      const users = await User.find({})
        .skip((page - 1) * 8)
        .limit(8)
        .sort({ createdAt: -1 });
      const pagesNum = Math.ceil((await User.find({}).count()) / 8);
      await db.disconnect();
      res.json({ users, pagesNum });
    } catch (error: any) {
      res.json({ message: error.message });
    }
  }
);

export default handler