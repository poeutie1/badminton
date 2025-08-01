// src/app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";
import { Calendar } from "../components/Calendar";
import { db } from "../../lib/firebase";
import type { PracticeEvent } from "../lib/types";

export default function CalendarPage() {
  const [events, setEvents] = useState<PracticeEvent[]>([]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snap) => {
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
        // 定員に達していなければ participants に追加、達していれば waitlist に追加
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
        const data = sf.data() as Omit<PracticeEvent, "id">;

        // 参加リストから削除
        let newParticipants = data.participants.filter((n) => n !== nickname);
        // 待機リストはコピー
        let newWaitlist = [...data.waitlist];

        // 定員に空きができたら、待機列の先頭を繰り上げ
        if (newParticipants.length < data.capacity && newWaitlist.length > 0) {
          const nextUser = newWaitlist.shift()!; // FIFO
          newParticipants.push(nextUser);
        }

        tx.update(ref, {
          participants: newParticipants,
          waitlist: newWaitlist,
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
