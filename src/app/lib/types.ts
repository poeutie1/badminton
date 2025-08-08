// lib/types.ts
// src/app/lib/types.ts
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: { id: string }[]; // 必要なら name など追加もOK
};
