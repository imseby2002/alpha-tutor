import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthNav } from "./components/AuthNav";
import { RoleNavLinks } from "./components/RoleNavLinks";

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
          gap: '1.5rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <RoleNavLinks />
          </div>
          <AuthNav />
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
