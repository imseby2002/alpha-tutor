import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alpha Tutor MVP",
  description: "AI Supplementary Learning App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{ 
          background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '1rem 2rem',
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">Student Portal</Link>
          <Link href="/guide" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">Guide Dashboard</Link>
          <Link href="/parent" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">Parent Report</Link>
          <Link href="/admin" style={{ color: 'var(--warning)', textDecoration: 'none', fontWeight: 500 }} className="hover-scale">Platform Admin (CMS)</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
