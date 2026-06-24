"use client";
import { useState } from "react";
import Header from "@/components/Header";
import type { Developer, Property } from "@/lib/data";
import {
  FolderOpen, RefreshCw, Plus, CheckCircle2, AlertCircle,
  Upload, Building2, TrendingUp, MapPin, Bed, Square,
} from "lucide-react";
import {
  Stack, Row, Text, Card, Badge, Button, EmptyState, cx,
} from "@/ui";

type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple";

const devBadgeTone: Record<string, BadgeTone> = {
  "Emaar Properties": "info",
  "Nakheel":          "success",
  "DAMAC Properties": "purple",
  "Sobha Realty":     "accent",
  "Meraas":           "warning",
};

const folders = ["Floor Plans", "Brochures", "Payment Plans", "Legal Documents", "Media Assets"];
const folderCounts = [14, 8, 5, 12, 31];

export default function DevelopersClient({ developers, properties }: { developers: Developer[]; properties: Property[] }) {
  const [activeDev, setActiveDev] = useState<string>("D001");

  const selectedDev   = developers.find(d => d.id === activeDev);
  const devProperties = selectedDev
    ? properties.filter(p => p.developer === selectedDev.name)
    : [];

  return (
    <div>
      <Header title="Developer Portal" subtitle="Manage multi-developer portfolios & OneDrive sync" />
      <div style={{ padding: "var(--space-9) var(--space-10)" }}>

        {/* OneDrive banner */}
        <Card
          className="u-row--between u-row--wrap"
          style={{
            marginBottom: "var(--space-8)",
            padding: "var(--space-6) var(--space-7)",
            background: "var(--info-dim)",
            borderColor: "oklch(0.42 0.130 245 / 0.28)",
            gap: "var(--space-6)",
          }}
        >
          <Row gap={6}>
            <div
              className="u-row"
              style={{
                width: "36px", height: "36px", borderRadius: "var(--radius-sm)", flexShrink: 0,
                background: "var(--info-dim)", border: "1px solid oklch(0.42 0.130 245 / 0.28)",
                justifyContent: "center",
              }}
            >
              <FolderOpen size={16} style={{ color: "var(--info)" }} />
            </div>
            <Stack gap={1}>
              <Text size="sm" weight="semibold">OneDrive Integration Active</Text>
              <Text size="xs" tone="muted">4 of 5 developers synced · Last sync: 10 minutes ago</Text>
            </Stack>
          </Row>
          <Row gap={3}>
            <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />}>Sync all</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add developer</Button>
          </Row>
        </Card>

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
              const tone = devBadgeTone[dev.name] || "neutral";
              return (
                <button
                  key={dev.id}
                  onClick={() => setActiveDev(dev.id)}
                  className="u-card"
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "var(--space-6) var(--space-6)",
                    background: isActive ? "var(--primary-dim)" : "var(--surface)",
                    borderColor: isActive ? "var(--primary-border)" : "var(--border)",
                    cursor: "pointer",
                  }}
                >
                  <Row gap={3} style={{ marginBottom: "var(--space-4)" }}>
                    <Badge tone={tone}>{dev.logo}</Badge>
                    <Text size="sm" weight="medium" truncate className="u-grow">{dev.name}</Text>
                  </Row>
                  <Row gap={2} style={{ marginBottom: "var(--space-3)" }}>
                    {dev.onedrive ? (
                      <>
                        <CheckCircle2 size={10} style={{ color: "var(--success)" }} />
                        <Text size="2xs" tone="success">Synced</Text>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={10} style={{ color: "var(--warning)" }} />
                        <Text size="2xs" style={{ color: "var(--warning)" }}>Manual</Text>
                      </>
                    )}
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

              {/* Header */}
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
                      <Text size="xs" tone="muted">{selectedDev.properties} properties · {selectedDev.totalValue}</Text>
                    </Stack>
                  </Row>
                  <Row gap={3}>
                    <Button variant="ghost" size="sm" icon={<Upload size={13} />}>Upload brochure</Button>
                    <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />}>Sync now</Button>
                    <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add property</Button>
                  </Row>
                </Row>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
                  {([
                    { label: "Total listings",  value: String(selectedDev.properties),    tone: "ink"     as const },
                    { label: "Active listings", value: String(selectedDev.activeListings), tone: "success" as const },
                    { label: "Portfolio value", value: selectedDev.totalValue,             tone: "accent"  as const },
                    { label: "Last synced",     value: selectedDev.lastSync,               tone: "muted"   as const },
                  ]).map(({ label, value, tone }) => (
                    <Stack
                      key={label}
                      gap={3}
                      style={{
                        padding: "var(--space-6) var(--space-6)", borderRadius: "var(--radius-sm)",
                        textAlign: "center", alignItems: "center",
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                      }}
                    >
                      <Text size="md" weight="bold" tone={tone} mono style={{ lineHeight: 1 }}>{value}</Text>
                      <Text size="2xs" tone="dim">{label}</Text>
                    </Stack>
                  ))}
                </div>

                {/* OneDrive folder tree */}
                <Stack
                  gap={3}
                  style={{
                    padding: "var(--space-6) var(--space-7)", borderRadius: "var(--radius-sm)",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                  }}
                >
                  <Row gap={3}>
                    <FolderOpen size={13} style={{ color: "var(--info)" }} />
                    <Text size="xs" weight="medium">OneDrive / Rehan RE / {selectedDev.name}</Text>
                  </Row>
                  {folders.map((folder, i) => (
                    <Row
                      key={folder}
                      gap={3}
                      style={{
                        padding: "var(--space-3) var(--space-4) var(--space-3) var(--space-8)",
                        borderLeft: "1px solid var(--border)", cursor: "pointer",
                      }}
                    >
                      <FolderOpen size={11} style={{ color: "var(--accent)", flexShrink: 0 }} />
                      <Text size="xs" tone="muted" className="u-grow">{folder}</Text>
                      <Text size="2xs" tone="dim" mono>{folderCounts[i]} files</Text>
                    </Row>
                  ))}
                </Stack>
              </Card>

              {/* Properties grid */}
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
                      No properties listed for this developer. Upload from OneDrive or add manually.
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
