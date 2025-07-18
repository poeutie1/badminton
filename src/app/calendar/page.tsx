// src/app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
// ← ここに doc と updateDoc を追加！
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import { Calendar } from "../components/Calendar";
import { db } from "../../lib/firebase";
import type { PracticeEvent } from "../lib/types";

export default function CalendarPage() {
  const [events, setEvents] = useState<PracticeEvent[]>([]);

  useEffect(() => {
    async function fetchOnce() {
      try {
        const snap = await getDocs(collection(db, "events"));
        const arr = snap.docs.map((d) => {
          const data = d.data() as Omit<PracticeEvent, "id">;
          return { id: d.id, ...data };
        });
        console.log("📦 getDocs result:", arr);
        setEvents(arr);
      } catch (e: any) {
        console.error("❌ getDocs error:", e.code, e.message);
      }
    }
    fetchOnce();
  }, []);

  const handleJoin = async (ev: PracticeEvent, nickname: string) => {
    const ref = doc(db, "events", ev.id);
    const isFull = ev.participants.length >= ev.capacity;
    await updateDoc(ref, {
      participants: isFull ? ev.participants : [...ev.participants, nickname],
      waitlist: isFull ? [...ev.waitlist, nickname] : ev.waitlist,
    });
  };

  const handleCancel = async (ev: PracticeEvent, nickname: string) => {
    const ref = doc(db, "events", ev.id);
    await updateDoc(ref, {
      participants: ev.participants.filter((n) => n !== nickname),
      waitlist: ev.waitlist.filter((n) => n !== nickname),
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">練習カレンダー</h1>
      <Calendar events={events} onJoin={handleJoin} onCancel={handleCancel} />
    </div>
  );
}
