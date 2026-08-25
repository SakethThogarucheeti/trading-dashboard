"use client";

import type { WalkForwardReport } from "@/lib/api";
import { T } from "@/lib/echarts";
import { formatPct } from "@/lib/format";
import { EquityCurveChart } from "@/components/charts/EquityCurveChart";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { HeaderStrip } from "@/components/ui/HeaderStrip";
import { SectionCard } from "@/components/ui/SectionCard";

export function WalkForwardView({ report }: { report: WalkForwardReport }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <HeaderStrip
        items={[
          { label: "Windows", value: report.windows.length, emphasis: "bold" },
          { label: "Session", value: report.session_id, emphasis: "mono" },
        ]}
      />

      {/* Aggregate metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard label="Aggregate Sharpe" value={report.aggregate_sharpe.toFixed(3)} />
        <StatCard
          label="Aggregate Max DD"
          value={formatPct(report.aggregate_max_drawdown)}
          color={T.neg}
        />
        <StatCard
          label="Aggregate Win Rate"
          value={formatPct(report.aggregate_win_rate)}
          color={T.pos}
        />
      </div>

      {/* Combined equity curve */}
      <EquityCurveChart equityCurve={report.combined_equity_curve} height={300} />

      {/* Per-window table */}
      <SectionCard title="Windows" overflowX>
        <DataTable
          columns={["#", "Period", "Sharpe", "Max DD", "Win Rate", "Total Trades", "Final Equity"].map((label) => ({
            label,
          }))}
          isEmpty={report.windows.length === 0}
          emptyMessage="No windows"
        >
          {report.windows.map((w, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${T.border}`, color: T.text }}>
              <td style={{ padding: "4px 8px", color: T.muted }}>W{i + 1}</td>
              <td style={{ padding: "4px 8px" }}>
                {w.start.slice(0, 10)} → {w.end.slice(0, 10)}
              </td>
              <td
                style={{
                  padding: "4px 8px",
                  color: w.sharpe_ratio >= 0 ? T.pos : T.neg,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {w.sharpe_ratio.toFixed(3)}
              </td>
              <td style={{ padding: "4px 8px", color: T.neg }}>{formatPct(w.max_drawdown)}</td>
              <td style={{ padding: "4px 8px" }}>{formatPct(w.win_rate)}</td>
              <td style={{ padding: "4px 8px", textAlign: "right" }}>{w.total_trades}</td>
              <td style={{ padding: "4px 8px", textAlign: "right" }}>
                {w.final_equity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>
    </div>
  );
}
