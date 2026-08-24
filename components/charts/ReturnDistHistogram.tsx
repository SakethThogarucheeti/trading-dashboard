"use client";

import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { BASE_GRID, BASE_TOOLTIP, BASE_XAXIS, BASE_YAXIS, T } from "@/lib/echarts";
import { computeBins } from "@/lib/histogram";

interface ReturnDistHistogramProps {
  returnDistribution: number[];
  percentile5: number;
  percentile95: number;
  height?: number;
  "data-testid"?: string;
}

export function ReturnDistHistogram({
  returnDistribution,
  percentile5,
  percentile95,
  height = 220,
  "data-testid": testId,
}: ReturnDistHistogramProps) {
  const option = useMemo(() => {
    const { labels, counts, min, binWidth } = computeBins(returnDistribution);

    const p5Bin = min !== undefined && binWidth ? Math.floor((percentile5 - min) / binWidth) : 0;
    const p95Bin = min !== undefined && binWidth ? Math.floor((percentile95 - min) / binWidth) : labels.length - 1;

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
          itemStyle: { color: T.accent },
          barMaxWidth: 20,
          markLine: {
            silent: true,
            data: [
              {
                xAxis: labels[p5Bin] ?? labels[0],
                lineStyle: { color: T.neg, type: "dashed" },
                label: { formatter: "5th", color: T.neg, fontSize: 10 },
              },
              {
                xAxis: labels[p95Bin] ?? labels[labels.length - 1],
                lineStyle: { color: T.pos, type: "dashed" },
                label: { formatter: "95th", color: T.pos, fontSize: 10 },
              },
            ],
          },
        },
      ],
    };
  }, [returnDistribution, percentile5, percentile95]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      notMerge={false}
      lazyUpdate={true}
      data-testid={testId}
    />
  );
}
