"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { InventoryProject } from "@/lib/admin";
import { UploadCloud, FileText, Loader2, MapPin, Layers, Building2 } from "lucide-react";
import { Stack, Row, Text, Card, CardHeader, Badge, Button } from "@/ui";

function aed(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  return `AED ${(n / 1000).toFixed(0)}K`;
}

export default function InventoryClient({ projects }: { projects: InventoryProject[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0 || busy) return;
    setBusy(true);
    setLog([]);
    for (const file of Array.from(files)) {
      setLog((l) => [...l, `Reading ${file.name}…`]);
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/ingest", { method: "POST", body: form });
        const json = await res.json();
        if (res.ok && json.ok) {
          const summary = (json.projects as { name: string; units: number }[]).map((p) => `${p.name} (${p.units})`).join(", ");
          setLog((l) => [...l.slice(0, -1), `✓ ${file.name}: ${json.totalUnits} units → ${summary}`]);
        } else {
          setLog((l) => [...l.slice(0, -1), `✗ ${file.name}: ${json.error === "not_configured" ? "Claude key not set" : "failed"}`]);
        }
      } catch {
        setLog((l) => [...l.slice(0, -1), `✗ ${file.name}: failed`]);
      }
    }
    setBusy(false);
    router.refresh();
  }

  const totalUnits = projects.reduce((s, p) => s + p.units, 0);

  return (
    <Stack gap={6} style={{ padding: "var(--space-9) var(--space-9)" }}>
      <style>{".spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      {/* Uploader */}
      <Card
        pad
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        style={{ textAlign: "center", border: "1px dashed var(--border)" }}
      >
        <input ref={fileRef} type="file" accept="application/pdf" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        <Stack gap={4} style={{ alignItems: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", background: "var(--primary-dim)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
            {busy ? <Loader2 size={22} className="spin" /> : <UploadCloud size={22} />}
          </div>
          <Text size="sm" weight="semibold">Drop developer availability PDFs here</Text>
          <Text size="xs" tone="dim" style={{ maxWidth: 420 }}>
            The agent extracts every unit — price, size, view, bedrooms — and adds it to this tenant&apos;s inventory automatically.
          </Text>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={busy} icon={<FileText size={13} />}>
            {busy ? "Ingesting…" : "Choose PDFs"}
          </Button>
        </Stack>
        {log.length > 0 && (
          <Stack gap={1} style={{ marginTop: "var(--space-7)", textAlign: "left" }}>
            {log.map((l, i) => (
              <Text key={i} size="xs" mono tone={l.startsWith("✗") ? "primary" : "muted"}>{l}</Text>
            ))}
          </Stack>
        )}
      </Card>

      {/* Inventory list */}
      <Card flush>
        <CardHeader>
          <Building2 size={13} style={{ color: "var(--dim)" }} />
          <Text size="sm" weight="semibold">Live inventory</Text>
          <Badge>{projects.length} projects</Badge>
          <Badge tone="accent"><Layers size={10} />{totalUnits} units</Badge>
        </CardHeader>
        <table className="data-table">
          <thead>
            <tr>{["Project", "Developer", "Location", "Beds", "Units", "Price range"].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <Text as="div" size="sm" weight="medium">{p.name}</Text>
                  <Text as="div" size="2xs" tone="dim" style={{ marginTop: "var(--space-1)" }}>{p.completion}</Text>
                </td>
                <td><Text size="sm" tone="muted">{p.developer}</Text></td>
                <td>
                  <Row gap={1}><MapPin size={10} /><Text size="sm" tone="muted">{p.location}</Text></Row>
                </td>
                <td><Text size="sm" tone="muted">{p.bedsMin === p.bedsMax ? `${p.bedsMin}BR` : `${p.bedsMin}–${p.bedsMax}BR`}</Text></td>
                <td><Text size="sm" mono>{p.units}</Text></td>
                <td><Text size="sm" mono weight="semibold" tone="accent">{aed(p.priceMin)} – {aed(p.priceMax)}</Text></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Stack>
  );
}
