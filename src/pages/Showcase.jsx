import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { teamMembers, collective } from "@/data/team";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { ExternalLink, X, FileImage, ChevronLeft, ChevronRight } from "lucide-react";

// View 04 — The Collective Portfolio (Showcase)
export default function Showcase() {
  const location = useLocation();
  const [category, setCategory] = useState("all");
  const [member, setMember] = useState("all");
  const [expandedKey, setExpandedKey] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  // Ref to target the active inspector drawer for smooth autoscrolling
  const drawerRef = useRef(null);

  const allProjects = useMemo(
    () =>
      teamMembers.flatMap((m) =>
        (m.artifacts || []).map((a) => {
          const details = m.projectDetails?.[a.title] || m.projectDetails?.[a.id] || {};
          
          let mediaList = [];
          if (Array.isArray(details.media)) mediaList = details.media;
          else if (Array.isArray(details.images)) mediaList = details.images;
          else if (details.media || details.image) mediaList = [details.media || details.image];
          else if (a.media || a.file || a.image) mediaList = [a.media || a.file || a.image];

          return {
            ...a,
            memberId: m.id,
            memberName: m.name,
            memberIndex: m.index,
            memberRole: m.role,
            memberPortrait: m.image || m.portrait || null,
            memberStack: m.stack || [],
            mediaList,
            projectDetails: details,
          };
        })
      ).sort((a, b) => {
        const yearDiff = Number(b.year || 0) - Number(a.year || 0);
        if (yearDiff !== 0) return yearDiff;
        return (a.title || "").localeCompare(b.title || "");
      }),
    []
  );

  // Handle incoming redirect state from dossier page to auto-expand & scroll to the right project card
  useEffect(() => {
    if (location.state && allProjects.length > 0) {
      const { memberId, artifactIndex } = location.state;
      
      if (memberId !== undefined && artifactIndex !== undefined) {
        const targetMember = teamMembers.find((m) => m.id === memberId);
        if (targetMember && targetMember.artifacts && targetMember.artifacts[artifactIndex]) {
          const targetArtifact = targetMember.artifacts[artifactIndex];
          const targetKey = `${memberId}-${targetArtifact.title}`;

          setCategory("all");
          setMember("all");
          setExpandedKey(targetKey);
          setActiveMediaIndex(0);
        }
      }
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state, allProjects]);

  useEffect(() => {
    if (!expandedKey) return;
    const t = setTimeout(() => {
      drawerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(t);
  }, [expandedKey]);

  // Filters depend on each other: categories shown = those the selected specialist has,
  // specialists shown = those who have projects in the selected category.
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          allProjects
            .filter((p) => member === "all" || p.memberName === member)
            .map((p) => p.category)
            .filter(Boolean)
        )
      ).sort(),
    ],
    [allProjects, member]
  );
  const members = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          allProjects
            .filter((p) => category === "all" || p.category === category)
            .map((p) => p.memberName)
            .filter((n) => n && n.trim())
        )
      ),
    ],
    [allProjects, category]
  );

  const handleMemberChange = (v) => {
    setMember(v);
    // drop the category if this specialist has nothing in it
    if (v !== "all" && category !== "all" && !allProjects.some((p) => p.memberName === v && p.category === category)) {
      setCategory("all");
    }
    setExpandedKey(null);
  };
  const handleCategoryChange = (v) => {
    setCategory(v);
    if (v !== "all" && member !== "all" && !allProjects.some((p) => p.memberName === member && p.category === v)) {
      setMember("all");
    }
    setExpandedKey(null);
  };

  const filtered = allProjects.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (member === "all" || p.memberName === member)
  );

  const activeProject = filtered.find((p) => `${p.memberId}-${p.title}` === expandedKey);

  return (
    <div className="flex flex-col w-full h-full min-h-screen">
      {/* Top utility bar */}
      <div className="flex items-center justify-between border-b border-graphene px-6 py-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-10">
        <span>FILE 04 // PROJECT SHOWCASE</span>
        <span>{collective.cohort}</span>
      </div>

      {/* Header */}
      <section className="border-b border-graphene px-6 py-10 md:px-10 md:py-16">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground animate-scan">
          FILE 04 // THE PORTFOLIO
        </div>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tighter animate-scan">
          The collective<br />
          <span className="text-outline">portfolio.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          Every project the unit has shipped — across systems, security, AI, product, and
          research. Filter by category or by specialist to find the work that matches your problem.
        </p>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Category
            </span>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[220px] border-graphene bg-transparent font-mono-label text-[10px] uppercase tracking-widest text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-graphene bg-background font-mono-label text-[11px] uppercase tracking-widest text-foreground">
                {categories.map((c) => (
                  <SelectItem key={c} value={c === "All" ? "all" : c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Specialist
            </span>
            <Select value={member} onValueChange={handleMemberChange}>
              <SelectTrigger className="w-[220px] border-graphene bg-transparent font-mono-label text-[10px] uppercase tracking-widest text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-graphene bg-background font-mono-label text-[11px] uppercase tracking-widest text-foreground">
                {members.map((m) => (
                  <SelectItem key={m} value={m === "All" ? "all" : m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
            {filtered.length} / {allProjects.length} projects
          </span>
        </div>
      </section>

      {/* All project cards live in ONE scrollable container so the page stays short */}
      <div className="relative border-b border-graphene">
        <div className="flex items-center justify-between border-b border-graphene bg-obsidian px-6 py-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground md:px-10">
          <span>{filtered.length} projects</span>
          <span>Scroll to browse ↓</span>
        </div>
        <div className="max-h-[70vh] overflow-y-auto overscroll-contain bg-graphene">
          <div className="grid grid-cols-1 gap-px bg-graphene sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {filtered.map((p) => {
              const key = `${p.memberId}-${p.title}`;
              const isOpen = expandedKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setExpandedKey(isOpen ? null : key);
                    setActiveMediaIndex(0);
                  }}
                  className={`group flex h-60 flex-col overflow-hidden p-5 text-left transition ${
                    isOpen ? "bg-secondary/90 border-l-2 border-graphene" : "bg-obsidian hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>{p.category}</span>
                    <span>{p.year}</span>
                  </div>
                  <div className="mt-3 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden font-heading text-xl xl:text-lg font-extrabold leading-tight tracking-tight">
                    {p.title}
                  </div>
                  <p className="mt-2 mb-3 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden text-xs xl:text-[11px] leading-relaxed text-muted-foreground">
                    {p.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-graphene pt-3">
                    <span className="font-mono-label text-[10px] uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                      {p.memberIndex} // {p.memberName}
                    </span>
                    {isOpen ? (
                      <span className="inline-flex items-center gap-1 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-rose-400 transition hover:bg-rose-500 hover:text-black">
                        <X className="h-3 w-3" /> Close
                      </span>
                    ) : (
                      <span className="font-mono-label text-[10px] uppercase tracking-widest text-[#a8b238] transition group-hover:text-[#c4d03f] group-hover:translate-x-1">
                        Inspect →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inspector Drawer: opens below the card container for the selected project */}
      {activeProject && (
                <div ref={drawerRef} className="border-t border-b border-graphene bg-obsidian/95 p-6 md:p-12 animate-fade-in scroll-mt-6">
                  <div className="flex items-center justify-between border-b border-graphene pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#a8b238] animate-pulse"></span>
                      <div className="font-heading text-base sm:text-lg md:text-2xl font-extrabold tracking-tight text-foreground uppercase underline underline-offset-4">
                        {activeProject.title}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedKey(null)}
                      className="inline-flex items-center gap-1.5 border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-rose-400 transition hover:bg-rose-500 hover:text-black"
                    >
                      <X className="h-3.5 w-3.5" /> Close Panel
                    </button>
                  </div>

                  {/*
                    Mobile order:  1) media  2) write-up  3) owner
                    Desktop (lg):  media + owner side by side, write-up underneath
                    Handled with CSS `order` so the DOM stays the same.
                  */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
                    {/* 1. Media / Carousel Container */}
                    <div className="order-1 lg:col-span-2">
                      {activeProject.mediaList.length > 0 ? (
                        <div className="relative aspect-[16/9] w-full overflow-hidden border border-graphene bg-secondary">
                          <Image
                            src={activeProject.mediaList[activeMediaIndex] || activeProject.mediaList[0]}
                            alt={activeProject.title}
                            className="h-full w-full object-cover transition duration-500"
                            fittingType="fill"
                          />
                          <span className="absolute left-3 top-3 bg-obsidian/90 px-2.5 py-1 font-mono-label text-[9px] uppercase tracking-widest text-foreground border border-graphene">
                            {activeProject.category} // {activeProject.year} {activeProject.mediaList.length > 1 && `[${activeMediaIndex + 1}/${activeProject.mediaList.length}]`}
                          </span>

                          {/* Carousel Navigation Arrows */}
                          {activeProject.mediaList.length > 1 && (
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMediaIndex((prev) =>
                                    prev === 0 ? activeProject.mediaList.length - 1 : prev - 1
                                  )
                                }
                                className="border border-graphene bg-obsidian/80 p-2 text-foreground transition hover:bg-foreground hover:text-background"
                                title="Previous Media"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMediaIndex((prev) =>
                                    prev === activeProject.mediaList.length - 1 ? 0 : prev + 1
                                  )
                                }
                                className="border border-graphene bg-obsidian/80 p-2 text-foreground transition hover:bg-foreground hover:text-background"
                                title="Next Media"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative aspect-[16/9] w-full border border-graphene bg-secondary/20 flex flex-col items-center justify-center p-8 text-center">
                          <FileImage className="h-10 w-10 text-muted-foreground/60 mb-2" />
                          <div className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
                            VISUAL SHEET // NO MEDIA ATTACHED
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Owner sidebar
                        Mobile: portrait on the left, name/role/stack on the right, buttons underneath.
                        Desktop: original stacked layout (name -> portrait -> stack -> buttons). */}
                    <div className="order-3 lg:order-2 border-t border-graphene pt-6 lg:border-t-0 lg:pl-8 lg:pt-0 flex flex-col justify-between h-full">
                      <div className="grid grid-cols-[7rem_minmax(0,1fr)] sm:grid-cols-[9rem_minmax(0,1fr)] gap-x-4 gap-y-3 lg:flex lg:flex-col lg:gap-0 lg:space-y-5">
                        {/* Name (right column on mobile) */}
                        <div className="col-start-2 row-start-1">
                          <div className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            / Owner
                          </div>
                          <div className="mt-1 font-heading text-xl font-bold tracking-tight text-foreground">
                            {activeProject.memberName}
                          </div>
                          <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                            {activeProject.memberRole}
                          </div>
                        </div>

                        {/* Portrait (left column on mobile, spans name + stack rows) */}
                        {activeProject.memberPortrait && (
                          <div className="col-start-1 row-start-1 row-span-2 self-start relative aspect-[3/4] w-28 sm:w-36 lg:w-40 overflow-hidden border border-graphene bg-secondary">
                            <Image
                              src={activeProject.memberPortrait}
                              alt={activeProject.memberName}
                              className="h-full w-full object-cover transition duration-500"
                              fittingType="fill"
                            />
                          </div>
                        )}

                        {/* Stack (right column on mobile) */}
                        <div className="col-start-2 row-start-2">
                          <div className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            / Stack
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {activeProject.memberStack.map((s) => (
                              <span
                                key={s}
                                className="border border-graphene px-2 py-0.5 font-mono-label text-[9px] uppercase tracking-wide text-foreground"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 mt-8">
                        {activeProject.projectDetails?.link && (
                          <a
                            href={activeProject.projectDetails.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 border border-graphene bg-secondary/60 px-4 py-2.5 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-foreground transition hover:bg-foreground hover:text-background w-full"
                          >
                            PROJECT LINK <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}

                        <Link
                          to={`/team/${activeProject.memberId}`}
                          className="flex items-center justify-center gap-2 border border-graphene px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40 w-full"
                        >
                          Open full dossier →
                        </Link>
                      </div>
                    </div>

                    {/* 2. Write-up: tag & description from projectDetails dictionary */}
                    <div className="order-2 lg:order-3 lg:col-span-3 space-y-4 lg:border-t border-graphene lg:pt-6">
                      {activeProject.projectDetails?.tag && (
                        <div className="font-mono-label text-[11px] uppercase tracking-widest">
                          <span className="inline-block border border-graphene bg-secondary/40 px-3 py-1 font-semibold text-foreground">
                            {activeProject.projectDetails.tag}
                          </span>
                        </div>
                      )}

                      <div className="font-mono-label text-lg md:text-2xl uppercase tracking-[0.15em] text-foreground font-bold pt-2">
                        / Project Overview & Implementation Details
                      </div>

                      {activeProject.projectDetails?.description ? (
                        <p className="max-w-4xl text-sm sm:text-base md:text-lg leading-relaxed text-foreground">
                          {activeProject.projectDetails.description}
                        </p>
                      ) : (
                        <p className="max-w-4xl font-mono-label text-sm uppercase tracking-widest text-muted-foreground">
                          NIL
                        </p>
                      )}
                    </div>
                  </div>
                </div>
      )}

      {filtered.length === 0 && (
        <div className="px-6 py-20 text-center font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          No projects match this filter.
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-graphene px-6 py-10 md:px-12 mt-auto hover:bg-citrine">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground/70">
            Feel free to reach out to us at the email below for any inquiries or collaborations!
          </div>

        <a
          href={`mailto:${collective.email}?cc=joash_lim@mymail.sutd.edu.sg, jovan_tan@mymail.sutd.edu.sg, xinjie_fung@mymail.sutd.edu.sg, yiqi_tan@mymail.sutd.edu.sg`}
          className="group block font-heading text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-foreground transition hover:text-foreground"
        >
          {collective.email}
        </a>
      </footer>
    </div>
  );
}