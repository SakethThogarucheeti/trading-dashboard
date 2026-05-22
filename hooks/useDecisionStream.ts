"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DecisionEvent } from "@/lib/api";

const MAX_EVENTS = 200;

export type SSEStatus = "connecting" | "live" | "reconnecting";

export function useDecisionStream(sessionId: string, algoName = "") {
  const [events, setEvents] = useState<DecisionEvent[]>([]);
  const [status, setStatus] = useState<SSEStatus>("connecting");
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
    }
    const params = new URLSearchParams();
    if (sessionId) params.set("session_id", sessionId);
    if (algoName) params.set("algo_name", algoName);
    const qs = params.toString();
    const url = `/api/decisions/stream${qs ? `?${qs}` : ""}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setStatus("live");
    es.onerror = () => setStatus("reconnecting");
    es.onmessage = (e) => {
      try {
        const event: DecisionEvent = JSON.parse(e.data as string);
        setEvents((prev) => {
          const next = [...prev, event];
          return next.length > MAX_EVENTS ? next.slice(next.length - MAX_EVENTS) : next;
        });
      } catch {
        // ignore parse errors
      }
    };
  }, [sessionId, algoName]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
    };
  }, [connect]);

  return { events, status };
}
