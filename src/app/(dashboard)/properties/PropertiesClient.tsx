"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { Property } from "@/lib/data";
import { whatsappShareUrl } from "@/lib/share";
import { MapPin, Bed, Square, TrendingUp, Send, Search } from "lucide-react";
import { Stack, Row, Text, Card, Badge, Button, Input, Select } from "@/ui";

const devBadgeTone: Record<string, "info" | "success" | "purple" | "accent" | "warning"> = {
  "Emaar Properties": "info",
  "Nakheel":          "success",
  "DAMAC Properties": "purple",
  "Sobha Realty":     "accent",
  "Meraas":           "warning",
};

// Muted image placeholder colors per area
const areaBg: Record<string, string> = {
  downtown: "oklch(0.24 0.035 245)",
  palm:     "oklch(0.24 0.030 148)",
  hills:    "oklch(0.22 0.030 295)",
  harbour:  "oklch(0.23 0.025 220)",
  lamer:    "oklch(0.24 0.030 52)",
  valley:   "oklch(0.23 0.028 148)",
};

const PRICE_BANDS: { value: string; label: string; test: (n: number) => boolean }[] = [
  { value: "0-2",  label: "Under AED 2M", test: n => n < 2_000_000 },
  { value: "2-5",  label: "AED 2–5M",     test: n => n >= 2_000_000 && n < 5_000_000 },
  { value: "5-10", label: "AED 5–10M",    test: n => n >= 5_000_000 && n < 10_000_000 },
  { value: "10+",  label: "AED 10M+",     test: n => n >= 10_000_000 },
];

