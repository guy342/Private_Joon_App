import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./nav-item.module.css";

interface NavItemProps {
  label: string;
  active?: boolean;
  icon?: LucideIcon;
  initials?: string;
}

export function NavItem({ label, active, icon: Icon, initials }: NavItemProps) {
  return (
    <a href="#" className={cn(styles.item, active && styles.active)}>
      {initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : Icon ? (
        <Icon className={styles.icon} size={16} strokeWidth={1.75} />
      ) : null}
      <span className={styles.label}>{label}</span>
    </a>
  );
}
