# Product

## Register

product

## Users

Elite real estate brokers and sales managers at a Dubai/UAE brokerage. They monitor 3–10 simultaneous AI-driven outbound calls, triage incoming leads from Meta ads, review sub-agent outputs (school maps, mortgage breakdowns, property matches), and hand off qualified leads to human agents. Context: open on a secondary monitor while handling calls; high ambient pressure; decision tempo measured in minutes, not hours.

## Product Purpose

An AI-powered sales command center that runs outbound voice calls (Vapi.ai), qualifies leads in real time via parallel sub-agents, sends WhatsApp brochures mid-call, books appointments, and hands a full dossier to a human agent for closure. Success: a broker manages 10x more leads than manually possible with higher qualification accuracy.

## Brand Personality

Surgical, alive, trustworthy. The interface should feel like a Bloomberg terminal that hired a good designer — high information density without noise, restrained aesthetics that get out of the way of the data.

## Anti-references

- The current interface: gold/navy luxury fintech cliché
- Purple SaaS gradient dashboards (every startup dashboard from 2023-24)
- Cream/warm editorial brand surfaces
- Glassmorphism cards with glowing borders
- "Luxury" real estate sites with serif fonts and marble textures

## Design Principles

1. **Data first, chrome last.** Every decorative element must earn its place by making the data clearer or the task faster. If removing it doesn't hurt the interface, remove it.
2. **States over decoration.** Color communicates state (live, qualified, closed, warning) — not brand identity. The crimson primary exists because calls are live and urgent, not because it's "the brand color."
3. **Density without clutter.** Pack information tightly; let structure (borders, spacing rhythm) create the breathing room, not empty space.
4. **The machine should disappear.** When the AI system is running smoothly, the broker shouldn't be thinking about the interface — only about the leads.
5. **Earned moments.** Motion and emphasis are used at genuine state transitions: call going live, lead qualifying, appointment confirmed. Nothing animates just to animate.

## Absolute Color Rules

**Grey is banned.** No achromatic neutrals anywhere in the system — not in text, surfaces, borders, or icons.

- Every neutral must carry a minimum chroma of `0.003` directed toward hue `55` (the brand warm). Pure `oklch(L 0.000 0)` values are illegal except for `--bg` and `--surface` at full white (`L 1.000`).
- Typography: `--ink`, `--muted`, `--dim` all have chroma ≥ `0.008` at hue `55`. Inactive nav items use `--muted`, which must remain legible (L ≥ `0.78` in dark context, L ≤ `0.50` in light).
- Borders: minimum chroma `0.004` at hue `55`. Never `oklch(* 0.000 0)`.
- Hardcoded hex greys (`#666`, `#999`, `#ccc`, `rgba(0,0,0,0.x)`) are banned. Use tokens.
- When adding new tokens: run the "grey check" — if chroma < `0.003`, it's grey, add chroma before committing.

## Accessibility & Inclusion

WCAG AA minimum. Arabic content must render properly (RTL-aware where shown). Reduced motion respected throughout. All interactive elements keyboard-accessible.
