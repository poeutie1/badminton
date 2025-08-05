// src/types/next-auth.d.ts
import NextAuth, {
  DefaultSession,
  DefaultUser,
  JWT as DefaultJWT,
} from "next-auth";

// Session の拡張
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      lineUserId?: string;
    };
  }
}

// JWT の拡張
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    lineUserId?: string;
    displayName?: string;
    picture?: string;
  }
}
