"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  ChevronRight,
  ListFilter,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";
import mainContentStyles from "./main-content.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}>;

interface WorkloadChild {
  id: string;
  name: string;
  status: string;
  time: string;
}

interface WorkloadGroup {
  label: string;
  count: string;
  expanded?: boolean;
  runningBadge?: string;
  children?: WorkloadChild[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

const WORKLOAD_GROUPS: WorkloadGroup[] = [
  {
    label: "Closing Coverage Gaps",
    count: "3 items",
    expanded: true,
    runningBadge: "3 Running",
    children: [
      { id: "DET--730", name: "Detection WN-730", status: "Validating", time: "1h 36min" },
      { id: "DET--715", name: "Detection WN-715", status: "Rule_generation", time: "1h 36min" },
      { id: "DET--714", name: "Detection WN-714", status: "Rule_generation", time: "1h 36min" },
    ],
  },
  {
    label: "Improving Detection Quality",
    count: "3 items",
    runningBadge: "3 Running",
    children: [
      { id: "DET--712", name: "Detection WN-712", status: "Validating", time: "1h 36min" },
      { id: "DET--711", name: "Detection WN-711", status: "Rule_generation", time: "1h 36min" },
      { id: "DET--710", name: "Detection WN-710", status: "Validating", time: "1h 36min" },
    ],
  },
  {
    label: "Protecting Critical Assets",
    count: "3 items",
    runningBadge: "3 Running",
    children: [
      { id: "DET--708", name: "Detection WN-708", status: "Rule_generation", time: "1h 36min" },
      { id: "DET--707", name: "Detection WN-707", status: "Validating", time: "1h 36min" },
      { id: "DET--706", name: "Detection WN-706", status: "Rule_generation", time: "1h 36min" },
    ],
  },
  {
    label: "Building Baseline Coverage",
    count: "3 items",
    runningBadge: "3 Running",
    children: [
      { id: "DET--703", name: "Detection WN-703", status: "Validating", time: "1h 36min" },
      { id: "DET--702", name: "Detection WN-702", status: "Validating", time: "1h 36min" },
      { id: "DET--701", name: "Detection WN-701", status: "Rule_generation", time: "1h 36min" },
    ],
  },
  {
    label: "Improving Detection Quality",
    count: "3 items",
    runningBadge: "3 Running",
    children: [
      { id: "DET--699", name: "Detection WN-699", status: "Rule_generation", time: "1h 36min" },
      { id: "DET--698", name: "Detection WN-698", status: "Validating", time: "1h 36min" },
      { id: "DET--697", name: "Detection WN-697", status: "Rule_generation", time: "1h 36min" },
    ],
  },
  {
    label: "Responding to Threats",
    count: "3 items",
    runningBadge: "3 Running",
    children: [
      { id: "DET--695", name: "Detection WN-695", status: "Validating", time: "1h 36min" },
      { id: "DET--694", name: "Detection WN-694", status: "Rule_generation", time: "1h 36min" },
      { id: "DET--693", name: "Detection WN-693", status: "Validating", time: "1h 36min" },
    ],
  },
  {
    label: "Protecting Critical Assets",
    count: "3 items",
    runningBadge: "3 Running",
    children: [
      { id: "DET--691", name: "Detection WN-691", status: "Rule_generation", time: "1h 36min" },
      { id: "DET--690", name: "Detection WN-690", status: "Validating", time: "1h 36min" },
      { id: "DET--689", name: "Detection WN-689", status: "Rule_generation", time: "1h 36min" },
    ],
  },
];

const PROPOSAL_DRIVERS = [
  { label: "Coverage Gap",       value: 210, max: 220 },
  { label: "Baseline Coverage",  value: 180, max: 220 },
  { label: "Threat",             value: 95,  max: 220 },
  { label: "Exposure",           value: 72,  max: 220 },
  { label: "Detection Quality",  value: 48,  max: 220 },
  { label: "Platform",           value: 35,  max: 220 },
  { label: "Critical Asset",     value: 22,  max: 220 },
];

const TEAMWORK_ITEMS = [
  {
    title: "Reported on 50 hunting hits for Invistigation rule",
    meta: "From Helen To Sean",
    fromAvatar: "/Avatar_Helen.png",
    toAvatar: "/Avatar_Sean.png",
  },
  {
    title: "Reported on 92 hunting hits for Hunting rule",
    meta: "From Valery To Sean",
    fromAvatar: "/Avatar_Valery.png",
    toAvatar: "/Avatar_Sean.png",
  },
];

const LAST_COVERED = [
  { name: "Brute Force Authentication Atte...", date: "Mar 1" },
  { name: "Suspicious PowerShell Execution",   date: "Mar 5" },
  { name: "Anomalous Service Account Acti...",  date: "Mar 10" },
  { name: "Suspicious PowerShell Execution",   date: "Mar 5" },
  { name: "MFA Fatigue Attack Detection",       date: "Mar 15" },
];

// ─── Heatmap data + tier map ──────────────────────────────────────────────────
// Used by DetectionCoverageHeatmap. Each tier pairs a cell background with an
// accent-bar color; "empty" cells (no detection at all) carry tier: null and
// render as a flat dark tile with no bar and no text. Adding a new tier means
// adding to BOTH this map AND tokens.css (--heatmap-tier-*).

type HeatmapTier = "100" | "75" | "50" | "25" | "0";

const HEATMAP_TIERS: Record<HeatmapTier, { bg: string; bar: string }> = {
  "100": { bg: "#163931", bar: "#03d07d" },
  "75":  { bg: "#17322d", bar: "#0aa467" },
  "50":  { bg: "#182a29", bar: "#117852" },
  "25":  { bg: "#192326", bar: "#174c3c" },
  "0":   { bg: "#11181a", bar: "#0c261e" },
};
const HEATMAP_EMPTY_BG = "#17191f";

const HEATMAP_COLUMN_WIDTH = 145;
const HEATMAP_CELL_HEIGHT = 52;
const HEATMAP_CELL_GAP = 8;
const HEATMAP_COLUMN_GAP = 8;

type HeatmapCellData = {
  tier: HeatmapTier | null;
  id: string;
  name: string;
};

type HeatmapColumnData = {
  category: string;
  percent: number;
  cells: HeatmapCellData[];
};

const e: HeatmapCellData = { tier: null, id: "", name: "" };

const HEATMAP_TACTICS: HeatmapColumnData[] = [
  { category: "Reconnaissance", percent: 72, cells: [
    { tier: "100", id: "T1595", name: "Active Scanning" },
    { tier: "100", id: "T1595", name: "Active Scanning" },
    { tier: "25",  id: "T1589", name: "Gather Victim Identity Information" },
    { tier: "25",  id: "T1589", name: "Gather Victim Identity Information" },
    e, e, e,
  ]},
  { category: "Resource Development", percent: 65, cells: [
    { tier: "100", id: "T1583", name: "Acquire Infrastructure" },
    { tier: "75",  id: "T1583", name: "Acquire Infrastructure" },
    { tier: "50",  id: "T1584", name: "Compromise Infrastructure" },
    e, e, e, e,
  ]},
  { category: "Initial Access", percent: 81, cells: [
    { tier: "100", id: "T1190", name: "Exploit Public-Facing App" },
    { tier: "75",  id: "T1133", name: "External Remote Services" },
    { tier: "75",  id: "T1566", name: "Phishing" },
    { tier: "25",  id: "T1078", name: "Valid Accounts" },
    e, e, e,
  ]},
  { category: "Execution", percent: 68, cells: [
    { tier: "75",  id: "T1059", name: "Command and Scripting Interpreter" },
    { tier: "75",  id: "T1059", name: "Command and Scripting Interpreter" },
    { tier: "50",  id: "T1106", name: "Native API" },
    { tier: "25",  id: "T1204", name: "User Execution" },
    e, e, e,
  ]},
  { category: "Persistence", percent: 74, cells: [
    { tier: "100", id: "T1547", name: "Boot or Logon Autostart" },
    { tier: "100", id: "T1547", name: "Boot or Logon Autostart" },
    { tier: "75",  id: "T1136", name: "Create Account" },
    { tier: "75",  id: "T1136", name: "Create Account" },
    { tier: "25",  id: "T1098", name: "Account Manipulation" },
    { tier: "25",  id: "T1098", name: "Account Manipulation" },
    e,
  ]},
  { category: "Privilege Escalation", percent: 71, cells: [
    { tier: "100", id: "T1068", name: "Exploitation for Privilege Esc" },
    { tier: "75",  id: "T1055", name: "Process Injection" },
    { tier: "50",  id: "T1078", name: "Valid Accounts" },
    e, e, e, e,
  ]},
  { category: "Defense Evasion", percent: 63, cells: [
    { tier: "100", id: "T1562", name: "Impair Defenses" },
    { tier: "75",  id: "T1070", name: "Indicator Removal" },
    { tier: "75",  id: "T1027", name: "Obfuscated Files" },
    { tier: "50",  id: "T1140", name: "Deobfuscate Files" },
    { tier: "0",   id: "T1112", name: "Modify Registry" },
    e, e,
  ]},
  { category: "Credential Access", percent: 58, cells: [
    { tier: "100", id: "T1110", name: "Brute Force" },
    { tier: "75",  id: "T1003", name: "OS Credential Dumping" },
    { tier: "0",   id: "T1555", name: "Credentials from Stores" },
    { tier: "0",   id: "T1555", name: "Credentials from Stores" },
    e, e, e,
  ]},
  { category: "Discovery", percent: 79, cells: [
    { tier: "100", id: "T1087", name: "Account Discovery" },
    { tier: "100", id: "T1083", name: "File and Directory Discovery" },
    { tier: "75",  id: "T1135", name: "Network Share Discovery" },
    { tier: "50",  id: "T1057", name: "Process Discovery" },
    { tier: "50",  id: "T1018", name: "Remote System Discovery" },
    e, e,
  ]},
  { category: "Lateral Movement", percent: 67, cells: [
    { tier: "75",  id: "T1021", name: "Remote Services" },
    { tier: "75",  id: "T1021", name: "Remote Services" },
    { tier: "50",  id: "T1570", name: "Lateral Tool Transfer" },
    { tier: "25",  id: "T1534", name: "Internal Spearphishing" },
    e, e, e,
  ]},
  { category: "Collection", percent: 60, cells: [
    { tier: "75",  id: "T1560", name: "Archive Collected Data" },
    { tier: "50",  id: "T1119", name: "Automated Collection" },
    { tier: "0",   id: "T1213", name: "Data from Information Repositories" },
    e, e, e, e,
  ]},
  { category: "Command and Control", percent: 73, cells: [
    { tier: "100", id: "T1071", name: "Application Layer Protocol" },
    { tier: "75",  id: "T1573", name: "Encrypted Channel" },
    { tier: "75",  id: "T1090", name: "Proxy" },
    { tier: "25",  id: "T1105", name: "Ingress Tool Transfer" },
    e, e, e,
  ]},
  { category: "Exfiltration", percent: 55, cells: [
    { tier: "75",  id: "T1041", name: "Exfil Over C2 Channel" },
    { tier: "50",  id: "T1048", name: "Exfil Over Alt Protocol" },
    { tier: "0",   id: "T1567", name: "Exfil Over Web Service" },
    e, e, e, e,
  ]},
  { category: "Impact", percent: 70, cells: [
    { tier: "100", id: "T1486", name: "Data Encrypted for Impact" },
    { tier: "75",  id: "T1485", name: "Data Destruction" },
    { tier: "50",  id: "T1490", name: "Inhibit System Recovery" },
    { tier: "25",  id: "T1489", name: "Service Stop" },
    e, e, e,
  ]},
];

// ─── Shared style fragments ───────────────────────────────────────────────────

const FONT_INTER = "var(--font-inter), 'Inter', sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";

const T_HEADING: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 500, fontSize: 18, lineHeight: "24px", color: "#f2f4f7",
};
const T_BODY: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 400, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.2px",
};
const T_BODY_MED: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 500, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.2px",
};
const T_BODY_SEMI: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 600, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.2px",
};
const T_CAPTION: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 400, fontSize: 10, lineHeight: "16px", letterSpacing: "-0.2px",
};
const T_CAPTION_MED: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 500, fontSize: 10, lineHeight: "16px", letterSpacing: "-0.2px",
};
const T_MONO_SMALL: React.CSSProperties = {
  fontFamily: FONT_MONO, fontWeight: 400, fontSize: 10, lineHeight: "16px", letterSpacing: "-0.2px",
};
const T_MONO_MED: React.CSSProperties = {
  fontFamily: FONT_MONO, fontWeight: 500, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.2px",
};
const T_DISPLAY: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 700, fontSize: 64, lineHeight: "46px", letterSpacing: "-0.03px", color: "#f2f4f7",
};
const T_STAT_NUM: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 700, fontSize: 44, lineHeight: "normal", letterSpacing: "-0.02px", color: "#f2f4f7",
};
const T_STAT_UNIT: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 700, fontSize: 24, lineHeight: "normal", letterSpacing: "-0.02px", color: "#f2f4f7",
};
// Medium-sized stat (Response time number "4.2", Telemetry completeness "98").
// Sits one size step below T_STAT_UNIT so it still reads as a stat number but
// fits in the smaller Inner Cards on the H&P right column.
const T_STAT_MED: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 700, fontSize: 20, lineHeight: "normal", letterSpacing: "-0.02px", color: "#f2f4f7",
};
// Tabular value used in the H&P Total Rules breakdown rows ("210", "95",
// "72"). Inter SemiBold 14 / 16 — Figma's reference uses Geist SemiBold but
// we substitute with Inter so we don't pull in a third font family.
const T_VALUE: React.CSSProperties = {
  fontFamily: FONT_INTER, fontWeight: 600, fontSize: 14, lineHeight: "16px", color: "#f2f4f7",
};

