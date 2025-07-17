// src/app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "../components/Calendar";
import type { PracticeEvent } from "../lib/types";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function CalendarPage() {
  const [events, setEvents] = useState<PracticeEvent[]>([]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    return onSnapshot(q, (snap) => {
      setEvents(
        snap.docs.map((d) => {
          const data = d.data() as Omit<PracticeEvent, "id">;
          return { id: d.id, ...data };
        })
      );
    });
  }, []);

  const handleJoin = async (ev: PracticeEvent, nickname: string) => {
    const ref = doc(db, "events", ev.id);
    const isFull = ev.participants.length >= ev.capacity;
    await updateDoc(ref, {
      participants: isFull ? ev.participants : [...ev.participants, nickname],
      waitlist: isFull ? [...ev.waitlist, nickname] : ev.waitlist,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">練習カレンダー</h1>
      {events.length === 0 ? (
        <p>まだ練習会が登録されていません。</p>
      ) : (
        <Calendar events={events} onJoin={handleJoin} />
      )}
    </div>
  );
}
