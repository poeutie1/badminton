"use client";

import { useEffect, useState } from "react";

type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string | null;
};

type FormData = {
  nickname: string;
  level: "" | "1" | "2" | "3" | "4";
  gender: "" | "male" | "female";
  oneWord: string;
  years: string; // 未入力を扱いやすくするため文字列で保持
  birthplace: string;
  favorite: string;
};

export default function ProfilePage() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [form, setForm] = useState<FormData>({
    nickname: "",
    level: "",
    gender: "",
    oneWord: "",
    years: "",
    birthplace: "",
    favorite: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    (async () => {
      try {
        const mod = await import("@line/liff");
        const liff = mod.default;

        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: `${window.location.origin}/profile` });
          return;
        }

        const p = await liff.getProfile();
        const base: LiffProfile = {
          userId: p.userId,
          displayName: p.displayName,
          pictureUrl: p.pictureUrl ?? null,
        };
        setProfile(base);
        // 表示名を初期ニックネームに
        setForm((prev) => ({ ...prev, nickname: base.displayName }));
        setReady(true);
      } catch (e) {
        console.error("LIFF init error:", e);
      }
    })();
  }, []);

  const update =
    (k: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ★保存処理はここに。Firestore等に送るなら fetch("/api/profile", {...}) など
    console.log("submit payload", { line: profile, form });
    alert("送信しました！（デモ）");
  };

  if (!ready || !profile) {
    return <div style={{ padding: 16 }}>読み込み中…</div>;
  }

  // 超シンプルなスタイルセット
  const box: React.CSSProperties = {
    maxWidth: 680,
    margin: "0 auto",
    padding: 16,
    background: "#e0f7f9",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#fff",
  };

  return (
    <div style={box}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>公開情報</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        {/* ニックネーム */}
        <label>
          <div style={{ fontWeight: 600 }}>ニックネーム *</div>
          <input
            required
            value={form.nickname}
            onChange={update("nickname")}
            placeholder="例）りんご"
            style={inputStyle}
          />
          <div style={{ fontSize: 12, color: "#c00" }}>
            なるべくみんなに覚えられやすいニックネームをお願いします（アルファベット一文字などはNG）。
          </div>
        </label>

        {/* レベル */}
        <label>
          <div style={{ fontWeight: 600 }}>レベル *</div>
          <select
            required
            value={form.level}
            onChange={update("level")}
            style={inputStyle}
          >
            <option value="" disabled>
              選択してください
            </option>
            <option value="1">1部：上級（大会入賞常連）</option>
            <option value="2">2部：公式大会3部で入賞2回以上あり</option>
            <option value="3">3部：ゲーム練習は可能</option>
            <option value="4">4部：基礎練習中心</option>
          </select>
          <div style={{ fontSize: 12, color: "#666" }}>
            ※ダブルスのゲームが十分にできないレベルの場合は、一般のゲーム練習ではなく、基礎トレーニング主体の練習から始めていただく場合があります。
          </div>
        </label>

        {/* 性別 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>性別</div>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={update("gender")}
            />{" "}
            男性
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={update("gender")}
            />{" "}
            女性
          </label>
        </div>

        {/* ひとこと */}
        <label>
          <div style={{ fontWeight: 600 }}>ザンバドのみんなに一言</div>
          <textarea
            value={form.oneWord}
            onChange={update("oneWord")}
            rows={3}
            style={inputStyle}
          />
        </label>

        {/* バドミントン歴 */}
        <label>
          <div style={{ fontWeight: 600 }}>バドミントン歴</div>
          <input
            type="number"
            min={0}
            value={form.years}
            onChange={update("years")}
            placeholder="例）6"
            style={inputStyle}
          />
        </label>

        {/* 出身地 */}
        <label>
          <div style={{ fontWeight: 600 }}>出身地</div>
          <input
            value={form.birthplace}
            onChange={update("birthplace")}
            style={inputStyle}
          />
        </label>

        {/* 好きな事・物・人 */}
        <label>
          <div style={{ fontWeight: 600 }}>
            バドミントン以外で好きな事、物、人
          </div>
          <input
            value={form.favorite}
            onChange={update("favorite")}
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            border: "none",
            background: "#00bcd4",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          送信
        </button>

        {/* デバッグ表示（必要なら消してOK） */}
        <div style={{ fontSize: 12, color: "#555" }}>
          <div>LINE表示名: {profile.displayName}</div>
          <div>LINEユーザーID: {profile.userId}</div>
        </div>
      </form>
    </div>
  );
}
