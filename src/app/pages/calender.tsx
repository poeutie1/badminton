// pages/calendar.tsx
import { Calendar } from "../components/Calendar";
import { mockPracticeEvents } from "../lib/data";
import { PracticeEvent } from "../lib/types";

export default function CalendarPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">練習カレンダー</h1>
      <Calendar
        events={mockPracticeEvents}
        onJoin={function (ev: PracticeEvent, nickname: string): Promise<void> {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
