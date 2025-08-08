// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid profile" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) token.lineUserId = profile.sub;
      if (profile?.name) token.name = profile.name;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user!,
          lineUserId: token.lineUserId as string,
          name: token.name as string,
          image: token.picture as string,
        },
      };
    },
  },
};
