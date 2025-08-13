// src/app/events/[eventId]/page.tsx
import { notFound } from "next/navigation";
import { getEventById } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params; // ← ここでawait
  const event = await getEventById(eventId);
  if (!event) notFound();

  return (
    <div style={{ padding: 16 }}>
      <p>
        🕒 {event.date} / 📍 {event.location}
      </p>
      <p>現在の参加者: {event.participants.length}人</p>
    </div>
  );
}
