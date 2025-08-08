// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  // JWT セッションを使う
  session: { strategy: "jwt" },
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid profile" } },
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) token.lineUserId = profile.sub;
      if (profile?.name) token.name = profile.name;
      return token;
    },
    async session({ session, token }) {
      if (token.lineUserId) session.user.lineUserId = token.lineUserId;
      return session;
    },
  },
};
