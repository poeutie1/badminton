// src/app/admin/page.tsx
"use client";

import AdminPanel from "../components/AdminPanel";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);

  useEffect(() => {
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      // …他オプション…
    });
    setAuth(getAuth(app));
  }, []);

  if (!auth) return <p>Loading…</p>;

  // auth をつかって管理画面の UI をレンダリング
  return <div>管理者画面ここから</div>;
}
