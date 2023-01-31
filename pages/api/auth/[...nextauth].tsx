import NextAuth from "next-auth";
import db from "../../../utils/db";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../model/User";
import { Session } from "inspector";
import { JWT } from "next-auth/jwt";

interface ISession extends Session {
  isAdmin: boolean;
  _id: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        try {
          await db.connect();
          const user = await User.findOne({
            email: credentials?.email,
          });
          await db.disconnect();
          if (
            user._id &&
            credentials?.password &&
            bcryptjs.compareSync(credentials.password, user.password)
          ) {
            const userWithImage = { ...user, image: "f" };
            return {
              id: user._id,
              isAdmin: user.isAdmin,
              name: user.name,
              email: user.email,
              image: "f",
            };
          } else {
            throw new Error("password or email invalid");
          }
        } catch (error) {
          throw new Error("password or email invalid");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token._id = user?._id;
        token.isAdmin = user?.isAdmin;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session._id = token._id;
        session.isAdmin = token?.isAdmin;
      }
      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
