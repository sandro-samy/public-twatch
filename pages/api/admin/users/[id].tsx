import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
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

handler.delete(
  "/api/admin/users/:id",
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      console.log(req.query.id);
      const user = await User.findById(req.query.id);
      if (user) {
        if (user.isSuperAdmin) {
          await db.disconnect();
          return res.status(400).json({ message: "super admin can not be deleted!" });
        }
        const { name } = user;
        user.remove();
        await db.disconnect();
        res.json({ message: `user ${name} deleted successfully` });
      } else {
        res.status(404).json({ message: `user not found!` });
      }
    } catch (error: any) {
      res.json({ message: error.message });
    }
  }
);

export default handler;
