"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSignals } from "@/lib/api";
import { formatTimeIST } from "@/lib/format";
import { T } from "@/lib/echarts";
import { useDashboardStore } from "@/store";
import { DataTable } from "@/components/ui/DataTable";

const STEP_COLOR: Record<string, string> = {
  SIGNAL_ACCEPTED: T.pos,
  SIGNAL_REJECTED: T.neg,
  SIGNAL_GENERATED: T.neutral,
};

function contextSummary(ctx: string): string {
  try {
    const obj = JSON.parse(ctx) as Record<string, unknown>;
    if (obj.reason) return String(obj.reason);
    if (obj.qty) return `qty=${obj.qty}`;
    return Object.entries(obj)
      .slice(0, 2)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ");
  } catch {
    return ctx.slice(0, 40);
  }
}

export function SignalsTable() {
  const sessionId = useDashboardStore((s) => s.sessionId);
  const algoName = useDashboardStore((s) => s.algoName);
  const { data: signals = [] } = useQuery({
    queryKey: ["signals", sessionId, algoName],
    queryFn: () => fetchSignals(sessionId, algoName),
    refetchInterval: 10_000,
  });

  return (
    <DataTable
      columns={[
        { label: "Time (IST)" },
        { label: "Symbol" },
        { label: "Algo" },
        { label: "Step" },
        { label: "Context" },
      ]}
      isEmpty={signals.length === 0}
      emptyMessage="No signals today"
      scrollX
    >
      {signals.map((s, i) => (
        <tr key={i} style={{ borderTop: `1px solid ${T.border}` }}>
          <td style={{ padding: "6px 8px", color: T.muted }}>
            {formatTimeIST(s.created_at, true)} IST
          </td>
          <td style={{ padding: "6px 8px", color: T.text, fontWeight: 600 }}>{s.symbol}</td>
          <td style={{ padding: "6px 8px", color: T.muted }}>{s.algo_name}</td>
          <td style={{ padding: "6px 8px" }}>
            <span style={{ color: STEP_COLOR[s.step] ?? T.text }}>{s.step}</span>
          </td>
          <td style={{ padding: "6px 8px", color: T.muted }}>{contextSummary(s.context)}</td>
        </tr>
      ))}
    </DataTable>
  );
}
