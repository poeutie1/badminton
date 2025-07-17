import { PracticeEvent } from "./types";

export const mockPracticeEvents: PracticeEvent[] = [
  {
    id: "1",
    date: "2025-07-20",
    capacity: 3,
    participants: ["たろう", "はなこ"],
    waitlist: [],
  },
  {
    id: "2",
    date: "2025-07-23",
    capacity: 2,
    participants: ["じろう", "さぶろう"],
    waitlist: ["ごろう"],
  },
];
