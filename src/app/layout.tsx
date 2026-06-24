import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import "@/ui/ui.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acre.simmerproperties.com"),
  title: {
    default: "Acre — AI Sales Agents for Real Estate",
    template: "%s · Acre",
  },
  description:
    "Acre is the AI sales command center for real estate — engage every lead instantly across voice, WhatsApp, and email, grounded in your live inventory.",
  applicationName: "Acre",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
