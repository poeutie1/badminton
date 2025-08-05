// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import LineProvider from "next-auth/providers/line";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid profile" } },
    }),
  ],
  // Session strategy は 'jwt' | 'database' のどちらか
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    // JWT の生成・更新
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.lineUserId = profile.sub;
      }
      if (profile?.name) {
        token.displayName = profile.name;
      }
      return token;
    },

    // session オブジェクトに追加情報を混ぜる
    async session({ session, token }) {
      if (token.lineUserId) {
        session.user.lineUserId = token.lineUserId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
// App Router では GET/POST で同じハンドラをエクスポート
export { handler as GET, handler as POST };