// ─── Inner Card ───────────────────────────────────────────────────────────────
// Shared visual treatment for any card-shaped element nested inside a top-level
// Card or the StatusBar. Background matches the sidebar (--bg-elevated, #1e2026)
// so inner surfaces feel "lifted" off the parent Card (--bg-card, #1a1c22).

const INNER_CARD: React.CSSProperties = {
  background: "#1e2026",
  borderRadius: 8,
};

// ─── Status Pill (glass) ─────────────────────────────────────────────────────
// Shared visual treatment for the two floating pills that replace the StatusBar
// once MainContent is scrolled past it. Translucent gradient + 1px border + drop
// shadow + backdrop blur. Registered border exception in DESIGN_SYSTEM_1.md
// (action chip — the pill IS the button-like surface).

const STATUS_PILL_GLASS: React.CSSProperties = {
  borderRadius: 100,
  border: "1px solid #23252a",
  background:
    "linear-gradient(90deg, rgba(26,28,34,0.75) 0%, rgba(31,33,41,0.75) 100%)",
  boxShadow: "0 2px 20px 0 rgba(0,0,0,0.40)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function SidebarIconBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: IconComponent;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: 100,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        color: "#b4b9c2",
        padding: 0,
      }}
    >
      <Icon size={14} strokeWidth={1.75} />
    </button>
  );
}

