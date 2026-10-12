import React from "react";
import { Link } from "react-router-dom";
import { teamMembers, collective } from "@/data/team";
import { Image } from "@/components/ui/image";

// View 02 — The "Collective" Grid (Team Overview)
export default function Team() {
  return (
    <div className="min-h-screen bg-obsidian text-foreground">
      {/* Header */}
      <div className="border-b border-graphene px-6 py-10 md:px-12 md:py-16">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground animate-scan">
          FILE 03 // THE COLLECTIVE
        </div>
        <h1 className="mt-4 max-w-4xl font-heading text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl animate-scan">
          {teamMembers.length} specialists.<br />
          <span className="text-outline">One briefing.</span>
          <span className="text-foreground">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Each member is a dossier — hover a portrait to surface their technical stack,
          then open the file for the full intel feed. The directory on the left stays with
          you the entire time.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-px bg-graphene sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((m, i) => (
          <Link
            key={m.id}
            to={`/team/${m.id}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-obsidian"
          >
            <Image
              src={m.image}
              alt={m.name}
              className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              fittingType="fill"
            />
            {/* chromatic aberration overlay on hover */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />

            {/* index + status */}
            <div className="absolute left-0 top-0 flex w-full items-center justify-between p-4">
              <span className="font-mono-label text-[11px] text-foreground">{m.index}</span>
              <span className="flex items-center gap-1.5 font-mono-label text-[9px] uppercase tracking-widest text-muted-foreground">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${m.pitchReady ? "bg-citrine animate-pulse-dot" : "bg-foreground/30"
                    }`}
                />
                {m.pitchReady ? "Pitch Ready" : "Standby"}
              </span>
            </div>

            {/* bottom intel */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="font-heading text-2xl font-extrabold tracking-tight">{m.name}</div>
              <div className="mt-1 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.pillar}
              </div>
              {/* stack reveal on hover */}
              <div className="mt-3 flex max-h-0 flex-wrap gap-1.5 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                {m.stack.map((s) => (
                  <span
                    key={s}
                    className="border border-foreground/60 px-2 py-0.5 font-mono-label text-[9px] uppercase tracking-wide text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}

      </div>

      {/* Footer */}
      <footer className="border-t border-graphene px-6 py-10 md:px-12">
        <a
          href={`mailto:${collective.email}`}
          className="group block font-heading text-3xl font-extrabold tracking-tight text-foreground transition hover:text-foreground md:text-5xl"
        >
          {collective.email}
        </a>
      </footer>
    </div>
  );
}