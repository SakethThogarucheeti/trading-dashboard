"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlgos, fetchCharts, fetchPnl } from "@/lib/api";
import { deriveAlgoDisplayState } from "@/lib/algoState";

const EMPTY_SUMMARY = {
  gross: 0,
  costs: 0,
  net: 0,
  nifty_pct: null,
  nifty_open: null,
  nifty_close: null,
};

/**
 * Data-fetching + derived-state for StrategyDetailView: the 3 useQuery calls
 * (algos, pnl, charts) plus the display-shaping logic that previously lived
 * inline in the component (see trading-dashboard#1).
 */
export function useStrategyDetail(algoName: string, sessionId: string) {
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
  const { barsSeen, warmupComplete, lastSignalAt, stateEntries } = deriveAlgoDisplayState(algo?.state);

  const pnlPoints = pnlData?.points ?? [];
  const pnlSummary = pnlData?.summary ?? EMPTY_SUMMARY;
  const pnlSeries = [
    { name: "Gross P&L", data: pnlPoints.map((p) => ({ ts: p.ts, value: p.cumulative_gross })), dashed: true },
    { name: "Net P&L", data: pnlPoints.map((p) => ({ ts: p.ts, value: p.cumulative_net })), showSymbol: true },
  ];

  return {
    algo,
    barsSeen,
    warmupComplete,
    lastSignalAt,
    stateEntries,
    pnlPoints,
    pnlSummary,
    pnlSeries,
    charts,
  };
}
