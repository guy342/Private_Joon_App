import * as React from "react";

import styles from "./lollipop-row.module.css";

interface LollipopRowProps {
  label: string;
  value: number;
  max: number;
}

export function LollipopRow({ label, value, max }: LollipopRowProps) {
  const pct =
    max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  // CSS custom property exposes the dynamic percentage to the stylesheet —
  // there's no static-CSS way to express a data-driven width.
  const cssVars = { "--lollipop-pct": `${pct}%` } as React.CSSProperties;

  return (
    <div className={styles.row} style={cssVars}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track}>
        <span className={styles.fill} />
        <span className={styles.dot} />
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
