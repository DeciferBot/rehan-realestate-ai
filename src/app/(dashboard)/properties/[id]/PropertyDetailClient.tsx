"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { Property } from "@/lib/data";
import { whatsappShareUrl } from "@/lib/share";
import { computeReturns, defaultInputs, type ReturnInputs } from "@/lib/investment";
import { ArrowLeft, MapPin, Bed, Square, Building2, CalendarClock, Send, TrendingUp } from "lucide-react";
import { Stack, Row, Text, Card, Badge, Button, Field, Input } from "@/ui";

const areaBg: Record<string, string> = {
  downtown: "oklch(0.24 0.035 245)",
  palm:     "oklch(0.24 0.030 148)",
  hills:    "oklch(0.22 0.030 295)",
  harbour:  "oklch(0.23 0.025 220)",
  lamer:    "oklch(0.24 0.030 52)",
  valley:   "oklch(0.23 0.028 148)",
};

const aed = (n: number) =>
  n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(2)}M` : `AED ${Math.round(n).toLocaleString()}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

function NumberField({ label, hint, value, onChange, prefix, suffix, step = 1 }: {
  label: string; hint?: string; value: number; onChange: (n: number) => void;
  prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <Row gap={2} align="center">
        {prefix && <Text size="xs" tone="dim">{prefix}</Text>}
        <Input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{ width: "100%" }}
        />
        {suffix && <Text size="xs" tone="dim">{suffix}</Text>}
      </Row>
    </Field>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "accent" | "success" | "primary" }) {
  return (
    <Stack gap={1} align="center" style={{ flex: 1 }}>
      <Text size="2xs" tone="dim">{label}</Text>
      <Text size="lg" mono weight="bold" tone={tone ?? "ink"}>{value}</Text>
    </Stack>
  );
}

