"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { Developer, Property } from "@/lib/data";
import {
  FolderOpen, Upload, Building2, TrendingUp, MapPin, Bed, Square,
  ChevronRight, Download, FileText, Loader2,
} from "lucide-react";
import {
  Stack, Row, Text, Card, Badge, Button, EmptyState, cx,
} from "@/ui";
import { DOC_CATEGORIES, formatBytes, type DocItem } from "@/lib/documents-shared";
import { listDocsAction, uploadDocAction } from "./actions";

type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple";

const devBadgeTone: Record<string, BadgeTone> = {
  "Emaar Properties": "info",
  "Nakheel":          "success",
  "DAMAC Properties": "purple",
  "Sobha Realty":     "accent",
  "Meraas":           "warning",
};

export default function DevelopersClient({
  developers,
  properties,
  docCounts,
}: {
  developers: Developer[];
  properties: Property[];
  docCounts: Record<string, Record<string, number>>;
}) {
  const [activeDev, setActiveDev] = useState<string>(developers[0]?.id ?? "");

  const selectedDev   = developers.find(d => d.id === activeDev);
  const devProperties = selectedDev
    ? properties.filter(p => p.developer === selectedDev.name)
    : [];

  return (
    <div>
      <Header title="Developer Portal" subtitle="Inventory and documents by developer" />
      <div style={{ padding: "var(--space-9) var(--space-10)" }}>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "var(--space-8)" }}>

          {/* Developer list */}
          <Stack gap={3}>
            <Text
              size="xs" weight="semibold" tone="muted"
              style={{ marginBottom: "var(--space-3)", letterSpacing: "0.03em" }}
            >
              DEVELOPERS
            </Text>
            {developers.map(dev => {
              const isActive = activeDev === dev.id;
              const tone = devBadgeTone[dev.name] ?? "neutral";
              return (
                <button
                  key={dev.id}
                  onClick={() => setActiveDev(dev.id)}
                  className="u-card"
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "var(--space-6)",
                    background: isActive ? "var(--primary-dim)" : "var(--surface)",
                    borderColor: isActive ? "var(--primary-border)" : "var(--border)",
                    cursor: "pointer",
                    transition: "background 150ms ease, border-color 150ms ease",
                  }}
                >
                  <Row gap={3} style={{ marginBottom: "var(--space-3)" }}>
                    <Badge tone={tone}>{dev.logo}</Badge>
                    <Text size="sm" weight="medium" truncate className="u-grow">{dev.name}</Text>
                  </Row>
                  <Row between>
                    <Text size="xs" tone="muted">{dev.activeListings} active</Text>
                    <Text size="xs" weight="semibold" tone="accent" mono>{dev.totalValue}</Text>
                  </Row>
                </button>
              );
            })}
          </Stack>

          {/* Detail panel */}
          {selectedDev && (
            <Stack gap={7}>

              {/* Developer header card */}
              <Card style={{ padding: "var(--space-8)" }}>
                <Row between wrap gap={6} style={{ marginBottom: "var(--space-8)" }}>
                  <Row gap={6}>
                    <div
                      className="u-row"
                      style={{
                        width: "44px", height: "44px", borderRadius: "var(--radius-md)",
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                        justifyContent: "center", fontSize: "var(--text-lg)",
                      }}
                    >
                      {selectedDev.logo}
                    </div>
                    <Stack gap={1}>
                      <Text size="md" weight="semibold">{selectedDev.name}</Text>
                      <Text size="xs" tone="muted">{selectedDev.properties} {selectedDev.properties === 1 ? "project" : "projects"} · {selectedDev.totalValue}</Text>
                    </Stack>
                  </Row>
                </Row>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
                  {([
                    { label: "Projects",        value: String(selectedDev.properties),    tone: "ink"     as const },
                    { label: "Active listings", value: String(selectedDev.activeListings), tone: "success" as const },
                    { label: "Portfolio value", value: selectedDev.totalValue,             tone: "accent"  as const },
                  ]).map(({ label, value, tone }) => (
                    <Stack
                      key={label}
                      gap={3}
                      style={{
                        padding: "var(--space-6)", borderRadius: "var(--radius-sm)",
                        textAlign: "center", alignItems: "center",
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                      }}
                    >
                      <Text size="md" weight="bold" tone={tone} mono style={{ lineHeight: 1 }}>{value}</Text>
                      <Text size="2xs" tone="dim">{label}</Text>
                    </Stack>
                  ))}
                </div>

                {/* Document library */}
                <Stack
                  gap={3}
                  style={{
                    padding: "var(--space-6) var(--space-7)", borderRadius: "var(--radius-sm)",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                  }}
                >
                  <Row gap={3}>
                    <FolderOpen size={13} style={{ color: "var(--info)" }} />
                    <Text size="xs" weight="medium">Documents / {selectedDev.name}</Text>
                  </Row>
                  {DOC_CATEGORIES.map((cat) => (
                    <FolderRow
                      key={cat.kind}
                      developer={selectedDev.name}
                      kind={cat.kind}
                      label={cat.label}
                      count={docCounts[selectedDev.name]?.[cat.kind] ?? 0}
                    />
                  ))}
                </Stack>
              </Card>

              {/* Properties */}
              <div>
                <Row gap={3} style={{ marginBottom: "var(--space-7)" }}>
                  <Building2 size={14} style={{ color: "var(--dim)" }} />
                  <Text size="sm" weight="semibold">Properties</Text>
                  <Badge>{devProperties.length} listed</Badge>
                </Row>

                {devProperties.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-5)" }}>
                    {devProperties.map((p) => (
                      <Card key={p.id} style={{ padding: "var(--space-6) var(--space-7)", display: "flex", gap: "var(--space-7)" }}>
                        <div
                          className="u-row"
                          style={{
                            width: "56px", height: "56px", borderRadius: "var(--radius-sm)", flexShrink: 0,
                            background: "var(--surface-2)", border: "1px solid var(--border)",
                            justifyContent: "center", color: "var(--dim)",
                          }}
                        >
                          <Building2 size={20} />
                        </div>
                        <Stack gap={2} className="u-grow">
                          <Text size="sm" weight="semibold">{p.name}</Text>
                          <Row gap={2}>
                            <MapPin size={10} style={{ color: "var(--muted)" }} />
                            <Text size="xs" tone="muted">{p.location}</Text>
                          </Row>
                          <Row gap={6}>
                            <Row gap={2}>
                              <Bed size={10} style={{ color: "var(--muted)" }} />
                              <Text size="xs" tone="muted">{p.bedrooms} BR</Text>
                            </Row>
                            <Row gap={2}>
                              <Square size={10} style={{ color: "var(--muted)" }} />
                              <Text size="xs" tone="muted">{p.sqft.toLocaleString()} sqft</Text>
                            </Row>
                          </Row>
                          <Row gap={5}>
                            <Text size="base" weight="bold" tone="accent" mono>
                              AED {(p.price / 1_000_000).toFixed(1)}M
                            </Text>
                            <Row gap={1}>
                              <TrendingUp size={10} style={{ color: "var(--success)" }} />
                              <Text size="xs" tone="success">{p.roi}% ROI</Text>
                            </Row>
                            <Text size="xs" tone="dim">{p.completion}</Text>
                          </Row>
                          <Row gap={3} style={{ marginTop: "var(--space-2)" }}>
                            {p.tags.map(t => (
                              <Badge key={t} tone={t === "sale" ? "success" : "info"}>{t}</Badge>
                            ))}
                          </Row>
                        </Stack>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <EmptyState icon={<FolderOpen size={28} />} title="No properties listed">
                      No properties listed for this developer yet.
                    </EmptyState>
                  </Card>
                )}
              </div>
            </Stack>
          )}
        </div>
      </div>
    </div>
  );
}

