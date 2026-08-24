"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlgos } from "@/lib/api";
import { WarmupBar } from "@/components/charts/WarmupBar";
import { T } from "@/lib/echarts";
import { formatTimeIST } from "@/lib/format";
import { useDashboardStore } from "@/store";
import { deriveAlgoDisplayState } from "@/lib/algoState";

export function AlgoStatusPanel() {
  const setAlgoName = useDashboardStore((s) => s.setAlgoName);
  const { data: algos = [] } = useQuery({
    queryKey: ["algos"],
    queryFn: fetchAlgos,
    refetchInterval: 5_000,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {algos.length === 0 && <span style={{ color: T.muted, fontSize: 12 }}>No algos configured</span>}
      {algos.map((algo) => {
        const { barsSeen, warmupComplete, lastSignalAt, stateEntries } = deriveAlgoDisplayState(
          algo.state,
        );

        return (
          <div
            key={algo.name}
            onClick={() => setAlgoName(algo.name)}
            style={{
              backgroundColor: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: 16,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{algo.name}</span>
                <span style={{ color: T.muted, fontSize: 11, marginLeft: 8 }}>{algo.strategy_id}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {!algo.enabled && (
                  <span style={{ color: T.neg, fontSize: 11, fontFamily: "ui-monospace, monospace" }}>
                    DISABLED
                  </span>
                )}
                {warmupComplete ? (
                  <span style={{ color: T.pos, fontSize: 11 }}>✓ warmed up</span>
                ) : (
                  <span style={{ color: T.neutral, fontSize: 11 }}>
                    {Math.max(0, algo.warmup_candles - barsSeen)} bars until live
                  </span>
                )}
              </div>
            </div>

            <WarmupBar barsSeen={barsSeen} warmupTarget={algo.warmup_candles} />

            <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: T.muted }}>
              <span>
                Bars seen: <span style={{ color: T.text }}>{barsSeen}</span> / {algo.warmup_candles}
              </span>
              {lastSignalAt && (
                <span>
                  Last signal: <span style={{ color: T.text }}>{formatTimeIST(lastSignalAt, true)} IST</span>
                </span>
              )}
            </div>

            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              <div>
                <div style={{ color: T.muted, fontSize: 10, marginBottom: 4 }}>PARAMS</div>
                {Object.entries(algo.params).map(([k, v]) => (
                  <div key={k} style={{ fontSize: 11 }}>
                    <span style={{ color: T.muted }}>{k}: </span>
                    <span style={{ color: T.text }}>{String(v)}</span>
                  </div>
                ))}
              </div>
              {stateEntries.length > 0 && (
                <div>
                  <div style={{ color: T.muted, fontSize: 10, marginBottom: 4 }}>STATE</div>
                  {stateEntries.map(([k, v]) => (
                    <div key={k} style={{ fontSize: 11 }}>
                      <span style={{ color: T.muted }}>{k}: </span>
                      <span style={{ color: T.text }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
