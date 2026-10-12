import React from "react";
import { collective } from "@/data/team";

// Top "System Status" ticker — shows availability + capstone timeline on a loop.
export default function SystemTicker() {
  const items = [
    `STATUS // ${collective.availability}`,
    `COHORT // ${collective.cohort}`,
    `TIMELINE // ${collective.timeline}`,
    `UNIT // ${collective.unit}`,
    `STATUS // ${collective.availability}`,
    `COHORT // ${collective.cohort}`,
    `TIMELINE // ${collective.timeline}`,
    `UNIT // ${collective.unit}`,
  ];

  return (
    <div className="w-full overflow-hidden border-b border-graphene bg-obsidian py-2">
      <div className="flex w-max animate-ticker whitespace-nowrap font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
        {items.map((item, i) => (
          <span key={i} className="mx-6 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-citrine animate-pulse-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}