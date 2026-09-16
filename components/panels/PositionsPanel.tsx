"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPositions } from "@/lib/api";
import { formatTimeIST, formatRupee } from "@/lib/format";
import { T } from "@/lib/echarts";
import { useDashboardStore } from "@/store";
import { DataTable } from "@/components/ui/DataTable";

export function PositionsPanel() {
  const sessionId = useDashboardStore((s) => s.sessionId);
  const { data: positions = [] } = useQuery({
    queryKey: ["positions", sessionId],
    queryFn: () => fetchPositions(sessionId),
    refetchInterval: 5_000,
  });

  return (
    <DataTable
      columns={[
        { label: "Symbol" },
        { label: "Type" },
        { label: "Algo" },
        { label: "Qty", align: "right" },
        { label: "Avg Price", align: "right" },
        { label: "Updated (IST)" },
      ]}
      isEmpty={positions.length === 0}
      emptyMessage="No data"
    >
      {positions.map((p) => (
        <tr
          key={`${p.symbol}-${p.instrument_type}-${p.algo_name}`}
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <td style={{ padding: "6px 8px", color: T.text, fontWeight: 600 }}>{p.symbol}</td>
          <td style={{ padding: "6px 8px", color: T.muted }}>{p.instrument_type}</td>
          <td style={{ padding: "6px 8px", color: T.muted }}>{p.algo_name}</td>
          <td
            style={{
              padding: "6px 8px",
              textAlign: "right",
              color: p.net_qty >= 0 ? T.pos : T.neg,
              fontWeight: 600,
            }}
          >
            {p.net_qty >= 0 ? "+" : ""}
            {p.net_qty}
          </td>
          <td style={{ padding: "6px 8px", textAlign: "right", color: T.text }}>
            {formatRupee(p.avg_price)}
          </td>
          <td style={{ padding: "6px 8px", color: T.muted }}>
            {p.updated_at ? formatTimeIST(p.updated_at, true) + " IST" : "—"}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
