import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { DeltaBadge } from "./delta-badge";
import { IconButton } from "./icon-button";

import styles from "./stat-tile.module.css";

interface StatTileProps {
  icon: LucideIcon;
  delta: string;
  deltaColor?: "green" | "blue";
  value: string;
  unit?: string;
  label: string;
}

export function StatTile({
  icon,
  delta,
  deltaColor = "green",
  value,
  unit,
  label,
}: StatTileProps) {
  return (
    <div className={styles.tile}>
      <div className={styles.top}>
        <IconButton icon={icon} />
        <DeltaBadge value={delta} color={deltaColor} />
      </div>
      <div className={styles.bottom}>
        <div className={styles.numberRow}>
          <span className={styles.value}>{value}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
