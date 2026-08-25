"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlgos } from "@/lib/api";
import { useDashboardStore } from "@/store";
import { StoreSelect } from "@/components/ui/StoreSelect";

export function AlgoSelector() {
  const { algoName, setAlgoName } = useDashboardStore();
  const { data: algos = [] } = useQuery({
    queryKey: ["algos"],
    queryFn: fetchAlgos,
    refetchInterval: 60_000,
  });

  return (
    <StoreSelect
      value={algoName}
      onChange={setAlgoName}
      placeholderLabel="All strategies"
      options={algos.map((a) => ({ value: a.name, label: a.name }))}
    />
  );
}
