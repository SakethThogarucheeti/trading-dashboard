"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCandles, fetchTicks, fetchPnl, fetchCharts, fetchSettings } from "@/lib/api";

const ALL_INTERVALS = ["1min", "3min", "5min", "10min", "15min", "30min", "60min"];
const EMPTY_PNL_SUMMARY = { gross: 0, costs: 0, net: 0, nifty_pct: null, nifty_open: null, nifty_close: null };

/**
 * Data-fetching + derived-state for LiveCharts: the 5 useQuery calls
 * (settings, candles, ticks, pnl, charts) plus the interval-sync effect and
 * display-shaping logic that previously lived inline in the component (see
 * trading-dashboard#3).
 */
export function useLiveChartsData(
  symbol: string,
  interval: string,
  sessionId: string,
  algoName: string,
  setInterval: (i: string) => void,
) {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: Infinity,
  });
  const availableIntervals = settings?.candle_intervals ?? ALL_INTERVALS;

  // Sync interval to first configured interval on initial load
  useEffect(() => {
    if (settings?.candle_intervals?.length && !settings.candle_intervals.includes(interval)) {
      setInterval(settings.candle_intervals[0]);
    }
  }, [settings, interval, setInterval]);

  const { data: candles = [] } = useQuery({
    queryKey: ["candles", symbol, interval],
    queryFn: () => fetchCandles(symbol, interval, 200),
    refetchInterval: 30_000,
  });

  const { data: ticks = [] } = useQuery({
    queryKey: ["ticks", symbol],
    queryFn: () => fetchTicks(symbol),
    refetchInterval: 5_000,
  });

  const { data: pnlData } = useQuery({
    queryKey: ["pnl", sessionId],
    queryFn: () => fetchPnl(sessionId),
    refetchInterval: 30_000,
  });

  const { data: charts = {} } = useQuery({
    queryKey: ["charts", sessionId, algoName],
    queryFn: () => fetchCharts(sessionId, algoName),
    refetchInterval: 30_000,
  });

  const pnlPoints = pnlData?.points ?? [];
  const pnlSummary = pnlData?.summary ?? EMPTY_PNL_SUMMARY;

  const pnlSeries = [
    {
      name: "Gross P&L",
      data: pnlPoints.map((p) => ({ ts: p.ts, value: p.cumulative_gross })),
      dashed: true,
    },
    {
      name: "Net P&L (after costs)",
      data: pnlPoints.map((p) => ({ ts: p.ts, value: p.cumulative_net })),
      showSymbol: true,
    },
  ];

  const tickSeries = [
    {
      name: symbol,
      data: ticks.map((t) => ({ ts: t.ts, value: t.price })),
      areaGradient: true,
    },
  ];

  return {
    availableIntervals,
    candles,
    ticks,
    tickSeries,
    pnlPoints,
    pnlSummary,
    pnlSeries,
    charts,
  };
}
