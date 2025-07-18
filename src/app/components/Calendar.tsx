// src/components/Calendar.tsx
"use client";

import { useState } from "react";
import type { PracticeEvent } from "../lib/types";

type Props = {
  events: PracticeEvent[];
  onJoin: (ev: PracticeEvent, nickname: string) => Promise<void>;
  onCancel: (ev: PracticeEvent, nickname: string) => Promise<void>;
};

export const Calendar = ({ events, onJoin, onCancel }: Props) => {
  const [nickname, setNickname] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="ニックネーム"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border p-1 mb-5 rounded-lg"
      />
      {events.map((e) => {
        const joined = e.participants.includes(nickname);
        const waiting = e.waitlist.includes(nickname);
        return (
          <div key={e.id} className="border p-4 mb-2 rounded-lg">
            <p>
              📅 {e.date} {e.time}
            </p>
            <p>🏟 {e.location}</p>
            <p>
              定員: {e.participants.length}/{e.capacity}
            </p>
            <p>参加者: {e.participants.join("、") || "なし"}</p>
            <p>キャンセル待ち: {e.waitlist.join("、") || "なし"}</p>

            <div className="mt-2 space-x-2">
              {!joined && !waiting && (
                <button
                  onClick={() => {
                    if (!nickname) return alert("名前を入れてください");
                    onJoin(e, nickname);
                    setNickname("");
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  参加表明
                </button>
              )}

              {(joined || waiting) && (
                <button
                  onClick={() => {
                    onCancel(e, nickname);
                    setNickname("");
                  }}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  参加キャンセル
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
