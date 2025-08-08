// src/types/next-auth.d.ts
import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      lineUserId: string;
      displayName: string;
      picture: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    lineUserId: string;
    displayName: string;
    picture: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    lineUserId: string;
    displayName: string;
    picture: string;
  }
}
