import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          if (existingUser) {
            if (!existingUser.image && user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }
          } else {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
            });
          }
        } catch (error) {
          console.error("Failed to save user:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.email = user.email;
        token.name = user.name;
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email }).lean();
          if (dbUser) {
            token.role = dbUser.role;
            token.dbUserId = dbUser._id.toString();
            token.image = dbUser.image || user.image;
          } else {
            token.role = "user";
          }
        } catch {
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.dbUserId as string) || (token.id as string);
      session.user.role = (token.role as string) || "user";
      session.user.image = (token.image as string) || null;
      session.user.name = (token.name as string) || null;
      return session;
    },
  },
});
