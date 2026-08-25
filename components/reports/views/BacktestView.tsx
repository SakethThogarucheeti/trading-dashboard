"use client";

import type { BacktestReport } from "@/lib/api";
import { T } from "@/lib/echarts";
import { formatPct, formatRupee } from "@/lib/format";
import { EquityCurveChart } from "@/components/charts/EquityCurveChart";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { TradePnlBar } from "@/components/charts/TradePnlBar";
import { DataTable } from "@/components/ui/DataTable";
import { HeaderStrip } from "@/components/ui/HeaderStrip";
import { SectionCard } from "@/components/ui/SectionCard";

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: `1px solid ${T.border}`,
        fontSize: 13,
      }}
    >
      <span style={{ color: T.muted }}>{label}</span>
      <span style={{ color: T.text, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

export function BacktestView({ report }: { report: BacktestReport }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header strip */}
      <HeaderStrip
        items={[
          { label: "Algo", value: report.algo_name, emphasis: "bold" },
          { label: "Period", value: `${report.start.slice(0, 10)} → ${report.end.slice(0, 10)}` },
          { label: "Session", value: report.session_id, emphasis: "mono" },
        ]}
      />

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <EquityCurveChart equityCurve={report.equity_curve} height={280} />
        </div>
        <div>
          <DrawdownChart equityCurve={report.equity_curve} height={280} />
        </div>
      </div>

      {/* Trade P&L bar */}
      {report.trades.length > 0 && (
        <TradePnlBar trades={report.trades} height={220} />
      )}

      {/* Metrics + trade table row */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        {/* Metrics card */}
        <SectionCard title="Metrics">
          <MetricRow label="Sharpe Ratio" value={report.sharpe_ratio.toFixed(3)} />
          <MetricRow label="Max Drawdown" value={formatPct(report.max_drawdown)} />
          <MetricRow label="Win Rate" value={formatPct(report.win_rate)} />
          <MetricRow label="Profit Factor" value={report.profit_factor.toFixed(3)} />
          <MetricRow label="CAGR" value={formatPct(report.cagr)} />
          <MetricRow label="Calmar Ratio" value={report.calmar_ratio.toFixed(3)} />
          <MetricRow label="Total Trades" value={String(report.total_trades)} />
          <MetricRow label="Initial Equity" value={formatRupee(report.initial_equity)} />
          <MetricRow label="Final Equity" value={formatRupee(report.final_equity)} />
        </SectionCard>

        {/* Trade table */}
        <SectionCard title="Trades" overflowX>
          <DataTable
            columns={["Symbol", "Side", "Qty", "Entry", "Exit", "P&L"].map((label) => ({ label }))}
            isEmpty={report.trades.length === 0}
            emptyMessage="No trades"
          >
            {report.trades.map((t, i) => (
              <tr
                key={i}
                style={{
                  borderTop: `1px solid ${T.border}`,
                  color: T.text,
                }}
              >
                <td style={{ padding: "4px 8px" }}>{t.symbol}</td>
                <td style={{ padding: "4px 8px" }}>{t.side}</td>
                <td style={{ padding: "4px 8px", textAlign: "right" }}>{t.qty}</td>
                <td style={{ padding: "4px 8px", textAlign: "right" }}>{t.entry_price.toFixed(2)}</td>
                <td style={{ padding: "4px 8px", textAlign: "right" }}>{t.exit_price.toFixed(2)}</td>
                <td
                  style={{
                    padding: "4px 8px",
                    textAlign: "right",
                    color: t.pnl >= 0 ? T.pos : T.neg,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.pnl >= 0 ? "+" : ""}
                  {t.pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </DataTable>
        </SectionCard>
      </div>
    </div>
  );
}
