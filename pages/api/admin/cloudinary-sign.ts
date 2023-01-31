import { v2 } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const signature = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session: any = await getSession({ req });
  // if (!session || (session && !session.isAdmin)) {
  //   res.status(401).json({ message: "unauthorized" });
  // }
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = v2.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process?.env?.CLOUDINARY_API_SECRET!
    );
    res.json({ signature, timestamp });
  } catch (error) {
    res.status(500).json({message:"something went wrong!"})
  }
};
export default signature;
