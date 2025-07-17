// src/app/components/AdminPanel.tsx
"use client";

import { useState, useEffect } from "react";
import type { PracticeEvent } from "../lib/types";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function AdminPanel() {
  const [events, setEvents] = useState<PracticeEvent[]>([]);
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(4);

  // Firestore から常に最新の events を取得
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    const unsub = onSnapshot(q, (snap) => {
      setEvents(
        snap.docs.map((d) => {
          const data = d.data() as Omit<PracticeEvent, "id">;
          return { id: d.id, ...data };
        })
      );
    });
    return () => unsub();
  }, []);

  // 新規作成
  const handleCreate = async () => {
    if (!date) return alert("日付を入力してください");
    await addDoc(collection(db, "events"), {
      date,
      capacity,
      participants: [],
      waitlist: [],
    });
    setDate("");
    setCapacity(4);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">管理者パネル</h1>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">練習会の新規作成</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="border p-2 rounded w-20"
          />
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            作成
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">既存の練習会一覧</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">日付</th>
              <th className="border px-2 py-1">定員</th>
              <th className="border px-2 py-1">参加者数</th>
              <th className="border px-2 py-1">キャンセル待ち数</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td className="border px-2 py-1">{ev.date}</td>
                <td className="border px-2 py-1">{ev.capacity}</td>
                <td className="border px-2 py-1">{ev.participants.length}</td>
                <td className="border px-2 py-1">{ev.waitlist.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
