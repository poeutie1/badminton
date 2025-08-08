// src/app/events/[eventId]/page.tsx
import { getEventById } from "../../lib/db";
import type { Event } from "../../lib/types"; // ← もしtypesファイルを分けてたら
import JoinButton from "../../components/JoinButton";

type Props = {
  params: {
    eventId: string;
  };
};

export default async function EventDetailPage({ params }: Props) {
  const event: Event | null = await getEventById(params.eventId);

  if (!event) {
    return <div>イベントが見つかりませんでした。</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>
        🕒 {event.date} / 📍 {event.location}
      </p>
      <p>現在の参加者: {event.participants.length}人</p>

      <JoinButton eventId={params.eventId} participants={event.participants} />
    </div>
  );
}
