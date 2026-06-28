"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Stack, Row, Text } from "@/ui";
import AssignSelect from "./AssignSelect";

type Member = { id: string; name: string };

const STATUSES = ["new", "engaging", "qualified", "appointed", "closed", "lost"] as const;
type Status = (typeof STATUSES)[number];

const statusColor: Record<Status, string> = {
  new: "#6366f1",
  engaging: "#0ea5e9",
  qualified: "#8b5cf6",
  appointed: "#f59e0b",
  closed: "#10b981",
  lost: "#6b7280",
};

export default function OperatorControls({
  contactId,
  currentStatus,
  currentNotes,
  currentAssignedLabel,
  members,
}: {
  contactId: string;
  currentStatus: string;
  currentNotes: string | null;
  currentAssignedLabel: string | null;
  members: Member[];
}) {
  const [status, setStatus] = useState(currentStatus as Status);
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function patchContact(patch: { status?: string; notes?: string }) {
    await fetch(`/api/contacts/${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    startTransition(() => router.refresh());
  }

  async function changeStatus(s: Status) {
    setStatus(s);
    await patchContact({ status: s });
  }

  async function saveNotes() {
    await patchContact({ notes });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  return (
    <Stack style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Assign */}
      {members.length > 0 && (
        <Stack gap={3} style={{ padding: "var(--space-7)", borderBottom: "1px solid var(--border)" }}>
          <Text size="sm" weight="semibold">Assigned closer</Text>
          <AssignSelect contactId={contactId} currentLabel={currentAssignedLabel} members={members} />
        </Stack>
      )}

      {/* Status picker */}
      <Stack gap={3} style={{ padding: "var(--space-7)", borderBottom: "1px solid var(--border)" }}>
        <Text size="sm" weight="semibold">Lead status</Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              disabled={pending}
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid ${s === status ? statusColor[s] : "var(--border)"}`,
                background: s === status ? statusColor[s] + "22" : "transparent",
                color: s === status ? statusColor[s] : "var(--muted)",
                fontSize: 11,
                fontWeight: s === status ? 600 : 400,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </Stack>

      {/* Notes */}
      <Stack gap={3} style={{ padding: "var(--space-7)" }}>
        <Text size="sm" weight="semibold">Operator notes</Text>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add context, tasks, follow-up reminders…"
          rows={4}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--ink)",
            fontSize: 12,
            lineHeight: 1.5,
            resize: "vertical",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <Row style={{ justifyContent: "flex-end" }}>
          <button
            onClick={saveNotes}
            disabled={pending}
            style={{
              padding: "5px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: notesSaved ? "var(--success-dim, #d1fae5)" : "var(--surface-2)",
              color: notesSaved ? "var(--success, #059669)" : "var(--ink)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {notesSaved ? "Saved" : "Save notes"}
          </button>
        </Row>
      </Stack>
    </Stack>
  );
}
