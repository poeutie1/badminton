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
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        console.log("📦 onSnapshot events:", arr);
        setEvents(arr);
      },
      (err) => {
        console.error("❌ onSnapshot error:", err);
      }
    );
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
      await updateDoc(ref, {
        participants: arrayRemove(nickname),
        waitlist: arrayRemove(nickname),
      });
      console.log("✔️ cancel succeeded");
    } catch (e) {
      console.error("❌ cancel error:", e);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">練習カレンダー</h1>
      <Calendar events={events} onJoin={handleJoin} onCancel={handleCancel} />
    </div>
  );
}
