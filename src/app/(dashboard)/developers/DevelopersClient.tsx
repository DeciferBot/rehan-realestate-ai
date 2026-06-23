"use client";
import { useState } from "react";
import Header from "@/components/Header";
import type { Developer, Property } from "@/lib/data";
import {
  FolderOpen, RefreshCw, Plus, CheckCircle2, AlertCircle,
  Upload, Building2, TrendingUp, MapPin, Bed, Square,
} from "lucide-react";

const devBadgeClass: Record<string, string> = {
  "Emaar Properties": "badge-info",
  "Nakheel":          "badge-success",
  "DAMAC Properties": "badge-purple",
  "Sobha Realty":     "badge-accent",
  "Meraas":           "badge-warning",
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
      <div style={{ padding: "24px 28px" }}>

        {/* OneDrive banner */}
        <div className="panel" style={{
          marginBottom: 20,
          padding: "14px 18px",
          background: "var(--info-dim)",
          border: "1px solid oklch(0.42 0.130 245 / 0.28)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: "var(--info-dim)", border: "1px solid oklch(0.42 0.130 245 / 0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FolderOpen size={16} style={{ color: "var(--info)" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>OneDrive Integration Active</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                4 of 5 developers synced · Last sync: 10 minutes ago
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm">
              <RefreshCw size={13} />Sync all
            </button>
            <button className="btn btn-primary btn-sm">
              <Plus size={13} />Add developer
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>

          {/* Developer list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.03em" }}>
              DEVELOPERS
            </div>
            {developers.map(dev => {
              const isActive = activeDev === dev.id;
              const badgeCls = devBadgeClass[dev.name] || "badge-muted";
              return (
                <button
                  key={dev.id}
                  onClick={() => setActiveDev(dev.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "12px 14px", borderRadius: 10,
                    background: isActive ? "var(--primary-dim)" : "var(--surface)",
                    border: `1px solid ${isActive ? "var(--primary-border)" : "var(--border)"}`,
                    cursor: "pointer", transition: "border-color 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span className={`badge ${badgeCls}`} style={{ fontSize: 9, padding: "2px 5px" }}>
                      {dev.logo}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {dev.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                    {dev.onedrive ? (
                      <><CheckCircle2 size={10} style={{ color: "var(--success)" }} /><span style={{ fontSize: 10, color: "var(--success)" }}>Synced</span></>
                    ) : (
                      <><AlertCircle size={10} style={{ color: "var(--warning)" }} /><span style={{ fontSize: 10, color: "var(--warning)" }}>Manual</span></>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{dev.activeListings} active</span>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>{dev.totalValue}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedDev && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Header */}
              <div className="panel-lg" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>
                      {selectedDev.logo}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{selectedDev.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                        {selectedDev.properties} properties · {selectedDev.totalValue}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm"><Upload size={13} />Upload brochure</button>
                    <button className="btn btn-ghost btn-sm"><RefreshCw size={13} />Sync now</button>
                    <button className="btn btn-primary btn-sm"><Plus size={13} />Add property</button>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Total listings",  value: String(selectedDev.properties),    cls: "var(--ink)"    },
                    { label: "Active listings", value: String(selectedDev.activeListings), cls: "var(--success)" },
                    { label: "Portfolio value", value: selectedDev.totalValue,             cls: "var(--accent)"  },
                    { label: "Last synced",     value: selectedDev.lastSync,               cls: "var(--muted)"   },
                  ].map(({ label, value, cls }) => (
                    <div key={label} style={{
                      padding: "12px 14px", borderRadius: 8, textAlign: "center",
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                    }}>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: cls, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 5 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* OneDrive folder tree */}
                <div style={{ padding: "14px 16px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <FolderOpen size={13} style={{ color: "var(--info)" }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>
                      OneDrive / Rehan RE / {selectedDev.name}
                    </span>
                  </div>
                  {folders.map((folder, i) => (
                    <div key={folder} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "7px 8px 7px 20px",
                      borderLeft: "1px solid var(--border)",
                      fontSize: 12, color: "var(--muted)", cursor: "pointer",
                    }}>
                      <FolderOpen size={11} style={{ color: "var(--accent)", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{folder}</span>
                      <span className="mono" style={{ fontSize: 10, color: "var(--dim)" }}>{folderCounts[i]} files</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Properties grid */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Building2 size={14} style={{ color: "var(--dim)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                    Properties
                  </span>
                  <span className="badge badge-muted">{devProperties.length} listed</span>
                </div>

                {devProperties.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
                    {devProperties.map((p) => (
                      <div key={p.id} className="panel" style={{ padding: "14px 16px", display: "flex", gap: 14 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                          background: "var(--surface-2)", border: "1px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--dim)",
                        }}>
                          <Building2 size={20} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>{p.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                            <MapPin size={10} />{p.location}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--muted)" }}>
                              <Bed size={10} />{p.bedrooms} BR
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--muted)" }}>
                              <Square size={10} />{p.sqft.toLocaleString()} sqft
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
                              AED {(p.price / 1_000_000).toFixed(1)}M
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--success)" }}>
                              <TrendingUp size={10} />{p.roi}% ROI
                            </span>
                            <span style={{ fontSize: 11, color: "var(--dim)" }}>{p.completion}</span>
                          </div>
                          <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                            {p.tags.map(t => (
                              <span key={t} className={`badge ${t === "sale" ? "badge-success" : "badge-info"}`}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="panel" style={{ padding: 32, textAlign: "center" }}>
                    <FolderOpen size={28} style={{ color: "var(--dim)", margin: "0 auto 10px" }} />
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>
                      No properties listed for this developer. Upload from OneDrive or add manually.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