function NavRow({
  label,
  icon: Icon,
  initials,
  avatarUrl,
  active,
}: {
  label: string;
  icon?: IconComponent;
  initials?: string;
  avatarUrl?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        height: 32,
        padding: "5px 8px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 5,
        width: "100%",
        background: active ? "#292b31" : "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "#f2f4f7" : "#b4b9c2",
        fontFamily: FONT_INTER,
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "20px",
        letterSpacing: "-0.2px",
        textAlign: "left",
      }}
    >
      {avatarUrl ? (
        <span
          role="img"
          aria-label={`${label} avatar`}
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#1a1c22",
            backgroundImage: `url('${avatarUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />
      ) : initials ? (
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#1a1c22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 8,
            lineHeight: 1,
            color: active ? "#f2f4f7" : "#b4b9c2",
            flexShrink: 0,
          }}
        >
          {initials}
        </span>
      ) : Icon ? (
        <Icon size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      ) : null}
      <span>{label}</span>
    </button>
  );
}

// Nav button used in the collapsed sidebar. Two visual modes:
//   - Icon mode    (icon prop)      → 64×52 click area, 20×20 lucide icon centered
//   - Avatar mode  (avatarUrl prop) → 64×56 click area, 30×30 avatar centered;
//                                     active state wraps the avatar in a 52×52
//                                     `#292b31` pill (rounded 8) per the Figma
function CollapsedNavBtn({
  icon: Icon,
  avatarUrl,
  label,
  active,
}: {
  icon?: IconComponent;
  avatarUrl?: string;
  label: string;
  active?: boolean;
}) {
  const isAvatar = !!avatarUrl;
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        width: 64,
        height: isAvatar ? 56 : 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "#f2f4f7" : "#b4b9c2",
        flexShrink: 0,
        padding: 0,
        borderRadius: 5,
      }}
    >
      {isAvatar ? (
        <span
          style={{
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: active ? "#292b31" : "transparent",
          }}
        >
          <span
            role="img"
            aria-label={`${label} avatar`}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#1a1c22",
              backgroundImage: `url('${avatarUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
            }}
          />
        </span>
      ) : Icon ? (
        <Icon size={20} strokeWidth={1.75} />
      ) : null}
    </button>
  );
}

function CollapsedSidebar({ onExpand }: { onExpand: () => void }) {
  return (
    <aside
      style={{
        // Width/bg/radius/margin/overflow live on the wrapper in DetectionPage
        // so they can transition across the collapsed/expanded swap. This
        // aside is just the content layout — full wrapper width + height,
        // flex-column with space-between pinning the top wrapper to the top
        // and the bottom-toggle row to the bottom.
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        alignSelf: "stretch",
      }}
    >
      {/* Top wrapper — brand row + the two nav groups */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flexShrink: 0,
          width: "100%",
        }}
      >
        {/* Brand row — just the 34×34 search button centered in a 64-tall
            row. No logo in this version. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 64,
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10px",
            flexShrink: 0,
            width: "100%",
          }}
        >
          <SidebarIconBtn icon={Search} label="Search" />
        </div>

        {/* Two nav groups separated by a 12px gap. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "flex-start",
            flexShrink: 0,
            width: "100%",
          }}
        >
          {/* Activity & agents — Activity icon (64×52) + four 64×64 avatar
              buttons. Detection is the active row. */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0 8px",
              flexShrink: 0,
              width: "100%",
            }}
          >
            <CollapsedNavBtn label="Activity" icon={Activity} />
            <CollapsedNavBtn
              label="Detection"
              avatarUrl="/Avatar_Sean.png"
              active
            />
            <CollapsedNavBtn label="Investigation" avatarUrl="/Avatar_Helen.png" />
            <CollapsedNavBtn label="Hunting" avatarUrl="/Avatar_Helen.png" />
            <CollapsedNavBtn label="Validation" avatarUrl="/Avatar_Valery.png" />
          </nav>

          {/* Categories — three 64×52 icon buttons. Per the Figma the icons
              switch from User / Database / Settings (expanded rail) to
              BookOpen / Brain / Settings in the collapsed rail. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              width: "100%",
            }}
          >
            <CollapsedNavBtn label="Customer Profile" icon={BookOpen} />
            <CollapsedNavBtn label="Memory" icon={Brain} />
            <CollapsedNavBtn label="Settings" icon={Settings} />
          </div>
        </div>
      </div>

      {/* Bottom row — 64-tall, with the 34×34 PanelLeftOpen toggle centered. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: 64,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: "100%",
        }}
      >
        <SidebarIconBtn
          icon={PanelLeftOpen}
          label="Expand sidebar"
          onClick={onExpand}
        />
      </div>
    </aside>
  );
}

// Sidebar is now a controlled component — collapsed state is owned by
// DetectionPage so other UI (FloatingStatusPills' fixed left position) can
// react to it. The toggle button still wires to the same onToggle callback.
function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const toggle = onToggle;

  if (collapsed) {
    return <CollapsedSidebar onExpand={toggle} />;
  }

  return (
    <aside
      style={{
        // Width/bg/radius/margin live on the wrapper in DetectionPage so they
        // can transition across the collapsed/expanded swap. This aside is
        // just the content layout — full wrapper width + height, flex-column
        // with the brand row, lists wrapper, spacer, and bottom row stacked
        // top to bottom.
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 24,
        flex: 1,
        alignSelf: "stretch",
      }}
    >
      <div
        style={{
          alignSelf: "stretch",
          minHeight: 56,
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            margin: "8px 6px 8px 10px",
            padding: "6px 6px 6px 4px",
            display: "inline-flex",
            alignItems: "center",
          }}
          aria-label="Joon"
        >
          <svg width={78} height={20} viewBox="0 0 90 23" fill="none" role="img">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M54.5042 0.0995671C60.9088 0.0995671 66.1008 5.226 66.1008 11.5498C66.1008 17.8736 60.9088 23 54.5042 23C48.0996 23 42.9076 17.8736 42.9076 11.5498C42.9076 5.226 48.0996 0.0995671 54.5042 0.0995671ZM54.5042 4.67965C50.6614 4.67965 47.5462 7.75552 47.5462 11.5498C47.5462 15.3441 50.6614 18.4199 54.5042 18.4199C58.347 18.4199 61.4622 15.3441 61.4622 11.5498C61.4622 7.75552 58.347 4.67965 54.5042 4.67965Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M28.6891 0.0995671C35.0937 0.0995671 40.2857 5.226 40.2857 11.5498C40.2857 17.8736 35.0937 23 28.6891 23C22.2844 23 17.0924 17.8736 17.0924 11.5498C17.0924 5.226 22.2844 0.0995671 28.6891 0.0995671ZM28.6891 4.67965C24.8463 4.67965 21.7311 7.75552 21.7311 11.5498C21.7311 15.3441 24.8463 18.4199 28.6891 18.4199C32.5319 18.4199 35.6471 15.3441 35.6471 11.5498C35.6471 7.75552 32.5319 4.67965 28.6891 4.67965Z"
              fill="white"
            />
            <path
              d="M79.4118 0C85.2595 0 90 4.68066 90 10.4545V22.8009H85.3613V10.4545C85.3613 7.21017 82.6976 4.58009 79.4118 4.58009C76.1259 4.58009 73.4622 7.21017 73.4622 10.4545V22.8009H68.8235V10.4545C68.8235 4.68066 73.564 0 79.4118 0Z"
              fill="white"
            />
            <path
              d="M14.1176 15.7316C14.1176 19.5809 10.9573 22.7013 7.05882 22.7013C3.16034 22.7013 0 19.5809 0 15.7316V14.0028H4.63866V15.7316C4.63866 17.0513 5.7222 18.1212 7.05882 18.1212C8.39545 18.1212 9.47899 17.0513 9.47899 15.7316V0.298701H14.1176V15.7316Z"
              fill="white"
            />
          </svg>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SidebarIconBtn icon={Search} label="Search" />
          <SidebarIconBtn icon={Plus} label="Add" />
        </div>
      </div>

      {/* Lists layout — wrapper around the main nav + Workspace section.
          Spacing rule: 24px between lists (matches the sidebar's outer gap),
          padding lives on each inner list (0 8px) not on this wrapper. */}
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        {/* Main nav — list without title (4px gap between rows). */}
        <nav
          style={{
            alignSelf: "stretch",
            padding: "0 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          <NavRow label="Activity" icon={Activity} />
          <NavRow label="Detection" avatarUrl="/Avatar_Sean.png" active />
          <NavRow label="Investigation" avatarUrl="/Avatar_Helen.png" />
          <NavRow label="Hunting" avatarUrl="/Avatar_Helen.png" />
          <NavRow label="Validation" avatarUrl="/Avatar_Valery.png" />
        </nav>

        {/* Workspace — list with title (4px gap, tighter so the title binds
            to its items). */}
        <div
          style={{
            alignSelf: "stretch",
            padding: "0 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          <div
            style={{
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "stretch",
            }}
          >
            <span
              style={{
                fontFamily: FONT_INTER,
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "20px",
                letterSpacing: "-0.2px",
                color: "#858a94",
              }}
            >
              Workspace
            </span>
            <ChevronDown size={12} strokeWidth={1.75} color="#858a94" />
          </div>
          <NavRow label="Customer Profile" icon={BookOpen} />
          <NavRow label="Memory" icon={Brain} />
          <NavRow label="Settings" icon={Settings} />
        </div>
      </div>

      <div style={{ flex: 1, alignSelf: "stretch" }} />

      <div
        style={{
          alignSelf: "stretch",
          padding: "6px 8px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <SidebarIconBtn
          icon={PanelLeftClose}
          label="Collapse sidebar"
          onClick={toggle}
        />
        <span
          style={{
            marginLeft: "auto",
            padding: "0 6px",
            fontFamily: FONT_MONO,
            fontWeight: 400,
            fontSize: 10,
            lineHeight: "16px",
            letterSpacing: "-0.2px",
            color: "#5e6370",
          }}
        >
          v0.43.2
        </span>
      </div>
    </aside>
  );
}

// ─── StatusBar ────────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <header
      style={{
        alignSelf: "stretch",
        background: "#1a1c22",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div
          role="img"
          aria-label="Dawn — Detection Engineering"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#292b31",
            backgroundImage: "url('/Avatar_Dawn.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span
            style={{
              ...T_BODY,
              color: "#f2f4f7",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Detection Engineering <span style={{ color: "#5e6370" }}>·</span> Dawn
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#03d07d",
                boxShadow: "0 0 0 2px rgba(3,208,125,0.25)",
                flexShrink: 0,
              }}
            />
            <span style={{ ...T_BODY, color: "#b4b9c2" }}>Active</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span
          style={{
            ...T_CAPTION,
            background: "#1f2126",
            border: "1px solid #23252a",
            borderRadius: 100,
            padding: "8px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b4b9c2",
          }}
        >
          ⌘K
        </span>

        <button
          type="button"
          style={{
            ...T_BODY_MED,
            background: "#1f2126",
            border: "1px solid #23252a",
            borderRadius: 100,
            padding: "8px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color: "#f2f4f7",
            cursor: "pointer",
          }}
        >
          <Calendar size={12} strokeWidth={1.75} />
          <span>Last 7 days</span>
          <ChevronDown size={12} strokeWidth={1.75} />
        </button>

        <span style={{ ...T_BODY, color: "#858a94" }}>Updated 2h ago</span>
      </div>
    </header>
  );
}

// ─── FloatingStatusPills ──────────────────────────────────────────────────────
// Replaces the StatusBar once MainContent has scrolled past it. Two glass pills
// fixed at the top of the viewport (left = identity, right = actions). The
// outer overlay is `pointer-events: none` so cards beneath stay interactive;
// each pill turns pointer-events back on while visible.

function FloatingStatusPills({
  visible,
  sidebarCollapsed,
}: {
  visible: boolean;
  sidebarCollapsed: boolean;
}) {
  // Tracks the sidebar's actual rendered width:
  //   expanded  → 232 + 12 (shell padding-left) + 20 (shell-gap) = 264
  //   collapsed → 44  + 12 + 20 = 76
  // Without this the pills stay anchored to the wide-sidebar position
  // even after the user collapses the rail, leaving a 188px gap on the left.
  const left = sidebarCollapsed ? 76 : 264;
  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        top: 12,
        left,
        right: 0,
        // 200ms ease on `left` so the pills slide along with the sidebar's
        // collapse/expand animation instead of jumping.
        transition:
          "opacity 200ms ease, transform 200ms ease, left 200ms ease",
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      {/* Inner mirrors `.main`'s geometry so the pills' left/right edges
          line up with the MainContent cards exactly: same max-width: 1600,
          same padding-right: 12, centered inside the fixed outer (which
          spans from the sidebar's right edge to the viewport's right). */}
      <div
        style={{
          width: "100%",
          maxWidth: 1600,
          paddingLeft: 8,
          paddingRight: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flex: "1 0 0",
        }}
      >
        {/* LEFT PILL — identity */}
        <div
          style={{
            ...STATUS_PILL_GLASS,
            padding: "12px 24px 12px 12px",
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          <div
            role="img"
            aria-label="Dawn — Detection Engineering"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#292b31",
              backgroundImage: "url('/Avatar_Dawn.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span
              style={{
                ...T_BODY,
                color: "#f2f4f7",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Detection Engineering <span style={{ color: "#5e6370" }}>·</span> Dawn
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#03d07d",
                  boxShadow: "0 0 0 2px rgba(3,208,125,0.25)",
                  flexShrink: 0,
                }}
              />
              <span style={{ ...T_BODY, color: "#b4b9c2" }}>Active</span>
            </div>
          </div>
        </div>

        {/* RIGHT PILL — actions */}
        <div
          style={{
            ...STATUS_PILL_GLASS,
            padding: 12,
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          <span
            style={{
              ...T_CAPTION,
              background: "#1f2126",
              border: "1px solid #23252a",
              borderRadius: 100,
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b4b9c2",
            }}
          >
            ⌘K
          </span>

          <button
            type="button"
            style={{
              ...T_BODY_MED,
              background: "#1f2126",
              border: "1px solid #23252a",
              borderRadius: 100,
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "#f2f4f7",
              cursor: "pointer",
            }}
          >
            <Calendar size={12} strokeWidth={1.75} />
            <span>Last 7 days</span>
            <ChevronDown size={12} strokeWidth={1.75} />
          </button>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#858a94",
            }}
          >
            <RefreshCw size={12} strokeWidth={1.75} />
            <span style={{ ...T_BODY }}>Updated 2h ago</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Card primitives ──────────────────────────────────────────────────────────

function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#1a1c22",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "20px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={T_HEADING}>{title}</span>
        {subtitle && (
          <span style={{ ...T_BODY, color: "#858a94" }}>{subtitle}</span>
        )}
      </div>
      {right && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {right}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  label,
  children,
  background = "#292b31",
}: {
  label: string;
  children: React.ReactNode;
  // Optional bg override. Defaults to the canonical `#292b31` chip colour;
  // pass `#1f2126` for the H&P jira button which uses a darker variant.
  background?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        width: 34,
        height: 34,
        borderRadius: 100,
        background,
        border: "1px solid #23252a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        color: "#b4b9c2",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function DeltaBadge({ text }: { text: string }) {
  return (
    <span
      style={{
        ...T_CAPTION,
        borderRadius: 999,
        padding: "2px 6px",
        background: "rgba(104,238,118,0.05)",
        color: "#68ee76",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {text}
    </span>
  );
}

function RunningBadge({ text }: { text: string }) {
  return (
    <span
      style={{
        ...T_CAPTION,
        position: "relative",
        borderRadius: 999,
        height: 22,
        padding: "2px 10px 2px 6px",
        background: "rgba(3,208,125,0.05)",
        color: "#03d07d",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Animated 1px gradient ring. Sits as an absolute overlay over the
          pill; the rotating conic-gradient is masked to the 1px outer ring
          via two mask layers composited with `exclude` (border-box minus
          content-box). This keeps the gradient strictly on the border and
          leaves the pill's translucent green bg untouched — without the mask,
          the conic shows through the 5%-alpha fill and the whole pill ends up
          tinted by the gradient instead of just the stroke. The conic's
          `from` angle is a registered @property (--joon-rb-angle) so it
          interpolates smoothly inside the joon-rb-spin keyframes. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          padding: "0.8px",
          background:
            "conic-gradient(from var(--joon-rb-angle, 0deg), #B6E8D4, rgba(182,232,212,0.25), #B6E8D4, rgba(182,232,212,0.25), #B6E8D4)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          animation: "joon-rb-spin 3s linear infinite",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: "#03d07d",
          boxShadow: "0 0 0 2px rgba(3,208,125,0.25)",
          flexShrink: 0,
        }}
      />
      {text}
    </span>
  );
}

// QueueSpinner — 16×16 ring with no fill, only a 2px gradient stroke that
// rotates. Reuses the same `--joon-rb-angle` registered @property + the
// `joon-rb-spin` keyframes that the RunningBadge ring uses (defined inline at
// the page root), so any future tweak to the spin cadence flows through both.
// Mask technique: two linear-gradient mask layers composited with `exclude`
// (border-box minus content-box) carve the 2px ring shape; the conic-gradient
// behind it provides the moving green head.
function QueueSpinner() {
  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        flexShrink: 0,
        borderRadius: 999,
        padding: 2,
        background:
          "conic-gradient(from var(--joon-rb-angle, 0deg), #03d07d, rgba(3,208,125,0.15), #03d07d, rgba(3,208,125,0.15), #03d07d)",
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        maskComposite: "exclude",
        animation: "joon-rb-spin 3s linear infinite",
        pointerEvents: "none",
      }}
    />
  );
}

// Neutral pill — used for connector overflow indicators ("+2"), accordion
// counts ("3"), and (with size="md") the WorkloadDistribution Category chip.
// `size` controls horizontal padding only; vertical padding stays 2px.
function NeutralBadge({
  text,
  size = "sm",
}: {
  text: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <span
      style={{
        ...T_CAPTION,
        borderRadius: 999,
        padding: size === "md" ? "2px 10px" : "2px 6px",
        background: "rgba(255,255,255,0.05)",
        color: "#858a94",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {text}
    </span>
  );
}

function ConnectorChip({
  label,
  color,
  logo,
}: {
  label: string;
  color: string;
  logo?: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "flex",
        padding: "2px 8px 2px 2px",
        alignItems: "center",
        gap: 4,
        borderRadius: 100,
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          display: "flex",
          width: 20,
          height: 20,
          padding: 4,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderRadius: 100,
          background: "#1e2026",
          flexShrink: 0,
        }}
      >
        {logo ?? (
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              background: color,
            }}
          />
        )}
      </span>
      <span style={{ ...T_BODY, color: "#858a94" }}>{label}</span>
    </span>
  );
}

