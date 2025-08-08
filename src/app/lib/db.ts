// lib/db.ts
import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import type { Event } from "../lib/types";

// プロフィール保存
export async function saveProfile(
  userId: string,
  profile: { nickname: string; level: string }
) {
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// プロフィール取得（オプション）
export async function getProfile(userId: string) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

// イベントに参加
export async function joinEvent(eventId: string, userId: string) {
  const eventRef = doc(db, "events", eventId);

  // プロフィール取得して参加者に入れる
  const profile = await getProfile(userId);
  if (!profile) throw new Error("プロフィールが登録されていません");

  await updateDoc(eventRef, {
    participants: arrayUnion({
      id: userId,
      nickname: profile.nickname,
      level: profile.level,
    }),
  });
}

// イベント追加（管理者用）
export async function addEvent(
  eventId: string,
  eventData: {
    date: string;
    location: string;
    capacity: number;
  }
) {
  const eventRef = doc(db, "events", eventId);
  await setDoc(eventRef, {
    ...eventData,
    participants: [],
    createdAt: serverTimestamp(),
  });
}

export async function getAllEvents(): Promise<Event[]> {
  // 例としてモックデータ
  return [
    {
      id: "1",
      title: "サンプルイベント",
      description: "説明文です",
      date: "2025-08-09",
      location: "渋谷体育館",
      participants: [{ id: "user1" }, { id: "user2" }],
    },
  ];
}

export async function getEventById(id: string): Promise<Event | null> {
  // FirestoreやDBからデータを取得する処理を書く
  // 以下は例
  const event: Event = {
    id,
    title: "サンプルイベント",
    description: "説明文です",
    date: "2025-08-09",
    location: "渋谷体育館",
    participants: [{ id: "user1" }, { id: "user2" }],
  };

  return event; // ← これがなきゃエラー
}
