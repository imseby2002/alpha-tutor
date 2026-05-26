import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alpha Tutor｜AI 補教學習",
  description: "AI 輔助補教學習平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={inter.className}>
        <nav style={{ 
          background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '1rem 2rem',
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">學生學習</Link>
          <Link href="/guide" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">導師儀表板</Link>
          <Link href="/parent" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">家長報告</Link>
          <Link href="/admin" style={{ color: 'var(--warning)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">平台管理 (CMS)</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
