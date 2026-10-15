import React from "react";
import { Link } from "react-router-dom";
import { teamMembers, collective } from "@/data/team";
import { Image } from "@/components/ui/image";

export default function Team() {
  return (
    <>
      <div className="border-b border-graphene px-6 py-10 md:px-12 md:py-16">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground animate-scan">
          FILE 03 // THE COLLECTIVE
        </div>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tighter animate-scan">
          {teamMembers.length} specialists.<br />
          <span className="text-outline">One briefing.</span>
          <span className="text-foreground">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          Each member is a dossier — hover a portrait to surface their technical stack,
          then open the file for the full intel feed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-graphene sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((m) => (
          <Link key={m.id} to={`/team/${m.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-obsidian">
            <Image src={m.image} alt={m.name} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" fittingType="fill" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />
            <div className="absolute left-0 top-0 flex w-full items-center justify-between p-4">
              <span className="font-mono-label text-[11px] text-foreground">{m.index}</span>
              <span className="flex items-center gap-1.5 font-mono-label text-[9px] uppercase tracking-widest text-muted-foreground">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${m.pitchReady ? "bg-citrine animate-pulse-dot" : "bg-foreground/30"}`} />
                {m.pitchReady ? "Pitch Ready" : "Standby"}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight">{m.name}</div>
              <div className="mt-1 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">{m.pillar}</div>
            </div>
          </Link>
        ))}
      </div>

      <footer className="border-t border-graphene px-6 py-10 md:px-12">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground/70">
            click on the email below to reach out to us!
          </div>
        <a href={`mailto:${collective.email}?cc=joash_lim@mymail.sutd.edu.sg, jovan_tan@mymail.sutd.edu.sg, xinjie_fung@mymail.sutd.edu.sg, yiqi_tan@mymail.sutd.edu.sg`}              
          className="group block font-heading text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-foreground transition hover:text-foreground">
          {collective.email}
        </a>
      </footer>
    </>
  );
}