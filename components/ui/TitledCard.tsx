"use client";

import type { CSSProperties, ReactNode } from "react";
import { T } from "@/lib/echarts";

export function TitledCard({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 16,
        ...style,
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