export default function PropertiesClient({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [devFilter,       setDevFilter]       = useState("All");
  const [communityFilter, setCommunityFilter] = useState("All");
  const [typeFilter,      setTypeFilter]      = useState("All");
  const [bedsFilter,      setBedsFilter]      = useState("All");
  const [priceFilter,     setPriceFilter]     = useState("All");
  const [search,          setSearch]          = useState("");

  function shareOnWhatsApp(p: Property) {
    const url = `${window.location.origin}/properties/${p.id}`;
    window.open(whatsappShareUrl(p, url), "_blank", "noopener,noreferrer");
  }

  // Filter options derived from the live inventory so they never go stale.
  const developers  = Array.from(new Set(properties.map(p => p.developer))).sort();
  const communities = Array.from(new Set(properties.map(p => p.location))).sort();
  const types       = Array.from(new Set(properties.map(p => p.type))).sort();
  const bedOptions  = Array.from(new Set(properties.map(p => p.bedrooms))).sort((a, b) => a - b);

  const q = search.trim().toLowerCase();
  const filtered = properties.filter(p =>
    (devFilter       === "All" || p.developer === devFilter) &&
    (communityFilter === "All" || p.location  === communityFilter) &&
    (typeFilter      === "All" || p.type      === typeFilter) &&
    (bedsFilter      === "All" || p.bedrooms  === Number(bedsFilter)) &&
    (priceFilter     === "All" || !!PRICE_BANDS.find(b => b.value === priceFilter)?.test(p.price)) &&
    (q === "" || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
  );

  return (
    <div>
      <Header title="Property Listings" subtitle="Multi-developer portfolio — sale & rental inventory" />
      <Stack gap={8} style={{ padding: "var(--space-9) var(--space-10)" }}>

        {/* Filters */}
        <Row gap={3} wrap align="center">
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={12} style={{ position: "absolute", left: "var(--space-4)", color: "var(--dim)", pointerEvents: "none" }} />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search properties…"
              style={{ paddingLeft: "var(--space-10)", width: "200px" }}
            />
          </div>

          <div style={{ width: "1px", alignSelf: "stretch", background: "var(--border)" }} />

          {developers.length > 1 && (
            <Select value={devFilter} onChange={e => setDevFilter(e.target.value)} aria-label="Developer">
              <option value="All">All developers</option>
              {developers.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          )}

          <Select value={communityFilter} onChange={e => setCommunityFilter(e.target.value)} aria-label="Community">
            <option value="All">All communities</option>
            {communities.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} aria-label="Property type">
            <option value="All">Any type</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>

          <Select value={bedsFilter} onChange={e => setBedsFilter(e.target.value)} aria-label="Bedrooms">
            <option value="All">Any beds</option>
            {bedOptions.map(b => <option key={b} value={b}>{b} BR</option>)}
          </Select>

          <Select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} aria-label="Price">
            <option value="All">Any price</option>
            {PRICE_BANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </Select>
        </Row>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "var(--space-10)" }}>
          {filtered.map((p) => {
            const bgColor = areaBg[p.image] || "oklch(0.22 0.010 55)";
            const headerBg = p.heroImage
              ? `linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 100%), url(${p.heroImage}) center/cover no-repeat`
              : bgColor;
            const badgeTone = devBadgeTone[p.developer];
            return (
              <Card key={p.id} flush className="property-card">

                {/* Hero render (or colored fallback) */}
                <Stack between style={{ height: "210px", background: headerBg, padding: "var(--space-6) var(--space-6) var(--space-5)" }}>
                  <Row between align="flex-start">
                    <Badge tone={badgeTone}>{p.developer}</Badge>
                    <Row gap={1}>
                      {p.tags.includes("sale") && <Badge tone="success">Sale</Badge>}
                      {p.tags.includes("rent") && <Badge tone="info">Rent</Badge>}
                    </Row>
                  </Row>
                  <Stack gap={1}>
                    <Text mono weight="bold" style={{ fontSize: "var(--text-2xl)", color: "white", lineHeight: 1 }}>
                      {p.priceFrom ? "From " : ""}AED {(p.price / 1_000_000).toFixed(1)}M
                    </Text>
                    <Text size="xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {p.completion !== "Ready" ? `Ready: ${p.completion}` : "✓ Ready to move"}
                    </Text>
                  </Stack>
                </Stack>

                {/* Content */}
                <Stack gap={5} style={{ padding: "var(--space-6) var(--space-7) var(--space-7)" }}>
                  <Stack gap={2}>
                    <Row between align="center" gap={3}>
                      <Text size="md" weight="semibold" tone="ink">{p.name}</Text>
                      {p.unitCount > 1 && <Badge tone="neutral">{p.unitCount} available</Badge>}
                    </Row>
                    <Row gap={2}>
                      <MapPin size={11} style={{ color: "var(--dim)" }} />
                      <Text size="sm" tone="muted">{p.location}</Text>
                    </Row>
                  </Stack>

                  <Row gap={6}>
                    <Row gap={2}>
                      <Bed size={12} style={{ color: "var(--muted)" }} />
                      <Text size="sm" tone="muted">{p.bedrooms} BR</Text>
                    </Row>
                    <Row gap={2}>
                      <Square size={12} style={{ color: "var(--muted)" }} />
                      <Text size="sm" tone="muted">{p.sqft.toLocaleString()} sqft</Text>
                    </Row>
                  </Row>

                  {/* Stats row */}
                  <Row style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-4) var(--space-5)" }}>
                    <Stack gap={1} align="center" style={{ flex: 1 }}>
                      <Row gap={1}>
                        <TrendingUp size={10} style={{ color: "var(--accent)" }} />
                        <Text size="2xs" tone="dim">ROI</Text>
                      </Row>
                      <Text size="md" mono weight="bold" tone="accent">{p.roi}%</Text>
                    </Stack>
                    <div style={{ width: "1px", alignSelf: "stretch", background: "var(--border)" }} />
                    <Stack gap={1} align="center" style={{ flex: 1 }}>
                      <Text size="2xs" tone="dim">Yield</Text>
                      <Text size="md" mono weight="bold" tone="success">{p.rentalYield}%</Text>
                    </Stack>
                    <div style={{ width: "1px", alignSelf: "stretch", background: "var(--border)" }} />
                    <Stack gap={1} align="center" style={{ flex: 1 }}>
                      <Text size="2xs" tone="dim">Floors</Text>
                      <Text size="sm" tone="muted">{p.floors}</Text>
                    </Stack>
                  </Row>

                  <Text size="sm" tone="dim" style={{ lineHeight: "var(--leading-normal)" }}>
                    {p.description}
                  </Text>

                  <Row gap={3}>
                    <Button variant="primary" size="sm" block style={{ flex: 1 }} onClick={() => router.push(`/properties/${p.id}`)}>
                      View details
                    </Button>
                    <Button size="sm" icon={<Send size={11} />} onClick={() => shareOnWhatsApp(p)}>WA</Button>
                  </Row>
                </Stack>
              </Card>
            );
          })}
        </div>

        <Text size="sm" tone="dim">
          {filtered.length} of {properties.length} listings · {filtered.reduce((s, p) => s + p.unitCount, 0)} units available
        </Text>
      </Stack>
    </div>
  );
}
