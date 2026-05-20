# trading-dashboard

Next.js live monitoring dashboard for the [trading-platform](https://github.com/SakethThogarucheeti/trading-platform).

Part of the [algo-trader](https://github.com/SakethThogarucheeti/algo-trader) system.

## What it shows

- Live P&L, positions, and open orders
- Real-time decision feed (buy/sell signals as they fire)
- Equity curve, drawdown, and trade distribution charts
- Strategy health and algo status
- Backtest, Monte Carlo, and walk-forward report views

## Stack

- Next.js 16 (App Router), React 19
- TailwindCSS 4
- ECharts (via echarts-for-react)
- Zustand (client state)
- TanStack Query (server state + polling)
- Vitest (unit tests), Playwright (E2E)

## Prerequisites

- Node.js 20+
- [trading-platform](https://github.com/SakethThogarucheeti/trading-platform) running on `:8081`

## Setup

**1. Install dependencies:**

```bash
npm ci
```

**2. Configure environment:**

```bash
cp .env.local.example .env.local
```

`.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## Running

```bash
# Development (hot reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build && npm start
```

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires the app to be running)
npm run test:e2e
```

## Project structure

```
trading-dashboard/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Live dashboard
│   └── reports/             # Report views (backtest, monte carlo, etc.)
├── components/
│   ├── charts/              # ECharts wrappers
│   ├── panels/              # Dashboard panels (P&L, positions, signals)
│   ├── reports/             # Report renderer and views
│   └── ui/                  # Shared UI primitives
├── hooks/                   # useDecisionStream and other hooks
├── lib/                     # API client, formatters, report registry
└── store.ts                 # Zustand global store
```
