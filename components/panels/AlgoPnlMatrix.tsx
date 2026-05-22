"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPnlByAlgo } from "@/lib/api";
import { T } from "@/lib/echarts";
import { formatRupee } from "@/lib/format";
import { useDashboardStore } from "@/store";

export function AlgoPnlMatrix() {
  const setAlgoName = useDashboardStore((s) => s.setAlgoName);
  const { data: byAlgo = {} } = useQuery({
    queryKey: ["pnl-by-algo"],
    queryFn: fetchPnlByAlgo,
    refetchInterval: 30_000,
  });

  const entries = Object.entries(byAlgo);
  if (entries.length === 0) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: T.muted, fontSize: 10, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
        P&L by Strategy
      </div>
      {entries.map(([name, pnl]) => (
        <div
          key={name}
          onClick={() => setAlgoName(name)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 0",
            borderTop: `1px solid ${T.border}`,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span style={{ color: T.text }}>{name}</span>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ color: T.muted }}>
              gross <span style={{ color: pnl.gross >= 0 ? T.pos : T.neg }}>{formatRupee(pnl.gross)}</span>
            </span>
            <span style={{ color: T.muted }}>
              net <span style={{ color: pnl.net >= 0 ? T.pos : T.neg, fontWeight: 700 }}>{formatRupee(pnl.net)}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
