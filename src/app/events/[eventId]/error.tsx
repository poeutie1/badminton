// src/app/events/[eventId]/error.tsx
"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      読み込みに失敗しました: {error.message}
      <button onClick={reset}>再試行</button>
    </div>
  );
}
