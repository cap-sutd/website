import React from "react";
import { collective } from "@/data/team";
import { Clock, Terminal, AlertCircle } from "lucide-react";

export default function Faq() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-obsidian text-foreground">
      {/* Top utility bar */}
      <div className="flex items-center justify-between border-b border-graphene px-6 py-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-10">
        <span>FILE 05 // FAQ</span>
        <span>{collective.cohort || "C.01"}</span>
      </div>

      {/* Header */}
      <section className="border-b border-graphene px-6 py-10 md:px-10 md:py-16">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground animate-scan">
          FILE 05 // INTEL QUERIES
        </div>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tighter animate-scan">
          Frequently asked<br />
          <span className="text-outline">questions.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          Direct answers to common operational, logistical, and technical inquiries regarding the collective's capabilities and workflows.
        </p>
      </section>

      {/* In-Progress State Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 py-24 md:py-32">
        <div className="max-w-lg w-full border border-graphene bg-secondary/10 p-8 md:p-12 text-center relative overflow-hidden group">
          
          {/* Subtle animated background scan line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-citrine/5 to-transparent -translate-y-full group-hover:animate-scan" />

          {/* Icon */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-graphene bg-obsidian mb-6">
            <Clock className="h-6 w-6 text-citrine animate-pulse" />
          </div>
          
          {/* Main Message */}
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            COMPILING ALL REQUIRED DETAILS AND INFORMATION
          </h2>
          <div className="font-mono-label text-sm md:text-base uppercase tracking-[0.2em] text-citrine">
            In-progress // Will be available soon !
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The database is currently being updated with the latest clearance protocols and deployment answers. Check back shortly.
          </p>

          {/* Footer of the terminal box */}
          <div className="mt-10 pt-5 border-t border-graphene flex items-center justify-between gap-4 font-mono-label text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Restricted Access
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> System Standby
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-graphene px-6 py-10 md:px-12 mt-auto hover:bg-citrine">
        <a
          href={`mailto:${collective.email}`}
          className="group block font-heading text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-foreground transition hover:opacity-70"
        >
          {collective.email}
        </a>
      </footer>
    </div>
  );
}