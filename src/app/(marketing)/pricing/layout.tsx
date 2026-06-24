import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Pricing · Acre" },
  description:
    "Simple, transparent pricing for Acre's AI sales agents — engage every lead across voice, WhatsApp, and email, grounded in your live inventory.",
  openGraph: {
    title: "Pricing · Acre",
    description:
      "Simple, transparent pricing for Acre's AI sales agents — voice, WhatsApp, and email, grounded in your live inventory.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
