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
  title: "Mahuru Activation 2025 - Te Reo Māori Learning Platform",
  description: "Join the Mahuru Challenge! Participate in 30 days of te reo Māori activation activities. Learn pronunciation, practice conversation, and strengthen your reo Māori journey through progressive daily challenges.",
  keywords: ["Mahuru", "te reo Māori", "Māori language", "learning", "Aotearoa", "New Zealand", "education", "language activation", "pronunciation", "conversation"],
  authors: [{ name: "Te Wānanga o Aotearoa" }],
  openGraph: {
    title: "Mahuru Activation 2025 - Te Reo Māori Learning Platform",
    description: "Join the Mahuru Challenge! 30 days of te reo Māori activation activities",
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
