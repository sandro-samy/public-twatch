import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nc from "next-connect";
import User from "../../../model/User";
import db from "../../../utils/db";
import bcryptjs from "bcryptjs";

const handler = nc();

handler.put(
  "/api/auth/update",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: "unauthorized" });
    }
    const { name, email, password } = req.body;
    if (
      !name ||
      !email ||
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) ||
      (password && password.trim().length <= 5)
    ) {
      res.status(422).json({
        message: "Validation error",
      });
    }
    await db.connect();
    const userToUpdate = await User.findById(session._id);

    userToUpdate.name = name;
    userToUpdate.email = email;
    if (password.length > 5)
      userToUpdate.password = bcryptjs.hashSync(password);

    await userToUpdate.save();
    await db.disconnect();
    res.json({ message: "User Updated Successfully" });
  }
);

export default handler;
