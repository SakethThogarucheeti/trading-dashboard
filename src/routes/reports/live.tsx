import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveReport } from "@/lib/api";
import type { LiveReport } from "@/lib/api";
import { T } from "@/lib/echarts";
import { DataTable } from "@/components/ui/DataTable";
import { LabelValueRow } from "@/components/ui/LabelValueRow";
import { TitledCard } from "@/components/ui/TitledCard";
import { z } from "zod";

export const searchSchema = z.object({
  period: z.enum(["day", "week", "month"]).catch("day"),
  date: z.string().optional(),
});

export const Route = createFileRoute("/reports/live")({
  validateSearch: searchSchema,
  component: LiveReportPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <TitledCard title={title} style={{ marginBottom: 16 }}>
      {children}
    </TitledCard>
  );
}

function pctStr(v: number | null, decimals = 2): string {
  if (v === null) return "—";
  const sign = v >= 0 ? "+" : "";
  return `${sign}${(v * 100).toFixed(decimals)}%`;
}

function rupeeStr(v: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);
}

export function LiveReportPage() {
  const { period, date } = Route.useSearch();

  const { data: report, error } = useQuery<LiveReport>({
    queryKey: ["live-report", period, date],
    queryFn: () => fetchLiveReport(period, date),
  });

  const periodLinks = (["day", "week", "month"] as const).map((p) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    active: p === period,
    search: { period: p, ...(date ? { date } : {}) },
  }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/reports" style={{ color: T.muted, fontSize: 12, textDecoration: "none" }}>
            ← Reports
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Live Report</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {periodLinks.map(({ label, active, search }) => (
            <Link
              key={label}
              to="/reports/live"
              search={search}
              style={{
                padding: "6px 14px",
                backgroundColor: active ? T.accent : T.surface,
                border: `1px solid ${active ? T.accent : T.border}`,
                borderRadius: 6,
                color: active ? "#fff" : T.text,
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 24,
            backgroundColor: T.surface,
            border: `1px solid ${T.neg}`,
            borderRadius: 8,
            color: T.neg,
            fontSize: 13,
          }}
        >
          Failed to load report: {String(error)}
        </div>
      )}

      {report && (
        <>
          <div
            style={{
              padding: "8px 16px",
              backgroundColor: T.grid,
              borderRadius: 6,
              color: T.muted,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {report.start ? `${report.start.slice(0, 10)} → ${report.end?.slice(0, 10)}` : ""}
          </div>

          <Section title="Signal Funnel">
            <LabelValueRow label="Candles Emitted" value={report.signal_funnel.candles_emitted} />
            <LabelValueRow label="Signals Generated" value={report.signal_funnel.signals_generated} />
            <LabelValueRow label="Signals Accepted" value={report.signal_funnel.signals_accepted} />
            <LabelValueRow label="Signals Rejected" value={report.signal_funnel.signals_rejected} />
            <LabelValueRow label="Acceptance Rate" value={`${(report.signal_funnel.acceptance_rate * 100).toFixed(1)}%`} />
            {Object.entries(report.signal_funnel.rejection_reasons).map(([reason, count]) => (
              <LabelValueRow key={reason} label={`  ${reason}`} value={count} />
            ))}
          </Section>

          <Section title="Order Funnel">
            <LabelValueRow label="Placed" value={report.order_funnel.placed} />
            <LabelValueRow label="Filled" value={report.order_funnel.filled} />
            <LabelValueRow label="Rejected" value={report.order_funnel.rejected} />
            <LabelValueRow label="Cancelled" value={report.order_funnel.cancelled} />
            <LabelValueRow label="Fill Rate" value={`${(report.order_funnel.fill_rate * 100).toFixed(1)}%`} />
          </Section>

          <Section title="P&L Summary">
            <LabelValueRow label="Gross P&L" value={rupeeStr(report.pnl_summary.gross)} />
            <LabelValueRow label="Trading Costs" value={`-${rupeeStr(report.pnl_summary.costs)}`} />
            <LabelValueRow label="Net P&L" value={rupeeStr(report.pnl_summary.net)} />
            {report.pnl_summary.algo_pct != null && (
              <LabelValueRow label="Algo Return" value={pctStr(report.pnl_summary.algo_pct / 100)} />
            )}
          </Section>

          {report.benchmark && (
            <Section title="Benchmark: Nifty 50">
              <LabelValueRow label="Nifty Open" value={report.benchmark.nifty_open?.toLocaleString("en-IN") ?? "—"} />
              <LabelValueRow label="Nifty Close" value={report.benchmark.nifty_close?.toLocaleString("en-IN") ?? "—"} />
              <LabelValueRow
                label="Nifty Return"
                value={
                  report.benchmark.pct_return !== null
                    ? `${report.benchmark.pct_return >= 0 ? "+" : ""}${report.benchmark.pct_return.toFixed(2)}%`
                    : "—"
                }
              />
              {report.benchmark.algo_pct !== null && (
                <LabelValueRow
                  label="Algo Return"
                  value={`${report.benchmark.algo_pct >= 0 ? "+" : ""}${report.benchmark.algo_pct.toFixed(2)}%`}
                />
              )}
              {report.benchmark.alpha !== null && (
                <LabelValueRow
                  label="Alpha"
                  value={`${report.benchmark.alpha >= 0 ? "+" : ""}${report.benchmark.alpha.toFixed(2)}%`}
                />
              )}
            </Section>
          )}

          {report.trades_by_symbol.length > 0 && (
            <Section title="Trades by Symbol">
              <DataTable
                columns={["Symbol", "Buys", "Sells", "Volume", "Cash Flow"].map((label) => ({ label }))}
                isEmpty={report.trades_by_symbol.length === 0}
                emptyMessage="No trades"
              >
                {report.trades_by_symbol.map((row) => (
                  <tr key={row.symbol} style={{ borderTop: `1px solid ${T.border}`, color: T.text }}>
                    <td style={{ padding: "4px 8px" }}>{row.symbol}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right" }}>{row.buys}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right" }}>{row.sells}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right" }}>{row.volume}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: row.cash_flow >= 0 ? T.pos : T.neg }}>
                      {row.cash_flow >= 0 ? "+" : ""}
                      {rupeeStr(row.cash_flow)}
                    </td>
                  </tr>
                ))}
              </DataTable>
            </Section>
          )}
        </>
      )}
    </div>
  );
}
