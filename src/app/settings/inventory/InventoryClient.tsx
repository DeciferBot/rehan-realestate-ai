"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { InventoryProject } from "@/lib/admin";
import { UploadCloud, FileText, Loader2, MapPin, Layers, Building2 } from "lucide-react";

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
    <div style={{ padding: "24px 28px" }}>
      <style>{".spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      {/* Uploader */}
      <div
        className="panel-lg"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        style={{ padding: 28, marginBottom: 20, textAlign: "center", border: "1px dashed var(--border)" }}
      >
        <input ref={fileRef} type="file" accept="application/pdf" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--primary-dim)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
            {busy ? <Loader2 size={22} className="spin" /> : <UploadCloud size={22} />}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Drop developer availability PDFs here</div>
          <div style={{ fontSize: 12, color: "var(--dim)", maxWidth: 420 }}>
            The agent extracts every unit — price, size, view, bedrooms — and adds it to this tenant&apos;s inventory automatically.
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={() => fileRef.current?.click()} disabled={busy} style={{ marginTop: 4 }}>
            <FileText size={13} />{busy ? "Ingesting…" : "Choose PDFs"}
          </button>
        </div>
        {log.length > 0 && (
          <div style={{ marginTop: 16, textAlign: "left", display: "flex", flexDirection: "column", gap: 4 }}>
            {log.map((l, i) => (
              <div key={i} style={{ fontSize: 12, color: l.startsWith("✗") ? "var(--primary)" : "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}>{l}</div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory list */}
      <div className="panel-lg" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <Building2 size={13} style={{ color: "var(--dim)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Live inventory</span>
          <span className="badge badge-muted">{projects.length} projects</span>
          <span className="badge badge-accent" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Layers size={10} />{totalUnits} units</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>{["Project", "Developer", "Location", "Beds", "Units", "Price range"].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 500, fontSize: 13, color: "var(--ink)" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>{p.completion}</div>
                </td>
                <td style={{ color: "var(--muted)" }}>{p.developer}</td>
                <td style={{ color: "var(--muted)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={10} />{p.location}</span>
                </td>
                <td style={{ color: "var(--muted)" }}>{p.bedsMin === p.bedsMax ? `${p.bedsMin}BR` : `${p.bedsMin}–${p.bedsMax}BR`}</td>
                <td><span className="mono" style={{ color: "var(--ink)" }}>{p.units}</span></td>
                <td><span className="mono" style={{ fontWeight: 600, color: "var(--accent)" }}>{aed(p.priceMin)} – {aed(p.priceMax)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
