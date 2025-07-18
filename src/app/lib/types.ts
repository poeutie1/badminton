// lib/types.ts
export type PracticeEvent = {
  id: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  participants: string[];
  waitlist: string[];
};
