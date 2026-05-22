import { createFileRoute } from "@tanstack/react-router";
import { T } from "@/lib/echarts";
import { AlgoStatusPanel } from "@/components/panels/AlgoStatusPanel";
import { PositionsPanel } from "@/components/panels/PositionsPanel";
import { HealthPanel } from "@/components/panels/HealthPanel";
import { SignalsTable } from "@/components/panels/SignalsTable";
import { DecisionFeed } from "@/components/panels/DecisionFeed";
import { LiveCharts } from "@/components/panels/LiveCharts";
import { AlgoPnlMatrix } from "@/components/panels/AlgoPnlMatrix";
import { StrategyDetailView } from "@/components/panels/StrategyDetailView";
import { SessionSelector } from "@/components/ui/SessionSelector";
import { AlgoSelector } from "@/components/ui/AlgoSelector";
import { useDashboardStore } from "@/store";

export const Route = createFileRoute("/")({
  component: LiveDashboardPage,
});

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div
        style={{
          color: T.muted,
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function LiveDashboardPage() {
  const algoName = useDashboardStore((s) => s.algoName);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          gap: 8,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Live Dashboard</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AlgoSelector />
          <SessionSelector />
        </div>
      </div>

      {algoName ? (
        <StrategyDetailView />
      ) : (
        <OverviewLayout />
      )}
    </div>
  );
}

function OverviewLayout() {
  return (
    <>
      {/* 2-column grid for status panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card title="Algo Status">
          <AlgoStatusPanel />
          <AlgoPnlMatrix />
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Positions">
            <PositionsPanel />
          </Card>
          <Card title="Component Health">
            <HealthPanel />
          </Card>
        </div>
      </div>

      {/* Full-width charts */}
      <div style={{ marginBottom: 24 }}>
        <LiveCharts />
      </div>

      {/* Signals + Decision Feed */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <Card title="Recent Signals">
          <SignalsTable />
        </Card>
        <Card title="Decision Feed">
          <DecisionFeed />
        </Card>
      </div>
    </>
  );
}
