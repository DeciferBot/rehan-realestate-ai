import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in · Acre",
  description: "Sign in to your Acre sales command center.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
