import * as React from "react";
import { Calendar, ChevronDown } from "lucide-react";

import styles from "./topbar.module.css";

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.identity}>
        <div className={styles.avatar} />
        <div className={styles.identityText}>
          <span className={styles.identityTitle}>
            Detection Engineering · Dawn
          </span>
          <div className={styles.statusRow}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>Active</span>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <span className={styles.kbd}>⌘K</span>
        <button type="button" className={styles.dateBtn}>
          <Calendar
            className={styles.controlIcon}
            size={12}
            strokeWidth={1.75}
          />
          <span className={styles.dateLabel}>Last 7 days</span>
          <ChevronDown
            className={styles.controlIcon}
            size={12}
            strokeWidth={1.75}
          />
        </button>
        <span className={styles.updated}>Updated 2h ago</span>
      </div>
    </header>
  );
}
