# trading-dashboard

React (TanStack) live monitoring UI — TanStack Start + TanStack Router, not Next.js (no `next`
dependency exists in this repo; a previous version of this file falsely claimed otherwise and
has been corrected).

- Routes are file-based under `src/routes/` (`createFileRoute`); `src/routes/__root.tsx` renders
  the full document shell.
- Data fetching: `@tanstack/react-query`. Client state: `zustand` (`store.ts`).
- No backend of its own — it proxies `trading-platform`'s API (see the workspace-root
  `CLAUDE.md` for the full architecture).
- Tests: `vitest` + `@testing-library/react`, mocked network via `msw`. Route-page components
  that use `Route.useSearch()`/`Link` need `vi.mock("@tanstack/react-router", ...)` to stub
  those (see `__tests__/routes/reports/live.test.tsx`) — rendering the real router tree fails
  under jsdom because `__root.tsx` emits a full `<html>/<head>/<body>` SSR shell.
