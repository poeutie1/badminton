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
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminPanel() {
  const [events, setEvents] = useState<PracticeEvent[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(4);

  // Firestoreからリアルタイム取得
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    return onSnapshot(q, (snap) =>
      setEvents(
        snap.docs.map((d) => {
          const data = d.data() as Omit<PracticeEvent, "id">;
          return { id: d.id, ...data };
        })
      )
    );
  }, []);

  // 新規作成
  const handleCreate = async () => {
    if (!date || !time || !location) {
      return alert("日付・時間・体育館をすべて入力してください");
    }
    await addDoc(collection(db, "events"), {
      date,
      time,
      location,
      capacity,
      participants: [],
      waitlist: [],
    });
    setDate("");
    setTime("");
    setLocation("");
    setCapacity(4);
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm("本当にこの練習会を削除しますか？")) return;
    await deleteDoc(doc(db, "events", id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">管理者パネル</h1>

      {/* 新規作成フォーム */}
      <section className="mb-8 p-4 border rounded space-y-2">
        <h2 className="font-semibold">練習会の新規作成</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="時間 (例: 18:30～20:30)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="体育館 (例: 第1体育館)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          min={1}
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          作成
        </button>
      </section>

      {/* 既存一覧 */}
      <section>
        <h2 className="font-semibold mb-2">既存の練習会一覧</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">日付</th>
              <th className="border px-2 py-1">時間</th>
              <th className="border px-2 py-1">体育館</th>
              <th className="border px-2 py-1">定員</th>
              <th className="border px-2 py-1">参加者数</th>
              <th className="border px-2 py-1">キャンセル待ち</th>
              <th className="border px-2 py-1">操作</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td className="border px-2 py-1">{ev.date}</td>
                <td className="border px-2 py-1">{ev.time}</td>
                <td className="border px-2 py-1">{ev.location}</td>
                <td className="border px-2 py-1">{ev.capacity}</td>
                <td className="border px-2 py-1">{ev.participants.length}</td>
                <td className="border px-2 py-1">{ev.waitlist.length}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
