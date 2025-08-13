// src/app/events/[eventId]/page.tsx
import { notFound } from "next/navigation";
import { getEventById } from "../../../lib/db";
import type { Event } from "../../../lib/types";

type Props = { params: { eventId: string } };

// SSRで読めるようにする（プリレンダー回避したいなら dynamic を付ける）
export const dynamic = "force-dynamic"; // ←静的化で落ちる場合は有効に

export default async function EventPage({ params }: Props) {
  let event: Event | null = null;
  try {
    event = await getEventById(params.eventId);
  } catch (e) {
    console.error("getEventById failed:", e);
    // ルート専用の error.tsx にフォールバック
    throw new Error("failed-to-load-event");
  }

  if (!event) notFound();

  return (
    <div style={{ padding: 16 }}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>
        🕒 {event.date} / 📍 {event.location}
      </p>
      <p>現在の参加者: {event.participants.length}人</p>
      {/* JoinButton はクライアント側で */}
      {/* <JoinButton eventId={params.eventId} participants={event.participants} /> */}
    </div>
  );
}
