import type { Metadata } from "next";
// W lokalnym środowisku odkomentuj poniższe linie, aby załadować czcionkę i style:
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Volt Mods Poland | Części Premium Sur-Ron & Talaria",
  description: "Najlepsze modyfikacje w Polsce. Sterowniki, baterie 72V, koła i akcesoria. Zbuduj swoją bestię z VMP.",
  openGraph: {
    title: "Volt Mods Poland - Części Premium",
    description: "Zbuduj swoją bestię. Sterowniki, baterie, tuning.",
    url: "https://volt-mods.pl",
    siteName: "Volt Mods Poland",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621644781307-a36c69784132?q=80&w=1200", // Przykładowe zdjęcie dla linku
        width: 1200,
        height: 630,
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="dark">
      {/* Pamiętaj, aby przywrócić inter.className w body, jeśli używasz tej czcionki */}
      <body className={`bg-neutral-950 text-white font-sans`}>
        {children}
      </body>
    </html>
  );
}