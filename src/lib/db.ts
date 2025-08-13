// src/lib/db.ts
import { getAdminDb } from "../app/api/firebaseAdmin";
import type { PracticeEvent } from "../app/lib/types";
export async function getEventById(id: string): Promise<PracticeEvent | null> {
  const adminDb = getAdminDb(); // ← 使う瞬間に取得（遅延初期化）
  const snap = await adminDb.collection("events").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as Omit<PracticeEvent, "id">) };
}
