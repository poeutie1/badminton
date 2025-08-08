// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

type LiffProfile = {
  userId: string;
  displayName: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<LiffProfile | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      try {
        // 動的読み込みでSSR対策
        const liffModule = await import("@line/liff");
        const liff = liffModule.default;

        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

        if (!liff.isLoggedIn()) {
          // 未ログインなら再帰的に現在URLへリダイレクト
          liff.login();
          return;
        }

        // ログイン済ならプロファイル取得
        const p = await liff.getProfile();
        setProfile({
          userId: p.userId,
          displayName: p.displayName,
        });
      } catch (e) {
        console.error("LIFF init error:", e);
      }
    })();
  }, []);
}
