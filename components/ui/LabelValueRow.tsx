"use client";

import { T } from "@/lib/echarts";

export function LabelValueRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: `1px solid ${T.border}`,
        fontSize: 13,
      }}
    >
      <span style={{ color: T.muted }}>{label}</span>
      <span style={{ color: T.text, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
