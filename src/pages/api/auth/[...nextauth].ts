// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import LineProvider from "next-auth/providers/line";

export default NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid profile" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.lineUserId = profile.sub;
        token.picture = (profile as any).picture;
        token.displayName = profile.name;
      }
      return token;
    },
    async session({ session, token }) {
      // ここで displayName → name に上書き
      session.user.name = (token.displayName ?? session.user.name)!;
      // picture → image に上書き
      session.user.image = token.picture ?? session.user.image;
      // lineUserId は型拡張済みと仮定
      session.user.lineUserId = token.lineUserId as string;
      return session;
    },
  },
});
