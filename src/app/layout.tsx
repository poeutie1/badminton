// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { Providers } from "./providers"; // ← our client wrapper

export const metadata = {
  title: "Badminton 練習会 App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        {/* Providers is client-only, but layout itself stays a server component */}
        <Providers>
          <header className="bg-gray-100 p-4 flex space-x-4">
            <Link href="/profile">マイページ</Link>
            <Link href="/calendar">練習日程</Link>
            <Link href="/how-to-use">利用方法</Link>
            <Link href="/admin">管理画面</Link>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
