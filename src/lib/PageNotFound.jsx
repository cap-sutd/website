import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center text-foreground">
      <div className="max-w-md w-full border border-graphene bg-secondary/30 p-8 md:p-12">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-citrine">
          STATUS 404 // FILE NOT FOUND
        </div>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
          RECORD NOT LOCATED
        </h1>
        <p className="mt-4 font-mono-label text-[12px] leading-relaxed text-muted-foreground">
          The requested coordinate <span className="text-foreground">{pageName}</span> is not registered in this intelligence registry.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-citrine px-6 py-3 font-mono-label text-[11px] font-semibold uppercase tracking-widest text-background transition hover:bg-foreground hover:text-background"
          >
            ← Return to Base
          </Link>
          <Link
            to="/team"
            className="inline-flex items-center justify-center border border-graphene px-6 py-3 font-mono-label text-[11px] uppercase tracking-widest text-foreground transition hover:border-foreground"
          >
            View Collective →
          </Link>
        </div>
      </div>
    </div>
  );
}