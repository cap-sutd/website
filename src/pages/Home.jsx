import React from "react";
import { Link } from "react-router-dom";
import { collective, teamMembers } from "@/data/team";
import SystemTicker from "@/components/SystemTicker";
import { Image } from "@/components/ui/image";

// View 01 — The "Manifesto" Hero
export default function Home() {
  return (
    <div className="min-h-screen bg-obsidian text-foreground">
      <SystemTicker />

      {/* Top utility bar */}
      <div className="flex items-center justify-between border-b border-graphene px-6 py-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-10">
        <span>{collective.name} // {collective.unit}</span>
        <span className="hidden md:inline">EST. 2026 — SINGAPORE</span>
        <Link to="/team" className="text-foreground transition hover:text-foreground">
          Enter Collective →
        </Link>
      </div>

      {/* Hero */}
      <section className="relative grid min-h-[78vh] grid-cols-12 overflow-hidden">
        {/* faint grid lines */}
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        {/* single citrine light-leak */}
        <div className="pointer-events-none absolute -right-40 top-1/4 h-[60vh] w-[60vh] rounded-full bg-citrine/10 blur-[120px]" />

        <div className="relative col-span-12 flex flex-col justify-end px-6 pb-10 md:px-10 md:pb-16">
          <div className="mb-6 font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground animate-scan">
            FILE 00 // MANIFESTO
          </div>
          <h1 className="font-heading text-[16vw] font-extrabold leading-[0.85] tracking-tighter md:text-[10vw] animate-scan">
            <span className="text-outline">WE ENGINEER</span>
            <br />
            <span className="text-foreground">SIGNAL</span>
            <span className="text-foreground">.</span>
            <span className="text-outline">NOT</span>
            <br />
            <span className="text-outline">PROMISES.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl animate-scan">
            We are a five-person capstone collective — engineers, strategists, and a
            delivery lead — built to operate like a consultancy, not a class project.
            We take on one industry partner at a time and ship work you can defend in a
            boardroom.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/team"
              className="group inline-flex items-center gap-3 bg-citrine px-7 py-4 font-mono-label text-[12px] font-semibold uppercase tracking-widest text-foreground transition hover:bg-foreground hover:text-background"
            >
              Meet the Collective
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/showcase"
              className="group inline-flex items-center gap-3 border border-graphene px-7 py-4 font-mono-label text-[12px] font-semibold uppercase tracking-widest text-foreground transition hover:border-foreground hover:text-foreground"
            >
              View Showcase
            </Link>
          </div>
        </div>
      </section>

      {/* Capability ledger */}
      <section className="border-t border-graphene px-6 py-16 md:px-10">
        <div className="mb-10 font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          FILE 01 // CAPABILITY LEDGER
        </div>
        <div className="grid grid-cols-1 gap-px bg-graphene md:grid-cols-3">
          {[
            { n: "01", t: "Discovery", d: "Stakeholder interviews, competitive teardowns, and a sharp brief before a single line of code." },
            { n: "02", t: "Engineering", d: "Production-grade architecture, monitored pipelines, and interfaces treated as products." },
            { n: "03", t: "Delivery", d: "Weekly partner syncs, a live risk register, and on-time milestones you can plan around." },
          ].map((c) => (
            <div key={c.n} className="bg-obsidian p-8">
              <div className="font-mono-label text-[11px] text-foreground">{c.n}</div>
              <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight">{c.t}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collective preview strip */}
      <section className="border-t border-graphene px-6 py-16 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            FILE 02 // THE COLLECTIVE
          </div>
          <Link to="/team" className="font-mono-label text-[11px] uppercase tracking-widest text-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-px bg-graphene md:grid-cols-5">
          {teamMembers.map((m) => (
            <Link key={m.id} to={`/team/${m.id}`} className="group relative block aspect-[3/4] overflow-hidden bg-obsidian">
              <Image
                src={m.image}
                alt={m.name}
                className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="font-mono-label text-[10px] text-foreground">{m.index}</div>
                <div className="font-heading text-base font-bold tracking-tight">{m.name}</div>
                <div className="font-mono-label text-[10px] uppercase tracking-wide text-muted-foreground">
                  {m.pillar.split(" // ")[0]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full-bleed footer CTA */}
      <footer className="border-t border-graphene">
        <a
          href={`mailto:${collective.email}?cc=joash_lim@mymail.sutd.edu.sg, jovan_tan@mymail.sutd.edu.sg, xinjie_fung@mymail.sutd.edu.sg, yiqi_tan@mymail.sutd.edu.sg`}
          className="group block bg-obsidian px-6 py-16 text-center transition hover:bg-citrine md:px-10 md:py-24"
        >
          <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground/70">
            WE would love to hear from you — click on the email below to reach out to us at:
          </div>
          <div className="mt-4 break-all font-heading text-4xl font-extrabold tracking-tight text-foreground transition group-hover:text-foreground md:text-7xl">
            {collective.email}
          </div>
        </a>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-graphene px-6 py-5 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:px-10">
          <span>{collective.name} // {collective.cohort}</span>
          <span>SINGAPORE — {collective.timeline}</span>
        </div>
      </footer>
    </div>
  );
}