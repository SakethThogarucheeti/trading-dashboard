"use client";

import { T } from "@/lib/echarts";

export function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "12px 16px",
      }}
    >
      <div style={{ color: T.muted, fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: color ?? T.text, fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