export default function PropertyDetailClient({ property: p }: { property: Property }) {
  const router = useRouter();
  const [lightbox, setLightbox] = useState(false);
  const [inputs, setInputs] = useState<ReturnInputs>(() => defaultInputs(p));
  const r = useMemo(() => computeReturns(inputs), [inputs]);
  const set = (patch: Partial<ReturnInputs>) => setInputs((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const bgColor = areaBg[p.image] || "oklch(0.22 0.010 55)";
  const heroBg = p.heroImage
    ? `linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.74) 100%), url(${p.heroImage}) center/cover no-repeat`
    : bgColor;

  function shareOnWhatsApp() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/properties/${p.id}` : undefined;
    window.open(whatsappShareUrl(p, url), "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <Header title={p.name} subtitle={`${p.location} · ${p.developer}`} />
      <Stack gap={7} className="page-pad" style={{ padding: "var(--space-9) var(--space-10)" }}>
        <Row between wrap gap={4}>
          <Button size="sm" icon={<ArrowLeft size={12} />} onClick={() => router.push("/properties")}>
            Back to listings
          </Button>
          <Button variant="primary" size="sm" icon={<Send size={12} />} onClick={shareOnWhatsApp}>
            Share on WhatsApp
          </Button>
        </Row>

        <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 380px)", gap: "var(--space-8)", alignItems: "start" }}>

          {/* Left — listing facts */}
          <Stack gap={6}>
            <Card flush>
              <Stack
                between
                className="property-hero"
                onClick={p.heroImage ? () => setLightbox(true) : undefined}
                title={p.heroImage ? "View full-size image" : undefined}
                style={{ background: heroBg, padding: "var(--space-7)", cursor: p.heroImage ? "zoom-in" : undefined }}
              >
                <Row between align="flex-start">
                  <Badge>{p.developer}</Badge>
                  <Row gap={1}>
                    {p.tags.includes("sale") && <Badge tone="success">Sale</Badge>}
                    {p.tags.includes("rent") && <Badge tone="info">Rent</Badge>}
                  </Row>
                </Row>
                <Stack gap={1}>
                  <Text mono weight="bold" style={{ fontSize: "var(--text-2xl)", color: "white", lineHeight: 1 }}>
                    AED {(p.price / 1_000_000).toFixed(1)}M
                  </Text>
                  <Text size="xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {p.completion !== "Ready" && p.completion !== "—" ? `Ready: ${p.completion}` : "✓ Ready to move"}
                  </Text>
                </Stack>
              </Stack>

              <Stack gap={5} style={{ padding: "var(--space-7)" }}>
                <Row gap={6} wrap>
                  <Row gap={2}><MapPin size={13} style={{ color: "var(--dim)" }} /><Text size="sm" tone="muted">{p.location}</Text></Row>
                  <Row gap={2}><Bed size={13} style={{ color: "var(--muted)" }} /><Text size="sm" tone="muted">{p.bedrooms} BR</Text></Row>
                  <Row gap={2}><Square size={13} style={{ color: "var(--muted)" }} /><Text size="sm" tone="muted">{p.sqft.toLocaleString()} sqft</Text></Row>
                  <Row gap={2}><Building2 size={13} style={{ color: "var(--muted)" }} /><Text size="sm" tone="muted">{p.type}</Text></Row>
                  {p.floors && <Row gap={2}><CalendarClock size={13} style={{ color: "var(--muted)" }} /><Text size="sm" tone="muted">Floor {p.floors}</Text></Row>}
                </Row>

                {p.description && (
                  <Text size="sm" tone="dim" style={{ lineHeight: "var(--leading-normal)" }}>{p.description}</Text>
                )}

                {p.amenities.length > 0 && (
                  <Row gap={2} wrap>
                    {p.amenities.map((a) => <Badge key={a}>{a}</Badge>)}
                  </Row>
                )}
              </Stack>
            </Card>
          </Stack>

          {/* Right — ROI / yield calculator */}
          <Card pad>
            <Stack gap={5}>
              <Row gap={2} align="center">
                <TrendingUp size={14} style={{ color: "var(--accent)" }} />
                <Text size="md" weight="semibold" tone="ink">ROI &amp; Yield Calculator</Text>
              </Row>
              <Text size="xs" tone="dim" style={{ lineHeight: "var(--leading-normal)" }}>
                Estimated from area benchmarks — adjust the assumptions to model this unit.
              </Text>

              {/* Results */}
              <Row style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-5) var(--space-4)" }}>
                <Metric label="Gross yield" value={pct(r.grossYieldPct)} tone="success" />
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />
                <Metric label="Net yield" value={pct(r.netYieldPct)} tone="success" />
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />
                <Metric label="Cash-on-cash" value={pct(r.cashOnCashPct)} tone="accent" />
              </Row>
              <Row style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "var(--space-5) var(--space-4)" }}>
                <Metric label={`ROI over ${inputs.years} yr`} value={pct(r.roiTotalPct)} tone="accent" />
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />
                <Metric label="Annualized" value={pct(r.roiAnnualizedPct)} tone="accent" />
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />
                <Metric label="Total profit" value={aed(r.totalProfit)} tone="primary" />
              </Row>

              {/* Inputs */}
              <Stack gap={4}>
                <NumberField label="Expected annual rent" prefix="AED" step={1000}
                  value={inputs.annualRent} onChange={(n) => set({ annualRent: n })} />
                <NumberField label="Service charge / year" prefix="AED" step={500}
                  value={inputs.serviceCharge} onChange={(n) => set({ serviceCharge: n })} />
                <Row gap={4}>
                  <NumberField label="Appreciation" suffix="%/yr" step={0.5}
                    value={inputs.appreciationPct} onChange={(n) => set({ appreciationPct: n })} />
                  <NumberField label="Hold period" suffix="yrs" step={1}
                    value={inputs.years} onChange={(n) => set({ years: Math.round(n) })} />
                </Row>
                <NumberField label="Down payment" suffix="% (cash in)" step={5} hint="Used for cash-on-cash return"
                  value={inputs.downPaymentPct} onChange={(n) => set({ downPaymentPct: n })} />
              </Stack>

              {/* AED breakdown */}
              <Stack gap={2} style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
                <Row between><Text size="xs" tone="dim">Cash invested</Text><Text size="xs" mono tone="muted">{aed(r.cashInvested)}</Text></Row>
                <Row between><Text size="xs" tone="dim">Capital gain ({inputs.years} yr)</Text><Text size="xs" mono tone="muted">{aed(r.capitalGain)}</Text></Row>
                <Row between><Text size="xs" tone="dim">Net rental income ({inputs.years} yr)</Text><Text size="xs" mono tone="muted">{aed(r.rentalIncome)}</Text></Row>
              </Stack>
            </Stack>
          </Card>
        </div>
      </Stack>

      {lightbox && p.heroImage && (
        <div
          className="hero-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${p.name} — full-size image`}
          onClick={() => setLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.heroImage} alt={p.name} />
        </div>
      )}
    </div>
  );
}
