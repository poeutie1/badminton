// src/components/Calendar.tsx
"use client";

import { useState } from "react";
import type { PracticeEvent } from "../lib/types";

type Props = {
  events: PracticeEvent[];
  onJoin: (ev: PracticeEvent, nickname: string) => Promise<void>;
};

export const Calendar = ({ events, onJoin }: Props) => {
  const [nickname, setNickname] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="ニックネーム"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border p-1 mb-4"
      />
      {events.map((e) => (
        <div key={e.id} className="border p-4 mb-2">
          <p>📅 {e.date}</p>
          <p>
            定員: {e.participants.length}/{e.capacity}
          </p>
          <p>参加者: {e.participants.join("、") || "なし"}</p>
          <p>キャンセル待ち: {e.waitlist.join("、") || "なし"}</p>
          <button
            onClick={() => {
              if (!nickname) {
                alert("ニックネームを入力してください");
                return;
              }
              onJoin(e, nickname);
              setNickname("");
            }}
            className="bg-blue-500 text-white px-2 py-1 mt-2"
          >
            参加表明
          </button>
        </div>
      ))}
    </div>
  );
};
