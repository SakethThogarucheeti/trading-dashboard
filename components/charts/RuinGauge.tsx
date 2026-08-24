"use client";

import { useMemo } from "react";
import { T } from "@/lib/echarts";
import { ChartCanvas } from "@/components/charts/ChartCanvas";

interface RuinGaugeProps {
  probabilityOfRuin: number;
  height?: number;
  "data-testid"?: string;
}

export function RuinGauge({ probabilityOfRuin, height = 200, "data-testid": testId }: RuinGaugeProps) {
  const pct = probabilityOfRuin * 100;

  const option = useMemo(
    () => ({
      backgroundColor: T.surface,
      series: [
        {
          type: "gauge",
          min: 0,
          max: 100,
          data: [{ value: parseFloat(pct.toFixed(2)), name: "Ruin %" }],
          detail: {
            formatter: (v: number) => `${v.toFixed(1)}%`,
            color: T.text,
            fontSize: 18,
          },
          title: { color: T.muted, fontSize: 12, offsetCenter: [0, "70%"] },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.01, T.pos],
                [0.05, T.neutral],
                [1, T.neg + "80"],
              ],
            },
          },
          pointer: { itemStyle: { color: T.neg } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { color: T.muted, fontSize: 10 },
        },
      ],
    }),
    [pct],
  );

  return <ChartCanvas option={option} height={height} lazyUpdate={false} data-testid={testId} />;
}
