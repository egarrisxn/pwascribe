import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://pwascribe.vercel.app"),
  title: "pwaScribe",
  description: "Realtime Voice-2-Text",
  keywords: [
    "pwascribe, pwa, transcribe, transcription, speech-to-text, transcription, nextjs, react, typescript, javascript, api, voice, audio",
  ],
  openGraph: {
    locale: "en_US",
    type: "website",
    title: "pwaScribe",
    description: "Realtime Voice-2-Text",
    url: "https://pwascribe.vercel.app",
    siteName: "pwascribe",
  },
  twitter: {
    card: "summary_large_image",
    title: "pwaScribe",
    description: "Realtime Voice-2-Text",
    creator: "@eg__xo",
    site: "@eg__xo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='apple-mobile-web-app-title' content='pwaScribe' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
