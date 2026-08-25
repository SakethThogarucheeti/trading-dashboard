"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/api";
import { formatTimeIST } from "@/lib/format";
import { T } from "@/lib/echarts";
import { DataTable } from "@/components/ui/DataTable";

export function HealthPanel() {
  const { data: heartbeats = [] } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 5_000,
  });

  return (
    <DataTable
      columns={[{ label: "Module" }, { label: "Last Seen (IST)" }, { label: "Status" }]}
      isEmpty={heartbeats.length === 0}
      emptyMessage="No data"
    >
      {heartbeats.map((hb) => (
        <tr key={hb.module} style={{ borderTop: `1px solid ${T.border}` }}>
          <td style={{ padding: "6px 8px", color: T.text }}>{hb.module}</td>
          <td style={{ padding: "6px 8px", color: T.muted }}>{formatTimeIST(hb.last_seen, true)} IST</td>
          <td style={{ padding: "6px 8px" }}>
            <span style={{ color: hb.stale ? T.neg : T.pos, fontWeight: 600 }}>
              {hb.stale ? "STALE" : "OK"}
            </span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
