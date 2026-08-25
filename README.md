# trading-dashboard

TanStack Start live monitoring dashboard for the [trading-platform](https://github.com/SakethThogarucheeti/trading-platform).

Part of the [algo-trader](https://github.com/SakethThogarucheeti/algo-trader) system.

## What it shows

- Live P&L, positions, and open orders
- Real-time decision feed (buy/sell signals as they fire)
- Equity curve, drawdown, and trade distribution charts
- Strategy health and algo status
- Backtest, Monte Carlo, and walk-forward report views

## Stack

- TanStack Start + TanStack Router (file-based routes under `src/routes/`), React 19
- TailwindCSS 4
- ECharts (via echarts-for-react)
- Zustand (client state)
- TanStack Query (server state + polling)
- Vitest + Testing Library (unit tests), Playwright (E2E, `playwright.config.ts`)

## Prerequisites

- Node.js 20+
- [trading-platform](https://github.com/SakethThogarucheeti/trading-platform) running on `:8081`

## Setup

**1. Install dependencies:**

```bash
npm ci
```

**2. Configure environment:**

The API proxy route (`src/routes/api.$.ts`) reads `VITE_API_URL`, defaulting to
`http://localhost:8081` if unset:

```dotenv
VITE_API_URL=http://localhost:8081
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
npx playwright test
```

## Project structure

```
trading-dashboard/
├── src/routes/              # TanStack Router file-based routes
│   ├── __root.tsx           # Document shell
│   ├── index.tsx            # Live dashboard
│   ├── login.tsx
│   ├── api.$.ts             # Server-side proxy to trading-platform's API
│   └── reports/             # Report views (backtest, monte carlo, etc.)
├── components/
│   ├── charts/           # ECharts wrappers
│   ├── panels/           # Dashboard panels (P&L, positions, signals)
│   ├── reports/          # Report renderer and views
│   └── ui/               # Shared UI primitives
├── hooks/                # useDecisionStream and other hooks
├── lib/                  # API client, formatters, report registry
└── store.ts              # Zustand global store
```
