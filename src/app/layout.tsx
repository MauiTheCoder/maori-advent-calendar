import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rā Katoa - Māori Cultural Journey",
  description: "Embark on a 30-day cultural adventure through Aotearoa. Learn, grow, and discover the beauty of Māori culture through interactive activities, stories, and games.",
  keywords: ["Māori", "culture", "learning", "Aotearoa", "New Zealand", "education", "cultural journey"],
  authors: [{ name: "Te Wānanga o Aotearoa" }],
  openGraph: {
    title: "Rā Katoa - Māori Cultural Journey",
    description: "Embark on a 30-day cultural adventure through Aotearoa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
