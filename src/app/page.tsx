// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-6">Badminton 練習会</h1>
      <div className="space-x-6 text-lg">
        <Link href="/calendar" className="underline">
          カレンダーを見る
        </Link>
        <Link href="/how-to-use" className="underline">
          利用方法
        </Link>
      </div>
    </div>
  );
}
