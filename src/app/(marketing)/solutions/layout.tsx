import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Solutions · Acre" },
  description:
    "How Acre's AI sales agents work for UAE developers, brokers, and institutional landlords — instant multilingual outreach across voice, WhatsApp, and email.",
  openGraph: {
    title: "Solutions · Acre",
    description:
      "AI sales agents for UAE developers, brokers, and landlords — instant multilingual outreach grounded in your live inventory.",
    url: "/solutions",
  },
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
