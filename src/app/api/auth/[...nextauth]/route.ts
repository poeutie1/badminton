// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // ← あなたが作成したauthOptionsをインポート

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
