import * as React from "react";

import { cn } from "@/lib/utils";

import styles from "./delta-badge.module.css";

interface DeltaBadgeProps {
  value: string;
  color?: "green" | "blue";
}

export function DeltaBadge({ value, color = "green" }: DeltaBadgeProps) {
  return (
    <span
      className={cn(
        styles.badge,
        color === "blue" ? styles.blue : styles.green,
      )}
    >
      {value}
    </span>
  );
}
