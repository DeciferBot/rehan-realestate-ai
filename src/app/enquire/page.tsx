import type { Metadata } from "next";
import { Stack, Row, Text, Heading, Card } from "@/ui";
import EnquireForm from "./EnquireForm";

export const metadata: Metadata = {
  title: "Talk to Acre · Simmer Properties",
  description: "Tell us what you're looking for. Acre, our AI property advisor, replies in your language with real availability.",
};

export default function EnquirePage() {
  return (
    <div className="login-screen">
      <Stack gap={7} style={{ width: "100%", maxWidth: 460 }}>
        <Row gap={3}>
          <div className="topbar-avatar" style={{ width: 38, height: 38, fontSize: "var(--text-lg)" }}>A</div>
          <Stack gap={1}>
            <Text as="div" size="xl" weight="semibold" style={{ letterSpacing: "-0.02em" }}>Acre</Text>
            <Text as="div" size="xs" tone="dim" style={{ letterSpacing: "0.04em" }}>Simmer Properties</Text>
          </Stack>
        </Row>

        <Stack gap={2}>
          <Heading as="h1" size="2xl" style={{ letterSpacing: "-0.02em" }}>Find your property</Heading>
          <Text as="p" size="base" tone="dim">
            Tell us what you&apos;re after. Acre replies in minutes, in your language, with real availability — then connects you to a human when you&apos;re ready.
          </Text>
        </Stack>

        <Card pad>
          <EnquireForm />
        </Card>
      </Stack>
    </div>
  );
}
