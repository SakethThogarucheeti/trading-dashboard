"use client";

import { useMemo } from "react";
import { BASE_GRID, BASE_TOOLTIP, BASE_XAXIS, BASE_YAXIS, T } from "@/lib/echarts";
import { computeBins } from "@/lib/histogram";
import { ChartCanvas } from "@/components/charts/ChartCanvas";

interface DrawdownDistHistogramProps {
  drawdownDistribution: number[];
  height?: number;
  "data-testid"?: string;
}

export function DrawdownDistHistogram({
  drawdownDistribution,
  height = 220,
  "data-testid": testId,
}: DrawdownDistHistogramProps) {
  const option = useMemo(() => {
    const { labels, counts } = computeBins(drawdownDistribution);
    return {
      backgroundColor: T.surface,
      tooltip: { ...BASE_TOOLTIP, trigger: "axis" as const },
      grid: BASE_GRID,
      xAxis: { ...BASE_XAXIS, data: labels, boundaryGap: true },
      yAxis: { ...BASE_YAXIS },
      series: [
        {
          type: "bar",
          data: counts,
          itemStyle: { color: T.neutral },
          barMaxWidth: 20,
        },
      ],
    };
  }, [drawdownDistribution]);

  return <ChartCanvas option={option} height={height} data-testid={testId} />;
}