function FolderRow({
  developer, kind, label, count,
}: { developer: string; kind: string; label: string; count: number }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<DocItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setDocs(await listDocsAction(developer, kind));
    } catch {
      setError("Couldn't load documents");
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && docs === null) load();
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const fd = new FormData();
    fd.set("developer", developer);
    fd.set("kind", kind);
    fd.set("file", file);
    setError(null);
    startUpload(async () => {
      const res = await uploadDocAction(fd);
      if (!res.ok) { setError(res.error ?? "Upload failed"); return; }
      await load();
      router.refresh();
    });
  }

  return (
    <Stack gap={1} style={{ borderLeft: "1px solid var(--border)" }}>
      <Row
        gap={3}
        onClick={toggle}
        style={{
          padding: "var(--space-3) var(--space-4) var(--space-3) var(--space-8)",
          cursor: "pointer",
          borderRadius: "var(--radius-sm)",
          transition: "background 120ms ease",
        }}
        className={cx("folder-row-trigger")}
      >
        <ChevronRight
          size={11}
          style={{
            color: "var(--dim)", flexShrink: 0,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 150ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
        <FolderOpen size={11} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <Text size="xs" tone="muted" className="u-grow">{label}</Text>
        <Text size="2xs" tone="dim" mono>{count} {count === 1 ? "file" : "files"}</Text>
      </Row>

      {open && (
        <Stack gap={2} style={{ padding: "var(--space-2) var(--space-4) var(--space-4) var(--space-10)" }}>
          {loading && (
            <Row gap={2}>
              <Loader2 size={12} className="u-spin" style={{ color: "var(--dim)" }} />
              <Text size="2xs" tone="dim">Loading…</Text>
            </Row>
          )}
          {error && (
            <Text size="2xs" style={{ color: "var(--warning)" }}>{error}</Text>
          )}
          {!loading && docs && docs.length === 0 && (
            <Text size="2xs" tone="dim">No files yet — upload one below.</Text>
          )}
          {!loading && docs && docs.map((d) => (
            <Row key={d.id} gap={3} style={{ padding: "var(--space-2) 0" }}>
              <FileText size={11} style={{ color: "var(--dim)", flexShrink: 0 }} />
              <Stack gap={1} className="u-grow" style={{ minWidth: 0 }}>
                <Text size="2xs" tone="muted" truncate>{d.title}</Text>
                <Text size="2xs" tone="dim" mono>{formatBytes(d.sizeBytes)}</Text>
              </Stack>
              {d.downloadable && d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-row"
                  style={{ gap: "var(--space-2)", color: "var(--accent)", fontSize: "var(--text-2xs)" }}
                >
                  <Download size={11} /> Download
                </a>
              ) : (
                <Text size="2xs" tone="dim" title="No file stored — reference only">ref</Text>
              )}
            </Row>
          ))}

          <Row gap={3} style={{ marginTop: "var(--space-2)" }}>
            <Button
              variant="ghost"
              size="sm"
              icon={uploading ? <Loader2 size={12} className="u-spin" /> : <Upload size={12} />}
              loading={uploading}
              onClick={() => fileInput.current?.click()}
            >
              {uploading ? "Uploading…" : `Upload to ${label}`}
            </Button>
            <input ref={fileInput} type="file" hidden onChange={onPick} />
          </Row>
        </Stack>
      )}
    </Stack>
  );
}
