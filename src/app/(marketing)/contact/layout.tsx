import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact · Acre" },
  description:
    "Talk to the Acre team about deploying AI sales agents on your real estate inventory. Book a demo and see it engage a lead live.",
  openGraph: {
    title: "Contact · Acre",
    description:
      "Talk to the Acre team about deploying AI sales agents on your real estate inventory.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
