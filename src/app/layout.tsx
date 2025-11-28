import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Volt Mods Poland | Tuning Sur-Ron & Talaria",
  description: "Najlepsze części i modyfikacje do motocykli elektrycznych. Baterie, sterowniki, podnóżki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      {/* Ta linia ładuje styl i czcionki: */}
      <body className={inter.className}>{children}</body>
      {/* Wcześniej mogłeś mieć tutaj: <body style={{ fontFamily: 'sans-serif' }}>{children}</body> */}
    </html>
  );
}