import * as React from "react";

import { cn } from "@/lib/utils";

import styles from "./card.module.css";

type CardVariant = "default" | "inner" | "sub";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
  variant?: CardVariant;
}

export function Card({
  className,
  noPadding,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        noPadding && styles.noPadding,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
