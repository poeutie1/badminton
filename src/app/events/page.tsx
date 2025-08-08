// src/app/events/page.tsx
import Link from "next/link";
import { getAllEvents } from "../lib/db";
import type { Event } from "../lib/types"; // ← もしtypesファイルを分けてたら

export default async function EventListPage() {
  const events: Event[] = await getAllEvents();

  return (
    <div style={{ padding: 16 }}>
      <h1>イベント一覧</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: 16 }}>
            <Link href={`/events/${event.id}`}>
              <div>
                <strong>{event.title}</strong>
                <p>
                  📅 {event.date} @ {event.location}
                </p>
                <p>👥 参加者: {event.participants.length}人</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
