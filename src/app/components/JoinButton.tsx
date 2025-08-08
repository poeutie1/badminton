"use client";

import { useState } from "react";
import { joinEvent } from "../lib/db";
import { useSession } from "next-auth/react";

type JoinButtonProps = {
  eventId: string;
  participants: { id: string }[]; // Firestore に保存された参加者情報
};

export default function JoinButton({ eventId, participants }: JoinButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const userId = session?.user?.lineUserId || session?.user?.email; // 適宜修正

  const hasJoined = participants.some((p) => p.id === userId);

  const handleJoin = async () => {
    if (!userId) {
      alert("ログインが必要です");
      return;
    }
    if (hasJoined || joined) return;

    try {
      setLoading(true);
      await joinEvent(eventId, userId);
      setJoined(true);
      alert("参加しました！");
    } catch (e) {
      console.error(e);
      alert("参加できませんでした");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      disabled={loading || hasJoined || joined}
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: 4,
        cursor: loading || hasJoined || joined ? "not-allowed" : "pointer",
      }}
    >
      {hasJoined || joined ? "参加済み" : loading ? "参加中..." : "参加する"}
    </button>
  );
}
