"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/lib/api";
import { useDashboardStore } from "@/store";
import { StoreSelect } from "@/components/ui/StoreSelect";

export function SessionSelector() {
  const { sessionId, setSessionId } = useDashboardStore();
  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    refetchInterval: 60_000,
  });

  return (
    <StoreSelect
      value={sessionId}
      onChange={setSessionId}
      placeholderLabel="live"
      options={sessions
        .filter((s): s is string => s !== null)
        .map((s) => ({ value: s, label: s }))}
    />
  );
}