// ─── Health & Performance ─────────────────────────────────────────────────────
//
// Card structure:
//   ┌────────────────────────────────────────────────────────────────────┐
//   │ Header: title + subtitle  ····················  Jira IconBtn        │
//   ├──────────────────────────┬─────────────────────────────────────────┤
//   │                          │ Telemetry uptime  ··········  ↑ 1.6%    │
//   │     Total rules          │ 98%  ─────────────────  sparkline       │
//   │     730 / 1,250          ├──────────────┬──────────────────────────┤
//   │     [stacked bar]        │ Telemetry    │ Response time            │
//   │     ● Deployed   210     │ completeness │ 4.2h  To fix             │
//   │     ● Proposals  95      │ 98%          ├──────────────────────────┤
//   │     ● In test    72      │ [dot grid]   │ 18.5h  To close gaps     │
//   │                          │              │                          │
//   └──────────────────────────┴──────────────┴──────────────────────────┘
//
// Helpers used: <StackedRulesBar>, <RulesBreakdownRow>, <Sparkline>, <DotGrid>.

// Stacked progress bar — three segments matching the Figma: gradient deep→
// brand green (Deployed), light green (Proposals), ice white sliver (In test).
// Asymmetric corner radii so the outer edges round off (8px) and inner edges
// stay crisp (2px). Reusable: pass any 3-segment data; for now widths are
// visual-fixed per design.
function StackedRulesBar() {
  return (
    <div
      style={{
        alignSelf: "stretch",
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 22,
        padding: 4,
        borderRadius: 100,
        background: "#23252a",
      }}
    >
      {/* Deployed (fills) — green vertical gradient */}
      <span
        style={{
          flex: "1 0 0",
          minWidth: 0,
          height: "100%",
          background: "linear-gradient(to bottom, #99ffa3, #68ee76)",
          borderRadius: "30px 4px 4px 30px",
        }}
      />
      {/* Proposals — fixed 59 wide, blue gradient */}
      <span
        style={{
          width: 59,
          height: "100%",
          background: "linear-gradient(to bottom, #7ad3ff, #4fbaf0)",
          borderRadius: 4,
          flexShrink: 0,
        }}
      />
      {/* In test — fixed 23 wide, orange gradient */}
      <span
        style={{
          width: 23,
          height: "100%",
          background: "linear-gradient(to bottom, #ff9364, #f25f33)",
          borderRadius: "4px 30px 30px 4px",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

// Breakdown row — colored dot, label, value. Two flex children: a 10×10 dot
// (centered vertically) and a fill panel that holds the label (left) and the
// value (right) on opposite ends via `justify-content: space-between`. Value
// uses `T_VALUE` (Inter SemiBold 14 / 16); label uses `T_BODY`. The 4px gap
// between the dot and the right panel matches the Figma spec.
//
// Separator between rows is rendered by the parent (as a sibling flex item)
// instead of nested inside the row, so the parent's
// `justify-content: space-between` can distribute rows AND separators evenly
// across the available height.
function RulesBreakdownRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        alignSelf: "stretch",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: "1 0 0",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ ...T_BODY, color: "#b4b9c2" }}>{label}</span>
        <span style={T_VALUE}>{value}</span>
      </div>
    </div>
  );
}

// Hairline separator used between breakdown rows. Sibling-rendered (not
// nested in RulesBreakdownRow) so it participates in the parent's
// justify-content: space-between distribution.
function RulesBreakdownSeparator() {
  return (
    <div
      style={{
        alignSelf: "stretch",
        height: 1,
        background: "#23252a",
      }}
    />
  );
}

