// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** LINE の sub（ユーザーID） */
      lineUserId: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    lineUserId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    lineUserId: string;
    picture: string;
    displayName?: string;
  }
}
