"use client";
import { useState } from "react";
import Header from "@/components/Header";
import type { Property } from "@/lib/data";
import { MapPin, Bed, Square, TrendingUp, Send, Search } from "lucide-react";

const devBadgeClass: Record<string, string> = {
  "Emaar Properties": "badge-info",
  "Nakheel":          "badge-success",
  "DAMAC Properties": "badge-purple",
  "Sobha Realty":     "badge-accent",
  "Meraas":           "badge-warning",
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

export default function PropertiesClient({ properties }: { properties: Property[] }) {
  const [devFilter,  setDevFilter]  = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search,     setSearch]     = useState("");

  const developers = ["All", ...Array.from(new Set(properties.map(p => p.developer)))];
  const types = ["All", "Apartment", "Villa", "Townhouse"];

  const filtered = properties.filter(p =>
    (devFilter  === "All" || p.developer === devFilter) &&
    (typeFilter === "All" || p.type      === typeFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <Header title="Property Listings" subtitle="Multi-developer portfolio — sale & rental inventory" />
      <div style={{ padding: "24px 28px" }}>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24, alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={12} style={{ position: "absolute", left: 10, color: "var(--dim)", pointerEvents: "none" }} />
            <input
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search properties..."
              style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, width: 200 }}
            />
          </div>

          <div style={{ width: 1, height: 24, background: "var(--border)" }} />

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {developers.map(d => (
              <button key={d} onClick={() => setDevFilter(d)} className={`filter-pill${devFilter === d ? " active" : ""}`}>
                {d}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: "var(--border)" }} />

          <div style={{ display: "flex", gap: 6 }}>
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`filter-pill${typeFilter === t ? " active" : ""}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {filtered.map((p) => {
            const bgColor = areaBg[p.image] || "oklch(0.22 0.010 55)";
            const badgeCls = devBadgeClass[p.developer] || "badge-muted";
            return (
              <div key={p.id} className="property-card">

                {/* Image placeholder */}
                <div style={{
                  height: 156,
                  background: bgColor,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "14px 14px 12px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className={`badge ${badgeCls}`}>{p.developer}</span>
                    <div style={{ display: "flex", gap: 5 }}>
                      {p.tags.includes("sale") && (
                        <span className="badge badge-success">Sale</span>
                      )}
                      {p.tags.includes("rent") && (
                        <span className="badge badge-info">Rent</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1 }}>
                      AED {(p.price / 1_000_000).toFixed(1)}M
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                      {p.completion !== "Ready" ? `Ready: ${p.completion}` : "✓ Ready to move"}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
                    <MapPin size={11} style={{ color: "var(--dim)" }} />
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.location}</span>
                  </div>

                  <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
                      <Bed size={12} />{p.bedrooms} BR
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
                      <Square size={12} />{p.sqft.toLocaleString()} sqft
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: "flex",
                    gap: 0,
                    padding: "10px 12px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 3 }}>
                        <TrendingUp size={10} style={{ color: "var(--accent)" }} />
                        <span style={{ fontSize: 10, color: "var(--dim)" }}>ROI</span>
                      </div>
                      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{p.roi}%</div>
                    </div>
                    <div style={{ width: 1, background: "var(--border)" }} />
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "var(--dim)", marginBottom: 3 }}>Yield</div>
                      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--success)" }}>{p.rentalYield}%</div>
                    </div>
                    <div style={{ width: 1, background: "var(--border)" }} />
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "var(--dim)", marginBottom: 3 }}>Floors</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.floors}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.5, marginBottom: 12 }}>
                    {p.description}
                  </p>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                      View details
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <Send size={11} />WA
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: "var(--dim)" }}>
          {filtered.length} of {properties.length} properties
        </div>
      </div>
    </div>
  );
}
