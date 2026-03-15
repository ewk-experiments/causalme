# CausalMe

> See the ripple effects of every life choice.

A personal causal inference engine that builds a living causal graph of your life. Understand how sleep, exercise, mood, productivity, spending, social connections, and energy really connect — then simulate "what if" scenarios to optimize your days.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Interactive Causal Graph** — Beautiful canvas-based visualization with animated edges, particle effects, and node interactions
- **What-If Simulator** — Change any variable and watch ripple effects cascade through your life graph in real-time with confidence intervals
- **AI Insights** — Discover causal patterns like "Morning exercise has 2.3x more impact on mood than evening exercise"
- **Timeline** — Historical view with Recharts, overlaid with life events and detected causal relationships
- **Onboarding Wizard** — Connect health wearables, bank (Plaid), calendar, and mood trackers with privacy guarantees
- **Settings** — Connected apps management, privacy controls, data export, account deletion

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** + custom design tokens
- **Framer Motion** for animations
- **Canvas API** for the causal graph (custom, no heavy graph library)
- **Recharts** for timeline charts
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with interactive demo graph |
| `/auth` | Google OAuth sign-in |
| `/onboarding` | Data source connection wizard |
| `/dashboard` | Main causal graph visualization |
| `/whatif` | What-If simulator with sliders |
| `/insights` | AI-generated causal insights feed |
| `/timeline` | Historical variable charts + life events |
| `/settings` | Connected apps, privacy, data management |
| `/pricing` | Free vs Pro plan comparison |

## License

MIT
