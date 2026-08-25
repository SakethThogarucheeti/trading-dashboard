"use client";

import type { MonteCarloReport } from "@/lib/api";
import { T } from "@/lib/echarts";
import { formatPct } from "@/lib/format";
import { ReturnDistHistogram } from "@/components/charts/ReturnDistHistogram";
import { DrawdownDistHistogram } from "@/components/charts/DrawdownDistHistogram";
import { RuinGauge } from "@/components/charts/RuinGauge";
import { StatCard } from "@/components/ui/StatCard";
import { HeaderStrip } from "@/components/ui/HeaderStrip";

export function MonteCarloView({ report }: { report: MonteCarloReport }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <HeaderStrip
        items={[
          { label: "Trials", value: report.n_trials.toLocaleString(), emphasis: "bold" },
          { label: "Method", value: report.method },
          { label: "Session", value: report.session_id, emphasis: "mono" },
        ]}
      />

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard label="5th Pct Return" value={formatPct(report.percentile_5_return)} color={T.neg} />
        <StatCard label="95th Pct Return" value={formatPct(report.percentile_95_return)} color={T.pos} />
        <StatCard label="Median Drawdown" value={formatPct(report.median_drawdown)} color={T.neutral} />
        <StatCard
          label="Ruin Probability"
          value={formatPct(report.probability_of_ruin)}
          color={report.probability_of_ruin > 0.05 ? T.neg : report.probability_of_ruin > 0.01 ? T.neutral : T.pos}
        />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16 }}>
        <ReturnDistHistogram
          returnDistribution={report.return_distribution}
          percentile5={report.percentile_5_return}
          percentile95={report.percentile_95_return}
          height={280}
        />
        <DrawdownDistHistogram drawdownDistribution={report.drawdown_distribution} height={280} />
        <RuinGauge probabilityOfRuin={report.probability_of_ruin} height={280} />
      </div>
    </div>
  );
}
