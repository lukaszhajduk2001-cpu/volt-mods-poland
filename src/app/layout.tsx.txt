import React from 'react';
import type { Metadata } from "next";
// UWAGA: Te linie poniżej są niezbędne w Twoim lokalnym projekcie na komputerze!
// W tym podglądzie są zakomentowane, aby uniknąć błędów kompilacji.
// Po zapisaniu pliku na dysku, USUŃ znaki komentarza (//) z początku linii:

// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

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
      {/* Lokalnie zamień linię body na: <body className={inter.className}>{children}</body> */}
      <body style={{ fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}