"use client";

import ReactECharts from "echarts-for-react";

interface ChartCanvasProps {
  option: Record<string, unknown>;
  height: number;
  lazyUpdate?: boolean;
  "data-testid"?: string;
}

export function ChartCanvas({
  option,
  height,
  lazyUpdate = true,
  "data-testid": testId,
}: ChartCanvasProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      notMerge={false}
      lazyUpdate={lazyUpdate}
      data-testid={testId}
    />
  );
}
