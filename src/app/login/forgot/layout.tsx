import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset access to your Acre sales command center.",
  robots: { index: false, follow: false },
};

export default function ForgotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
