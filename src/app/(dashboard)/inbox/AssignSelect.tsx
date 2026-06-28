"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Row, Text } from "@/ui";
import { UserCog } from "lucide-react";

type Member = { id: string; name: string };

export default function AssignSelect({
  contactId,
  currentLabel,
  members,
}: {
  contactId: string;
  currentLabel: string | null;
  members: Member[];
}) {
  const [label, setLabel] = useState(currentLabel ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function assign(memberId: string, memberName: string) {
    const newLabel = `Human: ${memberName}`;
    setLabel(newLabel);
    await fetch(`/api/contacts/${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_member_id: memberId, assigned_label: newLabel }),
    });
    startTransition(() => router.refresh());
  }

  async function unassign() {
    setLabel("");
    await fetch(`/api/contacts/${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_member_id: null, assigned_label: null }),
    });
    startTransition(() => router.refresh());
  }

  if (!members.length) return null;

  return (
    <Row gap={3} align="center" style={{ flexWrap: "wrap" }}>
      <UserCog size={12} className="u-tone-dim" style={{ flexShrink: 0 }} />
      <Text size="sm" tone="dim" style={{ flexShrink: 0 }}>
        {label ? label.replace("Human: ", "") : "Unassigned"}
      </Text>
      <select
        disabled={pending}
        value=""
        onChange={(e) => {
          const val = e.target.value;
          if (val === "__none__") unassign();
          else {
            const m = members.find((m) => m.id === val);
            if (m) assign(m.id, m.name);
          }
        }}
        style={{
          padding: "3px 8px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          color: "var(--ink)",
          fontSize: 11,
          cursor: "pointer",
          marginLeft: "auto",
        }}
      >
        <option value="" disabled>Reassign…</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
        {label && <option value="__none__">Unassign</option>}
      </select>
    </Row>
  );
}
