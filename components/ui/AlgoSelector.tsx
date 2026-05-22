"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlgos } from "@/lib/api";
import { useDashboardStore } from "@/store";
import { T } from "@/lib/echarts";

export function AlgoSelector() {
  const { algoName, setAlgoName } = useDashboardStore();
  const { data: algos = [] } = useQuery({
    queryKey: ["algos"],
    queryFn: fetchAlgos,
    refetchInterval: 60_000,
  });

  return (
    <select
      value={algoName}
      onChange={(e) => setAlgoName(e.target.value)}
      style={{
        backgroundColor: T.surface,
        color: T.text,
        border: `1px solid ${T.border}`,
        borderRadius: 4,
        padding: "4px 8px",
        fontSize: 12,
        fontFamily: "ui-monospace, monospace",
        cursor: "pointer",
      }}
    >
      <option value="">All strategies</option>
      {algos.map((a) => (
        <option key={a.name} value={a.name}>
          {a.name}
        </option>
      ))}
    </select>
  );
}
