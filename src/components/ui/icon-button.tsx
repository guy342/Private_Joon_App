import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./icon-button.module.css";

interface IconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
}

export function IconButton({
  icon: Icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <div className={cn(styles.iconBtn, className)} {...props}>
      <Icon className={styles.icon} size={16} strokeWidth={1.75} />
    </div>
  );
}
