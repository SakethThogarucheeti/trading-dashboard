"use client";

import type { ReactNode } from "react";
import { T } from "@/lib/echarts";

interface HeaderStripItem {
  label: string;
  value: ReactNode;
  emphasis?: "bold" | "mono";
}

export function HeaderStrip({ items }: { items: HeaderStripItem[] }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        display: "flex",
        gap: 32,
        flexWrap: "wrap",
      }}
    >
      {items.map(({ label, value, emphasis }) => (
        <div key={label}>
          <div style={{ color: T.muted, fontSize: 11, textTransform: "uppercase" }}>{label}</div>
          <div
            style={{
              color: T.text,
              fontWeight: emphasis === "bold" ? 600 : undefined,
              fontFamily: emphasis === "mono" ? "monospace" : undefined,
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
