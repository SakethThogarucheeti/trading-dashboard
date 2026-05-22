import { create } from "zustand";

interface DashboardStore {
  sessionId: string;
  algoName: string;
  symbol: string;
  interval: string;
  setSessionId: (id: string) => void;
  setAlgoName: (name: string) => void;
  setSymbol: (s: string) => void;
  setInterval: (i: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  sessionId: "",
  algoName: "",
  symbol: "INFY",
  interval: "5min",
  setSessionId: (id) => set({ sessionId: id }),
  setAlgoName: (name) => set({ algoName: name }),
  setSymbol: (s) => set({ symbol: s }),
  setInterval: (i) => set({ interval: i }),
}));
