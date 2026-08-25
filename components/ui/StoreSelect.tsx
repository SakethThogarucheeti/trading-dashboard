"use client";

import { T } from "@/lib/echarts";

interface StoreSelectOption {
  value: string;
  label: string;
}

export function StoreSelect({
  value,
  onChange,
  placeholderLabel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholderLabel: string;
  options: StoreSelectOption[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: T.surface,
        color: T.text,
        border: `1px solid ${T.border}`,
        borderRadius: 4,
        padding: "4px 8px",
        fontSize: 12,
        fontFamily: "ui-monospace, monospace",
        cursor: "pointer",
      }}
    >
      <option value="">{placeholderLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
