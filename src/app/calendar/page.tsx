// src/app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  runTransaction,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Calendar } from "../components/Calendar";
import { db } from "../../lib/firebase";
import type { PracticeEvent } from "../lib/types";

export default function CalendarPage() {
  const [events, setEvents] = useState<PracticeEvent[]>([]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snap) => {
      // Firestore のドキュメントには id が含まれないので、
      // d.data() は PracticeEvent から id を除いた型
      const arr = snap.docs.map((d) => {
        const data = d.data() as Omit<PracticeEvent, "id">;
        return { id: d.id, ...data };
      });
      console.log("📦 onSnapshot events:", arr);
      setEvents(arr);
    });
    return () => unsubscribe();
  }, []);

  const handleJoin = async (ev: PracticeEvent, nickname: string) => {
    console.log("▶️ handleJoin called:", { eventId: ev.id, nickname });
    if (!nickname.trim()) {
      alert("名前を入れてください");
      return;
    }
    const ref = doc(db, "events", ev.id);
    const isFull = ev.participants.length >= ev.capacity;
    try {
      await updateDoc(ref, {
        participants: isFull ? ev.participants : arrayUnion(nickname),
        waitlist: isFull ? arrayUnion(nickname) : ev.waitlist,
      });
      console.log("✔️ updateDoc succeeded");
    } catch (e) {
      console.error("❌ updateDoc error:", e);
    }
  };

  const handleCancel = async (ev: PracticeEvent, nickname: string) => {
    console.log("▶️ handleCancel called:", { eventId: ev.id, nickname });
    const ref = doc(db, "events", ev.id);

    try {
      await runTransaction(db, async (tx) => {
        const sf = await tx.get(ref);
        if (!sf.exists()) throw new Error("イベントが見つかりません");
        // ドキュメントの現在値を取得
        const data = sf.data() as Omit<PracticeEvent, "id">;
        // 参加リストから自分を外す
        const newParts = data.participants.filter((n) => n !== nickname);
        // 待機リストはそのまま
        let newWait = [...data.waitlist];

        // 空席があるなら待機列の先頭を繰り上げ
        if (newParts.length < data.capacity && newWait.length > 0) {
          const nextUser = newWait.shift()!; // FIFO で先頭を取り出し
          newParts.push(nextUser); // 参加リストに追加
        }
        tx.update(ref, {
          participants: newParts,
          waitlist: newWait,
        });
      });

      console.log("✔️ cancel + promote succeeded");
    } catch (e) {
      console.error("❌ cancel + promote error:", e);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">練習カレンダー</h1>
      <Calendar events={events} onJoin={handleJoin} onCancel={handleCancel} />
    </div>
  );
}
