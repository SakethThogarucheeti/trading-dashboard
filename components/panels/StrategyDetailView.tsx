"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlgos, fetchPnl } from "@/lib/api";
import { WarmupBar } from "@/components/charts/WarmupBar";
import { SignalsTable } from "@/components/panels/SignalsTable";
import { DecisionFeed } from "@/components/panels/DecisionFeed";
import { PnlSummaryStrip } from "@/components/panels/PnlSummaryStrip";
import { LineChart } from "@/components/charts/LineChart";
import { T } from "@/lib/echarts";
import { formatTimeIST, formatRupee } from "@/lib/format";
import { useDashboardStore } from "@/store";
import { fetchCharts } from "@/lib/api";

const HIDDEN_STATE_KEYS = new Set(["bars_seen", "warmup_complete", "last_signal_at"]);
const EMPTY_SUMMARY = { gross: 0, costs: 0, net: 0, nifty_pct: null, nifty_open: null, nifty_close: null };

export function StrategyDetailView() {
  const { algoName, setAlgoName, sessionId } = useDashboardStore();

  const { data: algos = [] } = useQuery({
    queryKey: ["algos"],
    queryFn: fetchAlgos,
    refetchInterval: 5_000,
  });

  const { data: pnlData } = useQuery({
    queryKey: ["pnl", sessionId, algoName],
    queryFn: () => fetchPnl(sessionId, algoName),
    refetchInterval: 30_000,
  });

  const { data: charts = {} } = useQuery({
    queryKey: ["charts", sessionId, algoName],
    queryFn: () => fetchCharts(sessionId, algoName),
    refetchInterval: 30_000,
  });

  const algo = algos.find((a) => a.name === algoName);
  const barsSeen = Number(algo?.state?.bars_seen ?? 0);
  const warmupComplete = Boolean(algo?.state?.warmup_complete);
  const lastSignalAt = algo?.state?.last_signal_at as string | undefined;
  const stateEntries = Object.entries(algo?.state ?? {}).filter(([k]) => !HIDDEN_STATE_KEYS.has(k));

  const pnlPoints = pnlData?.points ?? [];
  const pnlSummary = pnlData?.summary ?? EMPTY_SUMMARY;
  const pnlSeries = [
    { name: "Gross P&L", data: pnlPoints.map((p) => ({ ts: p.ts, value: p.cumulative_gross })), dashed: true },
    { name: "Net P&L", data: pnlPoints.map((p) => ({ ts: p.ts, value: p.cumulative_net })), showSymbol: true },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setAlgoName("")}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 4,
            color: T.muted,
            fontSize: 12,
            cursor: "pointer",
            padding: "4px 10px",
          }}
        >
          ← All strategies
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{algoName}</span>
        {algo && <span style={{ color: T.muted, fontSize: 12 }}>{algo.strategy_id}</span>}
      </div>

      {/* Algo state card */}
      {algo && (
        <div
          style={{
            backgroundColor: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: T.muted }}>
              Bars: <span style={{ color: T.text }}>{barsSeen}</span> / {algo.warmup_candles}
            </div>
            <div>
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
          {lastSignalAt && (
            <div style={{ marginTop: 8, fontSize: 11, color: T.muted }}>
              Last signal: <span style={{ color: T.text }}>{formatTimeIST(lastSignalAt, true)} IST</span>
            </div>
          )}
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
      )}

      {/* P&L */}
      <div
        style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16, marginBottom: 24 }}
      >
        <div style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>P&L — {algoName}</div>
        <PnlSummaryStrip summary={pnlSummary} />
        {pnlPoints.length > 0 && (
          <LineChart series={pnlSeries} height={200} yFormatter={formatRupee} />
        )}
      </div>

      {/* Signals + Decision Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Recent Signals</div>
          <SignalsTable />
        </div>
        <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Decision Feed</div>
          <DecisionFeed />
        </div>
      </div>

      {/* Indicator charts */}
      {Object.entries(charts).map(([chartName, seriesMap]) => {
        const series = Object.entries(seriesMap).map(([name, pts]) => ({ name, data: pts }));
        return (
          <div key={chartName} style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{chartName}</div>
            <LineChart series={series} height={200} />
          </div>
        );
      })}
    </div>
  );
}
