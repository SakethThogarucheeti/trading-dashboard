"use client";

import type { ReactNode } from "react";
import { T } from "@/lib/echarts";

export interface DataTableColumn {
  label: string;
  align?: "left" | "right";
}

export function DataTable({
  columns,
  isEmpty,
  emptyMessage,
  scrollX,
  children,
}: {
  columns: DataTableColumn[];
  isEmpty: boolean;
  emptyMessage: string;
  scrollX?: boolean;
  children: ReactNode;
}) {
  return (
    <div style={{ fontFamily: "ui-monospace, monospace", ...(scrollX ? { overflowX: "auto" } : {}) }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ color: T.muted }}>
            {columns.map((col) => (
              <th key={col.label} style={{ textAlign: col.align ?? "left", padding: "4px 8px" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={columns.length} style={{ color: T.muted, padding: "8px" }}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {children}
        </tbody>
      </table>
    </div>
  );
}
