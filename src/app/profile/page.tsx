"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
  query,
} from "firebase/firestore";

type PracticeEvent = {
  id: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  participants: string[];
  waitlist: string[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<PracticeEvent[]>([]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    return onSnapshot(q, (snap) =>
      setEvents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
    );
  }, []);

  if (status === "loading") return <p>Loading…</p>;
  if (!session) {
    return (
      <div className="p-4">
        <p>参加には LINE ログインが必要です。</p>
        <button
          onClick={() => signIn("line", { callbackUrl: "/profile" })}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          LINE でログイン
        </button>
      </div>
    );
  }

  const userId = session.user.lineUserId;
  const userName = session.user.name; // ← displayName の代わりに
  const userImage = session.user.image; // ← picture の代わりに

  const handleJoin = async (ev: PracticeEvent) => {
    const ref = doc(db, "events", ev.id);
    const isFull = ev.participants.length >= ev.capacity;
    await updateDoc(ref, {
      participants: isFull ? ev.participants : [...ev.participants, userId],
      waitlist: isFull ? [...ev.waitlist, userId] : ev.waitlist,
    });
  };

  const handleCancel = async (ev: PracticeEvent) => {
    const ref = doc(db, "events", ev.id);
    await updateDoc(ref, {
      participants: ev.participants.filter((id) => id !== userId),
      waitlist: ev.waitlist.filter((id) => id !== userId),
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        {userImage && (
          <img
            src={userImage}
            alt="avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <div>
          <p className="font-bold">{userName}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-600 hover:underline"
          >
            ログアウト
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">練習会一覧</h2>
      {events.map((ev) => {
        const joined = ev.participants.includes(userId);
        return (
          <div key={ev.id} className="border p-4 rounded mb-4">
            <p>
              📅 {ev.date} {ev.time}
            </p>
            <p>🏟 {ev.location}</p>
            <p>
              定員: {ev.participants.length}/{ev.capacity}
            </p>
            <div className="mt-3">
              {!joined ? (
                <button
                  onClick={() => handleJoin(ev)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  参加表明
                </button>
              ) : (
                <button
                  onClick={() => handleCancel(ev)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  キャンセル
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
