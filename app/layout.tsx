import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloudflare Mail SDK – Nodemailer Alternative",
  description:
    "TypeScript-first Mail SDK for Cloudflare. Free 1,000 mails/month. Simple API keys, zero SMTP.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Cloudflare Mail SDK – Nodemailer Alternative",
    description:
      "Send emails from Cloudflare Workers without SMTP. TypeScript SDK, free tier included.",
    url: "https://example.com",
    siteName: "Cloudflare Mail SDK",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Cloudflare Mail SDK",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-backdrop-filter:bg-background/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2">
              <span className="inline-block h-6 w-6 rounded bg-linear-to-br from-sky-500 to-blue-600" />
              <span className="text-sm font-semibold tracking-wide">Cloudflare Mail SDK</span>
            </a>
            <nav className="hidden items-center gap-6 text-sm sm:flex">
              <a className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="#features">Features</a>
              <a className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="#code">Code</a>
              <a className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="#pricing">Pricing</a>
              <a className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800" href="#docs">Docs</a>
              <a className="rounded-full bg-foreground px-3 py-1.5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]" href="#signin">Sign In</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Cloudflare Mail SDK. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="#terms">Terms</a>
              <a className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="#privacy">Privacy</a>
              <a className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="#status">Status</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
