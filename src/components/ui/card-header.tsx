import * as React from "react";

import { cn } from "@/lib/utils";

import styles from "./card-header.module.css";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className={cn(styles.header, !subtitle && styles.singleLine)}>
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
