import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import User from "../../../model/User";
import db from "../../../utils/db";
import bcryptjs from "bcryptjs";

const handler = nc();

handler.post(
  "/api/auth/signup",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, email, password } = req.body;
    if (
      !name ||
      !email ||
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) ||
      !password ||
      password.trim().length <= 5
    ) {
      res.status(422).json({
        message: "Validation error",
      });
    }
    await db.connect();
    const alreadyExist = await User.findOne({ email });
    if (alreadyExist) {
      await db.disconnect();
      res.status(422).json({
        message: "User Already Exist",
      });
    }

    const newUser = new User({
      name,
      email,
      password: bcryptjs.hashSync(password),
      isAdmin: false,
    });

    const user = await newUser.save();
    await db.disconnect();
    res.status(201).json({
      message: "User Created",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
);

export default handler;
