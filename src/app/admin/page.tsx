// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminPanel from "../components/AdminPanel";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");

  const onLogin = () => {
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
    } else {
      alert("パスワードが違います");
    }
  };

  if (!auth) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
        <h1 className="text-xl font-bold mb-2">管理者ログイン</h1>
        <input
          type="password"
          placeholder="パスワード"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          onClick={onLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ログイン
        </button>
      </div>
    );
  }

  return <AdminPanel />;
}