// Sparkline — smooth-ish polyline over normalized data. Reusable: pass any
// `data: number[]` and the curve scales to the SVG height. Stroke uses brand
// green by default. Uses viewBox + preserveAspectRatio="none" so the curve
// stretches horizontally to fit any container width.
function Sparkline({
  data,
  height = 68,
  color = "#68ee76",
  strokeWidth = 4,
  lineAreaHeight = 40,
  lineTopOffset = 16,
}: {
  data: number[];
  height?: number;
  color?: string;
  strokeWidth?: number;
  // Vertical range the line traces inside the SVG (highest data point at the
  // top of this band, lowest at the bottom).
  lineAreaHeight?: number;
  // Padding above the line area inside the SVG. Below the line area, the
  // gradient fill extends down to the SVG's bottom edge — that's the bit
  // that gives the chart visual weight under the curve.
  lineTopOffset?: number;
}) {
  const gradientId = useId();
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 300; // viewBox width — actual rendered width controlled by parent

  // Line points: each data value normalises into the `lineAreaHeight` band,
  // offset down by `lineTopOffset`. Highest value sits at lineTopOffset;
  // lowest sits at lineTopOffset + lineAreaHeight.
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = lineTopOffset + lineAreaHeight - ((v - min) / range) * lineAreaHeight;
    return { x, y };
  });
  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  // Closed polygon for the fill: line points + go down to bottom-right + bottom-left.
  const fillPoints = `${linePoints} ${w},${height} 0,${height}`;

  return (
    <svg
      width={w}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      // flex: 1 0 0 lets the sparkline grow to fill its flex parent and shrink
      // below the SVG's intrinsic 300px width in narrower containers — paired
      // with vector-effect: non-scaling-stroke on the polyline so the line
      // stays at the requested px width regardless of horizontal scale.
      style={{ display: "block", flex: "1 0 0", minWidth: 0, height }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Dot grid — N×M grid of 4×4 dots, with `filled` count rendered in brand
// green and the remainder dimmed. Reusable for any "out of 100" visualization.
function DotGrid({
  filled,
  total = 100,
  columns = 25,
  dotSize = 4,
  gap = 4,
}: {
  filled: number;
  total?: number;
  columns?: number;
  dotSize?: number;
  gap?: number;
}) {
  const rows = Math.ceil(total / columns);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap }}>
          {Array.from({ length: columns }).map((_, c) => {
            const idx = r * columns + c;
            if (idx >= total) return null;
            const isFilled = idx < filled;
            return (
              <span
                key={c}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: 999,
                  background: isFilled ? "#03d07d" : "rgba(3,208,125,0.20)",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Stat data-line used inside Response time. Number+unit stacks on top of the
// caption (flex-col, justify-end, align-start, alignSelf stretch). Sized to
// content, but full-width via alignSelf so the parent's space-between can
// position both lines symmetrically.
function ResponseTimeRow({
  value,
  unit,
  caption,
}: {
  value: string;
  unit: string;
  caption: string;
}) {
  // Always vertical (number on top, caption below). The data block around
  // these rows flips between column-stack (with separator) and row (two
  // rows side-by-side, no separator) via a container query — see
  // `.response-time-data` and `.response-time-row` in globals.css.
  return (
    <div className="response-time-row">
      <span style={T_STAT_MED}>
        {value}
        <span style={{ ...T_BODY_SEMI, fontWeight: 700 }}>{unit}</span>
      </span>
      <span style={{ ...T_BODY, color: "#b4b9c2" }}>{caption}</span>
    </div>
  );
}

function HealthAndPerformance({ style }: { style?: React.CSSProperties }) {
  // Sample sparkline data — gentle upward trend matching the Figma reference.
  // Replace with real time-series data when wiring up.
  const sparklineData = [55, 58, 56, 60, 64, 67, 70, 72, 71, 75, 80, 84, 87, 92, 95, 98];

  return (
    <Card
      style={{
        alignSelf: "stretch",
        // Asymmetric padding (24 top, 20 right/bottom/left) + 20px gap
        // between the header and the body — both per the new Figma. The
        // header is inlined here (CardHeader's built-in `20 20 0` padding
        // doesn't fit this card's frame).
        padding: "24px 20px 20px",
        gap: 20,
        ...style,
      }}
    >
      {/* Header — inlined. Title is Inter Bold 18 (heavier than the standard
          T_HEADING used by other cards) per Figma; subtitle is the canonical
          T_BODY pattern. The Jira IconBtn uses the darker `#1f2126` chip bg
          variant and a 16×16 icon (vs the standard 14×14). */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            flex: "1 0 0",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONT_INTER,
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "normal",
              letterSpacing: "0.06px",
              color: "#ffffff",
            }}
          >
            Health & Performance
          </span>
          <span style={{ ...T_BODY, color: "#858a94", letterSpacing: "0.06px" }}>
            Overview of the agent and the system
          </span>
        </div>
        <IconBtn
          label="Open Health & Performance in Jira"
          background="#1f2126"
        >
          <img
            src="/jira_icon.svg"
            alt=""
            width={16}
            height={16}
            style={{ display: "block" }}
          />
        </IconBtn>
      </div>

      {/* Body — see `.hpBody` in main-content.module.css. Flex column by
          default; switches to a 50/50 grid at ≥800px so Total Rules and
          Telemetry stack share the body width exactly evenly. */}
      <div className={mainContentStyles.hpBody}>
        {/* LEFT: Total Rules — fills 50% of the body width via the parent grid */}
        <div
          style={{
            ...INNER_CARD,
            flex: "1 0 0",
            minWidth: 0,
            padding: "20px 24px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ ...T_BODY, color: "#b4b9c2" }}>Total rules</span>
            <DeltaBadge text="↑ 1.6%" />
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={T_DISPLAY}>730</span>
            <span style={{ ...T_BODY, color: "#858a94" }}>/ 1,250</span>
          </div>

          {/* Bar + list share a wrapper that flex-grows to fill the remaining
              height of the Total Rules panel. Bar sits at the top; list takes
              the rest and uses justify-content: space-between so the 3 rows
              + 2 separators distribute evenly down the available height. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 24,
              flex: "1 0 0",
              alignSelf: "stretch",
            }}
          >
            <StackedRulesBar />

            <div
              style={{
                display: "flex",
                padding: "0 8px",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                flex: "1 0 0",
                alignSelf: "stretch",
              }}
            >
              {/* Dot colors match the dominant (darker) end of each segment's
                  gradient in the new StackedRulesBar — green / blue / orange. */}
              <RulesBreakdownRow color="#68ee76" label="Deployed"  value="210" />
              <RulesBreakdownSeparator />
              <RulesBreakdownRow color="#4fbaf0" label="Proposals" value="95"  />
              <RulesBreakdownSeparator />
              <RulesBreakdownRow color="#f25f33" label="In test"   value="72"  />
            </div>
          </div>
        </div>

        {/* RIGHT: Telemetry stack — CSS Grid. Top row pinned to 144px
            (Telemetry uptime), bottom row takes the remaining height. See
            `.hpTelemetryStack` in main-content.module.css. */}
        <div className={mainContentStyles.hpTelemetryStack}>
          {/* Top: Telemetry uptime — big stat + sparkline, fixed 144px tall. */}
          <div
            style={{
              ...INNER_CARD,
              padding: 20,
              minHeight: 0,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "clip",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ ...T_BODY, color: "#b4b9c2" }}>Telemetry uptime</span>
              <DeltaBadge text="↑ 1.6%" />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", flexShrink: 0 }}>
                <span style={T_STAT_NUM}>98</span>
                <span style={T_STAT_UNIT}>%</span>
              </div>
              <Sparkline data={sparklineData} />
            </div>
          </div>

          {/* Bottom: Telemetry completeness + Response time */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flex: "1 0 0",
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {/* Telemetry completeness — content-sized */}
            <div
              style={{
                ...INNER_CARD,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "clip",
                flexShrink: 0,
              }}
            >
              <span style={{ ...T_BODY, color: "#b4b9c2" }}>
                Telemetry completeness
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={T_STAT_MED}>
                  98
                  <span style={{ ...T_BODY_SEMI, fontWeight: 700 }}>%</span>
                </span>
                <DotGrid filled={98} />
              </div>
            </div>

            {/* Response time — fills remaining width. The card carries the
                `response-time-card` class which sets `container-type: inline-size`
                so the inner data block can flip layout via a container query
                instead of a viewport media query (the Figma's two variants
                differ on the *card* width, not the viewport). At ≥220px wide
                the data block becomes a 2-column row (no separator); below
                that it stays vertical with a 1px separator between rows. */}
            <div
              className="response-time-card"
              style={{
                ...INNER_CARD,
                padding: 20,
                flex: "1 0 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "clip",
                minWidth: 0,
              }}
            >
              <span style={{ ...T_BODY, color: "#b4b9c2" }}>Response time</span>
              <div className="response-time-data">
                <ResponseTimeRow value="4.2" unit="h" caption="To fix" />
                <div className="response-time-separator" aria-hidden />
                <ResponseTimeRow value="18.5" unit="h" caption="To close gaps" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Active Workload Queue ────────────────────────────────────────────────────

function ActiveWorkloadQueue({ style }: { style?: React.CSSProperties }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  function toggle(i: number) {
    setExpandedIndex((prev) => (prev === i ? null : i));
  }

  return (
    <Card style={style}>
      <CardHeader
        title="Active Workload Queue"
        subtitle={
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <QueueSpinner />
            3 Active detections
          </span>
        }
        right={
          <>
            <ConnectorChip
              label="Jira"
              color="#2684ff"
              logo={
                <img
                  src="/jira_icon.svg"
                  alt=""
                  width={12}
                  height={12}
                  style={{ display: "block" }}
                />
              }
            />
            <ConnectorChip
              label="CrowdStrike Falcon"
              color="#da1b1b"
              logo={
                <img
                  src="/crowdstrike_icon.svg"
                  alt=""
                  width={12}
                  height={12}
                  style={{ display: "block" }}
                />
              }
            />
            <NeutralBadge text="+2" />
          </>
        }
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {WORKLOAD_GROUPS.map((group, i) => {
          const isOpen = expandedIndex === i;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column" }}>
              <div style={INNER_CARD}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    {isOpen ? (
                      <ChevronDown size={12} strokeWidth={1.75} color="#858a94" style={{ flexShrink: 0 }} />
                    ) : (
                      <ChevronRight size={12} strokeWidth={1.75} color="#858a94" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ ...T_BODY_MED, color: "#f2f4f7", textAlign: "left" }}>
                      {group.label}
                    </span>
                  </div>
                  {group.runningBadge ? (
                    <RunningBadge text={group.runningBadge} />
                  ) : (
                    <NeutralBadge text={group.count} />
                  )}
                </button>
              </div>

              {group.children && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                    transition:
                      "grid-template-rows 200ms ease, opacity 160ms ease",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    position: "relative",
                    padding: "16px 14px 12px 38px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      pointerEvents: "none",
                    }}
                  >
                    {group.children.map((_, idx, arr) => {
                      const isFirst = idx === 0;
                      const isLast = idx === arr.length - 1;
                      const isOnly = isFirst && isLast;
                      const height = isFirst ? 27 : 34;
                      let d: string;
                      if (isOnly) {
                        d = "M0.5 0V19C0.5 23.4183 4.08172 27 8.5 27H14";
                      } else if (isFirst) {
                        d = "M0.5 0V27M0.5 19C0.5 23.4183 4.08172 27 8.5 27H14";
                      } else if (isLast) {
                        d = "M0.5 0V26C0.5 30.4183 4.08172 34 8.5 34H14";
                      } else {
                        d = "M0.5 0V34M0.5 26C0.5 30.4183 4.08172 34 8.5 34H14";
                      }
                      return (
                        <svg
                          key={idx}
                          width={20}
                          height={height}
                          viewBox={`0 0 20 ${height}`}
                          fill="none"
                          style={{ display: "block", flexShrink: 0, overflow: "visible" }}
                        >
                          <path d={d} stroke="#292b31" />
                        </svg>
                      );
                    })}
                  </div>
                  {group.children.map((child) => (
                    <div
                      key={child.id}
                      style={{
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: 1,
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg, rgba(151,71,255,0.15), rgba(204,165,255,0.15))",
                            flexShrink: 0,
                          }}
                        >
                        <span
                          style={{
                            display: "flex",
                            padding: "2px 8px",
                            alignItems: "center",
                            gap: 4,
                            borderRadius: 999,
                            backgroundColor: "#1a1c22",
                            backgroundImage:
                              "linear-gradient(rgba(151,71,255,0.05), rgba(151,71,255,0.05))",
                          }}
                        >
                          <svg width={14} height={14} viewBox="0 0 14 14" fill="none" role="img" aria-hidden="true">
                            <path
                              d="M9.02399 3.19064C9.19485 3.01979 9.47179 3.01979 9.64265 3.19064L13.1426 6.69064C13.3135 6.8615 13.3135 7.13844 13.1426 7.30929L9.64265 10.8093C9.47179 10.9801 9.19485 10.9801 9.02399 10.8093C8.85314 10.6384 8.85314 10.3615 9.02399 10.1906L12.2147 6.99997L9.02399 3.80929C8.85314 3.63844 8.85314 3.3615 9.02399 3.19064Z"
                              fill="#9747ff"
                            />
                            <path
                              d="M4.35733 3.19064C4.52818 3.01979 4.80513 3.01979 4.97598 3.19064C5.14683 3.3615 5.14683 3.63844 4.97598 3.80929L1.78531 6.99997L4.97598 10.1906C5.14683 10.3615 5.14683 10.6384 4.97598 10.8093C4.80513 10.9801 4.52818 10.9801 4.35733 10.8093L0.857328 7.30929C0.686473 7.13844 0.686473 6.8615 0.857328 6.69064L4.35733 3.19064Z"
                              fill="#9747ff"
                            />
                          </svg>
                          <span
                            style={{
                              ...T_MONO_SMALL,
                              textAlign: "right",
                              backgroundImage:
                                "linear-gradient(90deg, #9747ff 0%, #b67eff 50%, #9747ff 100%)",
                              backgroundSize: "200% 100%",
                              backgroundRepeat: "repeat",
                              animationName: "joon-shimmer",
                              animationDuration: "2.5s",
                              animationTimingFunction: "linear",
                              animationIterationCount: "infinite",
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {child.id}
                          </span>
                        </span>
                        </span>
                        <span
                          style={{
                            ...T_BODY,
                            backgroundImage:
                              "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, #ffffff 50%, rgba(255,255,255,0.25) 100%)",
                            backgroundSize: "200% 100%",
                            backgroundRepeat: "repeat",
                            animationName: "joon-shimmer",
                            animationDuration: "2.5s",
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {child.name}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 64, flexShrink: 0 }}>
                        <span style={{ ...T_CAPTION, color: "#03d07d", width: 94, flexShrink: 0 }}>
                          {child.status}
                          <span
                            style={{
                              animationName: "joon-dot-1",
                              animationDuration: "1.5s",
                              animationTimingFunction: "step-end",
                              animationIterationCount: "infinite",
                            }}
                          >
                            .
                          </span>
                          <span
                            style={{
                              animationName: "joon-dot-2",
                              animationDuration: "1.5s",
                              animationTimingFunction: "step-end",
                              animationIterationCount: "infinite",
                            }}
                          >
                            .
                          </span>
                          <span
                            style={{
                              animationName: "joon-dot-3",
                              animationDuration: "1.5s",
                              animationTimingFunction: "step-end",
                              animationIterationCount: "infinite",
                            }}
                          >
                            .
                          </span>
                        </span>
                        <span style={{ ...T_MONO_SMALL, color: "#858a94" }}>{child.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Proposal Drivers ─────────────────────────────────────────────────────────

function ProposalRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr 36px",
        alignItems: "center",
        gap: 12,
        alignSelf: "stretch",
      }}
    >
      <span style={{ ...T_BODY, color: "#b4b9c2" }}>{label}</span>
      <div style={{ position: "relative", height: 14 }}>
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 1,
            background: "#1a1c22",
            transform: "translateY(-50%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            height: 1.5,
            width: `${pct}%`,
            background: "#f2f4f7",
            transform: "translateY(-50%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: `${pct}%`,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "#f2f4f7",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <span style={{ ...T_BODY_SEMI, color: "#f2f4f7", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ProposalDrivers({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <Card style={style} className={className}>
      {/* Body wrapper — padded frame holding the header + content card.
          CardHeader isn't used here because its own padding ("20px 20px 0")
          doesn't fit this card's frame: the design wants the header to live
          inside the same padding box as the content card, separated by a
          20px gap, so the header content is inlined. Top is 24 (matches the
          asymmetric top-padding pattern used by Health & Performance) and
          sides + bottom are the canonical 20. */}
      <div
        style={{
          display: "flex",
          padding: "24px 20px 20px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 20,
          flex: "1 0 0",
          minHeight: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            alignSelf: "stretch",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={T_HEADING}>Proposal Drivers</span>
            <span style={{ ...T_BODY, color: "#858a94" }}>Sub handled</span>
          </div>
          <IconBtn label="Open Proposal Drivers">
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </IconBtn>
        </div>
        <div
          style={{
            ...INNER_CARD,
            display: "flex",
            padding: 24,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flex: "1 0 0",
            alignSelf: "stretch",
          }}
        >
          {PROPOSAL_DRIVERS.map((row) => (
            <ProposalRow key={row.label} {...row} />
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Teamwork ─────────────────────────────────────────────────────────────────

function Teamwork({ style }: { style?: React.CSSProperties }) {
  return (
    <Card style={style}>
      <CardHeader
        title="Teamwork"
        subtitle="2 Tasks since yesterday"
        right={
          <IconBtn label="Open Teamwork">
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </IconBtn>
        }
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {TEAMWORK_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              ...INNER_CARD,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ position: "relative", width: 51, height: 30, flexShrink: 0 }}>
              <span
                role="img"
                aria-label="From"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  backgroundColor: "#1a1c22",
                  backgroundImage: `url('${item.fromAvatar}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "2px solid #1e2026",
                }}
              />
              <span
                role="img"
                aria-label="To"
                style={{
                  position: "absolute",
                  left: 21,
                  top: 0,
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  backgroundColor: "#1a1c22",
                  backgroundImage: `url('${item.toAvatar}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "2px solid #1e2026",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <span style={{ ...T_BODY_MED, color: "#f2f4f7" }}>{item.title}</span>
              <span style={{ ...T_CAPTION, color: "#858a94" }}>{item.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Last Covered ─────────────────────────────────────────────────────────────

function LastCovered({ style }: { style?: React.CSSProperties }) {
  return (
    <Card style={style}>
      <CardHeader
        title="Last Covered"
        subtitle="Covered by Dawn"
        right={
          <IconBtn label="Open Last Covered">
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </IconBtn>
        }
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {LAST_COVERED.map((row, i) => (
          <div
            key={i}
            style={{
              ...INNER_CARD,
              display: "flex",
              padding: "12px 16px",
              alignItems: "center",
              gap: 12,
              alignSelf: "stretch",
            }}
          >
            <span
              style={{
                ...T_BODY,
                color: "#f2f4f7",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.name}
            </span>
            <span
              style={{
                ...T_CAPTION_MED,
                borderRadius: 999,
                padding: "2px 8px",
                background: "var(--green-bg)",
                color: "var(--green)",
                flexShrink: 0,
              }}
            >
              Deployed
            </span>
            <span
              style={{
                ...T_MONO_SMALL,
                color: "#858a94",
                flexShrink: 0,
                width: 48,
                textAlign: "right",
              }}
            >
              {row.date}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Detection Coverage Heatmap ───────────────────────────────────────────────

// ─── HeatmapCell ──────────────────────────────────────────────────────────────
// One tile in the heatmap grid. Wraps the canonical INNER_CARD shape (8px
// radius, fixed 52px height) and overrides the bg per coverage tier. An "empty"
// cell (tier === null) renders as a flat dark tile with no accent bar and no
// text — matches Figma's no-detection placeholder.

function HeatmapCell({ cell }: { cell: HeatmapCellData }) {
  const tier = cell.tier ? HEATMAP_TIERS[cell.tier] : null;
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  if (!tier) {
    return (
      <div
        style={{
          ...INNER_CARD,
          background: HEATMAP_EMPTY_BG,
          height: HEATMAP_CELL_HEIGHT,
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      />
    );
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMove}
      style={{
        ...INNER_CARD,
        background: tier.bg,
        height: HEATMAP_CELL_HEIGHT,
        padding: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          width: 2,
          alignSelf: "stretch",
          borderRadius: 100,
          background: tier.bar,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: "1 0 0",
        }}
      >
        <span
          style={{
            ...T_BODY,
            color: "#f2f4f7",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.id}
        </span>
        <span
          style={{
            ...T_CAPTION,
            color: "rgba(242,244,247,0.5)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.name}
        </span>
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "plus-lighter",
          opacity: hovering ? 1 : 0,
          transition: "opacity 180ms ease-out",
          background: `radial-gradient(140px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, ${tier.bar} 28%, transparent), transparent 65%)`,
        }}
      />
    </div>
  );
}

// ─── HeatmapColumn ────────────────────────────────────────────────────────────
// Vertical stack: one tactic header (category + aggregate %) over a stack of
// HeatmapCells. Width is fixed (HEATMAP_COLUMN_WIDTH) and flexShrink: 0 so the
// column never collapses inside the horizontal scroll container.

function HeatmapColumn({ column }: { column: HeatmapColumnData }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: HEATMAP_CELL_GAP,
        width: HEATMAP_COLUMN_WIDTH,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 12px",
          minWidth: 0,
        }}
      >
        <span
          style={{
            ...T_BODY,
            color: "#b4b9c2",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {column.category}
        </span>
        <span style={{ ...T_BODY, color: "#f2f4f7" }}>
          {column.percent}%
        </span>
      </div>
      {column.cells.map((cell, i) => (
        <HeatmapCell key={i} cell={cell} />
      ))}
    </div>
  );
}

// ─── HeatmapLegend ────────────────────────────────────────────────────────────
// Five-tier swatch row. Reads colors from HEATMAP_TIERS so legend stays in sync
// if the tier palette ever shifts.

function HeatmapLegend() {
  const tiers: HeatmapTier[] = ["100", "75", "50", "25", "0"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        paddingRight: 86,
        flexShrink: 0,
      }}
    >
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: HEATMAP_TIERS[tier].bar,
              flexShrink: 0,
            }}
          />
          <span style={{ ...T_CAPTION, color: "#b4b9c2" }}>{tier}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── HeatmapSlider ────────────────────────────────────────────────────────────
// Custom horizontal-scroll indicator + drag handle for any scrollable element.
// Track is a 3px gradient bar (bright green → dark — decorative, fixed); knob
// is a fixed-size 20×20 white square with a translucent halo and slides along
// the track based on scroll position. Hides itself (opacity 0) when content
// fits without scroll.
//
// Reusable: pass any RefObject<HTMLDivElement | null> whose target is the
// scrollable container. Drop the slider anywhere; it stays in sync.

const HEATMAP_SLIDER_THUMB_SIZE = 20;

function HeatmapSlider({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, visible: false });
  const dragRef = useRef({ active: false, startThumbLeft: 0, startPointer: 0 });

  useEffect(() => {
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;

    const update = () => {
      const trackW = track.clientWidth;
      const totalW = scroll.scrollWidth;
      const visW = scroll.clientWidth;
      if (totalW <= visW + 1 || trackW === 0) {
        setThumb({ left: 0, visible: false });
        return;
      }
      const maxScroll = totalW - visW;
      const maxThumbLeft = Math.max(0, trackW - HEATMAP_SLIDER_THUMB_SIZE);
      const left = Math.round((scroll.scrollLeft / maxScroll) * maxThumbLeft);
      setThumb({ left, visible: true });
    };

    update();
    scroll.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(scroll);
    ro.observe(track);
    return () => {
      scroll.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRef]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, startThumbLeft: thumb.left, startPointer: e.clientX };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;
    const dx = e.clientX - dragRef.current.startPointer;
    const maxThumbLeft = Math.max(0, track.clientWidth - HEATMAP_SLIDER_THUMB_SIZE);
    if (maxThumbLeft <= 0) return;
    const newLeft = Math.max(0, Math.min(maxThumbLeft, dragRef.current.startThumbLeft + dx));
    const ratio = newLeft / maxThumbLeft;
    const maxScroll = scroll.scrollWidth - scroll.clientWidth;
    scroll.scrollLeft = ratio * maxScroll;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current.active = false;
  };

  return (
    // Bar = ONE clean div: gradient bg, 1px border, 3px radius — all properties
    // applied to the same element so the rounded-rect clip wraps both the
    // background and the border together. boxSizing: border-box keeps the 3px
    // height inclusive of the border. backgroundClip: padding-box stops the
    // gradient at the border's inner edge so the translucent border isn't
    // tinted by the gradient bleeding through it.
    <div
      ref={trackRef}
      style={{
        flex: "1 0 0",
        height: 3,
        position: "relative",
        opacity: thumb.visible ? 1 : 0,
        transition: "opacity 200ms ease",
        minWidth: 160,
        // Cap the slider at ~70% of the prior fill width — keeps it visually
        // anchored to the right via justify-content: space-between on the
        // footer, with the leftover gap sitting between legend and slider.
        maxWidth: 360,
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.05)",
        background:
          "linear-gradient(90deg, #07D582 0%, #0ABE77 12.5%, #0DA86B 25%, #137B54 50%, #1E2026 100%)",
        backgroundClip: "padding-box",
        boxSizing: "border-box",
      }}
    >
      <div
        // Drop shadow + hover halo are both managed by the .heatmap-slider-thumb
        // class via stacked box-shadows. Halo lives OUTSIDE the 20×20 box
        // (`0 0 0 4px <color>` spread shadow), so the white center stays a
        // full 20×20 in both states. Don't add `box-shadow` inline — it would
        // override the class declaration and break the hover transition.
        className="heatmap-slider-thumb"
        style={{
          position: "absolute",
          left: thumb.left,
          top: "50%",
          transform: "translateY(-50%)",
          width: HEATMAP_SLIDER_THUMB_SIZE,
          height: HEATMAP_SLIDER_THUMB_SIZE,
          borderRadius: 8,
          background: "#fff",
          cursor: "grab",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
}

// ─── DetectionCoverageHeatmap ─────────────────────────────────────────────────
// Card with a horizontally-scrollable grid of HeatmapColumns. Footer = legend
// + slider (the slider mirrors the column scroll position). Card width is
// driven by its parent grid column, columns inside scroll horizontally when
// content exceeds the visible width.

function DetectionCoverageHeatmap() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    // alignSelf: stretch forces the card to fill MainContent's full width
    // (since `<main>` uses align-items: flex-start). minWidth: 0 is mandatory
    // alongside it — without it, the card would still grow to fit all 14
    // × 145px columns instead of clipping at MainContent's edge. The pair
    // makes the card respect its allocated row width while the inner scroll
    // container handles horizontal overflow.
    <Card style={{ alignSelf: "stretch", minWidth: 0 }}>
      <CardHeader
        title="Detection Coverage Heatmap"
        subtitle="Covered by Dawn"
        right={
          <IconBtn label="Expand heatmap">
            <Maximize2 size={14} strokeWidth={1.75} />
          </IconBtn>
        }
      />
      {/* Body: vertical-only padding on the wrapper. Horizontal padding lives
          INSIDE the scroll container (so it scrolls with content) and INSIDE
          the footer (so the legend+slider stay 20px off the card edges). The
          column grid bleeds edge-to-edge while scrolling. */}
      <div
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          minWidth: 0,
        }}
      >
        {/* Horizontal scroll container — native scrollbar hidden via .no-scrollbar.
            paddingLeft/paddingRight are part of the scroll content, so they give
            20px breathing room AT REST and scroll away as the user pans, letting
            columns reach the card's actual left/right edges mid-scroll. */}
        <div
          ref={scrollRef}
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: HEATMAP_COLUMN_GAP,
            overflowX: "auto",
            minWidth: 0,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {HEATMAP_TACTICS.map((column, i) => (
            <HeatmapColumn key={i} column={column} />
          ))}
        </div>

        {/* Footer: legend (left) + slider (right). space-between + alignSelf:
            stretch is the canonical body-footer layout. Horizontal padding is
            on the footer itself so it's anchored 20px off the card edges
            regardless of the scroll container's edge-to-edge bleed above. */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            minWidth: 0,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <HeatmapLegend />
          <HeatmapSlider scrollRef={scrollRef} />
        </div>
      </div>
    </Card>
  );
}

// ─── Workload Distribution ────────────────────────────────────────────────────
// Card with a search/filter header and a 10-column data table.
// Reusable primitives: <FilterPill>, <SearchField>, <SeverityBadge>.

type WorkloadSeverity = "Critical" | "High" | "Medium" | "Low";

const SEVERITY_COLORS: Record<WorkloadSeverity, { fg: string; bg: string }> = {
  Critical: { fg: "var(--severity-critical)", bg: "var(--severity-critical-bg)" },
  High:     { fg: "var(--severity-high)",     bg: "var(--severity-high-bg)" },
  Medium:   { fg: "var(--green)",              bg: "var(--green-bg)" },
  Low:      { fg: "var(--blue)",               bg: "var(--blue-bg)" },
};

type WorkloadRow = {
  id: string;
  ruleName: string;
  category: string;
  technique: string;
  severity: WorkloadSeverity;
  status: string;
  hits: string;
  fpRate: string;
  source: string;
};

const WORKLOAD_ROWS: WorkloadRow[] = [
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Critical", status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Low",      status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Medium",   status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "High",     status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "High",     status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Medium",   status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Critical", status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Low",      status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Low",      status: "Testing", hits: "-", fpRate: "-", source: "Down" },
  { id: "DAWN-730", ruleName: "Suspicious Threat Hunt Pattern Detected", category: "Execution", technique: "T1059", severity: "Medium",   status: "Testing", hits: "-", fpRate: "-", source: "Down" },
];

// Search field — bg white-5, search icon + placeholder. Display-only for now
// (no input element); promote to a real <input> when wiring real state.
function SearchField({
  placeholder,
  width,
}: {
  placeholder: string;
  width?: number | string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 34,
        padding: "0 12px",
        borderRadius: 100,
        background: "rgba(255,255,255,0.05)",
        width,
        flexShrink: 0,
      }}
    >
      <Search size={16} strokeWidth={1.75} color="#b4b9c2" style={{ flexShrink: 0 }} />
      <span
        style={{
          ...T_BODY,
          color: "#b4b9c2",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: "1 0 0",
          minWidth: 0,
        }}
      >
        {placeholder}
      </span>
    </div>
  );
}

// Filter pill — same shape as the StatusBar's "Last 7 days" date button.
// Generalized: pass any lucide icon + label. Width optional (defaults to
// content sizing).
function FilterPill({
  icon: Icon,
  label,
  width,
}: {
  icon: IconComponent;
  label: string;
  width?: number | string;
}) {
  return (
    <button
      type="button"
      style={{
        ...T_BODY,
        background: "#1f2126",
        border: "1px solid #23252a",
        borderRadius: 100,
        padding: "0 13px",
        height: 34,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        color: "#b4b9c2",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Icon size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
      </span>
      <ChevronDown size={11} strokeWidth={1.75} style={{ flexShrink: 0 }} />
    </button>
  );
}

// Severity badge — 4 named tiers, colors come from SEVERITY_COLORS map.
function SeverityBadge({ severity }: { severity: WorkloadSeverity }) {
  const { fg, bg } = SEVERITY_COLORS[severity];
  return (
    <span
      style={{
        ...T_CAPTION,
        borderRadius: 999,
        padding: "2px 10px",
        background: bg,
        color: fg,
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
      {severity}
    </span>
  );
}

function WorkloadDistribution() {
  const COLS =
    "100px 267px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) 44px";
  const HEADERS = ["ID", "Rule Name", "Category", "Technique", "Severity", "Status", "Hits (7d)", "FP Rate", "Source", ""];

  const cellBase: React.CSSProperties = {
    height: 52,
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    ...T_BODY,
  };
  const headerCellBase: React.CSSProperties = {
    ...cellBase,
    color: "#858a94",
    borderBottom: "1px solid #23252a",
  };

  return (
    <Card style={{ alignSelf: "stretch", minWidth: 0 }}>
      <CardHeader
        title="Workload Distribution"
        subtitle="Tickets & Backlog"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <SearchField placeholder="Search rules by name, tact" width={247} />
            <FilterPill icon={ListFilter} label="All Statuses" width={132} />
            <FilterPill icon={ListFilter} label="All Activities" width={132} />
            <IconBtn label="Open in new tab">
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </IconBtn>
          </div>
        }
      />
      <div style={{ padding: "16px 20px 20px", minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: COLS, minWidth: 0 }}>
          {/* Header row */}
          {HEADERS.map((h, i) => (
            <div key={`h-${i}`} style={headerCellBase}>{h}</div>
          ))}

          {/* Data rows. Each row is a `display: contents` wrapper (.workload-row)
              so the grid sees a flat sequence of cells. CSS hover on the wrapper
              propagates to all descendants — see .workload-row rules in
              globals.css for bg, ID weight, and action-icon reveal. */}
          {WORKLOAD_ROWS.map((row, i) => {
            const isLast = i === WORKLOAD_ROWS.length - 1;
            const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
              ...cellBase,
              color: "#f2f4f7",
              borderBottom: isLast ? "none" : "1px solid #23252a",
              ...extra,
            });

            return (
              <div key={`r-${i}`} className="workload-row" style={{ display: "contents" }}>
                <div className="workload-cell workload-cell-id" style={cell()}>
                  {row.id}
                </div>
                <div
                  className="workload-cell"
                  style={cell({
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  })}
                >
                  {row.ruleName}
                </div>
                <div className="workload-cell" style={cell()}>
                  <NeutralBadge text={row.category} size="md" />
                </div>
                <div className="workload-cell" style={cell()}>{row.technique}</div>
                <div className="workload-cell" style={cell()}>
                  <SeverityBadge severity={row.severity} />
                </div>
                <div className="workload-cell" style={cell()}>{row.status}</div>
                <div className="workload-cell" style={cell()}>{row.hits}</div>
                <div className="workload-cell" style={cell()}>{row.fpRate}</div>
                <div className="workload-cell" style={cell()}>{row.source}</div>
                <div className="workload-cell" style={cell({ justifyContent: "center" })}>
                  <ArrowUpRight
                    className="workload-cell-action-icon"
                    size={14}
                    strokeWidth={1.75}
                    color="#b4b9c2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ─── MainContent ──────────────────────────────────────────────────────────────

function MainContent({
  sidebarCollapsed,
}: {
  sidebarCollapsed: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPills, setShowPills] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = el.scrollTop;
        // Fade kicks in as soon as content starts scrolling past the viewport top.
        // Threshold > 4 to avoid jitter at rest (browsers can report sub-pixel scrollTop).
        setIsScrolled(top > 4);
        // Pills appear once StatusBar is fully out (offsetTop 12 + height ~76 = 88).
        setShowPills(top > 88);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={mainContentStyles.wrapper}>
      <main className={mainContentStyles.main}>
        <StatusBar />

        {/* Single grid holding the five top-row cards. Layout swaps between
            the big-screen and small-screen templates via media queries on
            `.cardsGrid` in main-content.module.css — the DOM order stays
            the same; only the grid-template-areas reassign positions. */}
        <div className={mainContentStyles.cardsGrid}>
          <HealthAndPerformance style={{ gridArea: "hp", minWidth: 0 }} />
          <ProposalDrivers
            style={{ gridArea: "prop", minWidth: 0 }}
            className={mainContentStyles.propCard}
          />
          <ActiveWorkloadQueue style={{ gridArea: "wq", minWidth: 0 }} />
          <Teamwork style={{ gridArea: "tw", minWidth: 0 }} />
          <LastCovered style={{ gridArea: "lc", minWidth: 0 }} />
        </div>

        <DetectionCoverageHeatmap />
        <WorkloadDistribution />
      </main>

      {/* Top edge fade — color gradient + progressive backdrop blur. Sits below
          the pills (z 40 < 50) so the pills paint cleanly over it. Visible
          band shows in the gap between the two pills (and the 12px strip above
          them). Three stacked blur layers, each masked into a band so the
          blur intensity decreases from top to bottom; color overlay sits on
          top so the page-bg gradient stays opaque at the top edge. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          // sidebar (232) + shell padding-left (12) + shell-gap (20) = 264
          left: 264,
          right: 0,
          height: 60,
          pointerEvents: "none",
          zIndex: 40,
          opacity: isScrolled ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        {/* Blur band 3 — lightest, near the bottom of the fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(1px)",
            WebkitBackdropFilter: "blur(1px)",
            maskImage:
              "linear-gradient(to bottom, transparent 33%, #000 66%, #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 33%, #000 66%, #000 100%)",
          }}
        />
        {/* Blur band 2 — medium, centered in the fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 33%, #000 66%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 33%, #000 66%, transparent 100%)",
          }}
        />
        {/* Blur band 1 — heaviest, at the top edge */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 33%, transparent 66%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 33%, transparent 66%)",
          }}
        />
        {/* Color overlay — page bg with a top-biased fall-off */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, #0f1116 0%, rgba(15,17,22,0.55) 50%, transparent 100%)",
          }}
        />
      </div>

      <FloatingStatusPills
        visible={showPills}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function DetectionPage() {
  // Sidebar collapsed state lives here so other layout pieces (currently
  // <FloatingStatusPills>'s fixed `left`) can react to it. Sidebar is now
  // a controlled component fed by these props.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        padding: "0 0 0 12px",
        gap: 20,
        background: "#0f1116",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes joon-shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @keyframes joon-dot-1 {
              0% { opacity: 0; }
              25% { opacity: 1; }
              100% { opacity: 1; }
            }
            @keyframes joon-dot-2 {
              0% { opacity: 0; }
              50% { opacity: 1; }
              100% { opacity: 1; }
            }
            @keyframes joon-dot-3 {
              0% { opacity: 0; }
              75% { opacity: 1; }
              100% { opacity: 1; }
            }
            @property --joon-rb-angle {
              syntax: '<angle>';
              initial-value: 0deg;
              inherits: false;
            }
            @keyframes joon-rb-spin {
              to { --joon-rb-angle: 360deg; }
            }
          `,
        }}
      />
      {/* Sidebar wrapper — owns the visible card styling (bg, radius, margin,
          width). Both the expanded and collapsed Sidebar components render
          inside here as transparent, full-size content. The wrapper carries
          the `width` and `border-radius` transitions so the rail morphs
          smoothly across the collapsed/expanded swap (~240ms is the gentle
          casual feel — long enough to read as a transition, short enough not
          to drag). `overflow: clip` hides any content that overshoots while
          the wrapper is still narrowing/widening. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: sidebarCollapsed ? 64 : 232,
          flexShrink: 0,
          alignSelf: "stretch",
          marginTop: 12,
          marginBottom: 12,
          background: "#1e2026",
          borderRadius: sidebarCollapsed ? 100 : 16,
          overflow: "clip",
          transition:
            "width 240ms ease, border-radius 240ms ease",
        }}
      >
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>
      <MainContent sidebarCollapsed={sidebarCollapsed} />
    </div>
  );
}
