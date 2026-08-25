"use client";

import type { ReactNode } from "react";
import { T } from "@/lib/echarts";

export function SectionCard({
  title,
  overflowX,
  children,
}: {
  title: string;
  overflowX?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 16,
        overflowX: overflowX ? "auto" : undefined,
      }}
    >
      <div style={{ color: T.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
