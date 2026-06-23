"use client";
import { useState } from "react";
import Header from "@/components/Header";
import type { Lead } from "@/lib/data";
import {
  Phone, Filter, Search, Download, Plus,
  TrendingUp, Home, MessageSquare, CalendarPlus, UserCheck,
} from "lucide-react";

const statusConfig: Record<string, { label: string; cls: string }> = {
  new:       { label: "New",       cls: "badge-accent"  },
  calling:   { label: "Calling",   cls: "badge-primary" },
  called:    { label: "Called",    cls: "badge-info"    },
  qualified: { label: "Qualified", cls: "badge-purple"  },
  appointed: { label: "Appointed", cls: "badge-warning" },
  closed:    { label: "Closed",    cls: "badge-success" },
};

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");

  const filtered = leads.filter(l =>
    (filter === "all" || l.status === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
  );
  const selectedLead = leads.find(l => l.id === selected);

  return (
    <div>
      <Header title="Lead Management" subtitle="Incoming leads from Meta & Instagram advertising" />
      <div style={{ padding: "24px 28px" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["all", "new", "calling", "called", "qualified", "appointed", "closed"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`filter-pill${filter === f ? " active" : ""}`}>
                {f === "all" ? "All leads" : statusConfig[f]?.label || f}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={12} style={{ position: "absolute", left: 10, color: "var(--dim)", pointerEvents: "none" }} />
              <input
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..."
                style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, width: 180 }}
              />
            </div>
            <button className="btn btn-outline-primary btn-sm"><Plus size={13} />New lead</button>
            <button className="btn btn-ghost btn-sm"><Download size={13} /></button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>

          {/* Table */}
          <div className="panel-lg" style={{ flex: 1, overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {["Lead", "Contact", "Language", "Status", "Interest", "Type", "Agent", "Budget"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const sc = statusConfig[lead.status] || statusConfig.new;
                  const isActive = selected === lead.id;
                  return (
                    <tr key={lead.id} onClick={() => setSelected(isActive ? null : lead.id)} className={isActive ? "selected" : ""}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13, color: "var(--ink)" }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>{lead.time}</div>
                      </td>
                      <td style={{ color: "var(--muted)" }}>{lead.phone}</td>
                      <td style={{ color: "var(--muted)" }}>{lead.language}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {lead.status === "calling" && <span className="live-dot live-dot-red" />}
                          <span className={`badge ${sc.cls}`}>{sc.label}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--muted)", maxWidth: 140 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lead.propertyInterest}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${lead.investType === "investment" ? "badge-purple" : "badge-info"}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {lead.investType === "investment"
                            ? <><TrendingUp size={10} />Invest</>
                            : <><Home size={10} />Live-in</>}
                        </span>
                      </td>
                      <td style={{ color: "var(--muted)" }}>{lead.assignedAgent}</td>
                      <td>
                        <span className="mono" style={{ fontWeight: 600, color: "var(--accent)" }}>{lead.budget}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedLead && (
            <div className="panel-lg slide-in-right" style={{ width: 272, flexShrink: 0, padding: 18 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>{selectedLead.name}</div>
                <div style={{ fontSize: 11, color: "var(--dim)" }}>{selectedLead.id} · {selectedLead.source}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Phone",    value: selectedLead.phone },
                  { label: "Language", value: selectedLead.language },
                  { label: "Budget",   value: selectedLead.budget, accent: true },
                  { label: "Interest", value: selectedLead.propertyInterest },
                  { label: "Type",     value: selectedLead.investType === "investment" ? "Investment" : "Live-in" },
                  { label: "Agent",    value: selectedLead.assignedAgent },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--dim)" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: accent ? "var(--accent)" : "var(--ink)", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn btn-primary btn-sm" style={{ justifyContent: "center" }}>
                  <Phone size={13} />Initiate AI call
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>
                  <MessageSquare size={13} />Send WhatsApp
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>
                  <CalendarPlus size={13} />Book appointment
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>
                  <UserCheck size={13} />Escalate to human
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Showing {filtered.length} of {leads.length} leads</span>
          <span style={{ fontSize: 12, color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={11} />Click any row to view details
          </span>
        </div>
      </div>
    </div>
  );
}
