import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMember, teamMembers, collective } from "@/data/team";
import { Image } from "@/components/ui/image";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Mail, FileText, ExternalLink, Download, Code, Maximize2, X, ZoomIn, ZoomOut, RotateCcw, ArrowUpRight } from "lucide-react";

function PreviewHeader({ title, zoom, setZoom, onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-graphene bg-obsidian px-6 py-4">
      <div className="font-mono-label text-[10px] uppercase tracking-widest text-foreground flex items-center gap-2">
        <Code className="h-4 w-4 text-citrine" />
        {title} // FULL SCREEN PREVIEW
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border border-graphene bg-secondary/30 px-2 py-1 text-foreground">
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))} className="p-1 hover:text-citrine transition cursor-pointer" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center font-mono-label text-[10px]">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="p-1 hover:text-citrine transition cursor-pointer" title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button onClick={() => setZoom(1)} className="p-1 hover:text-citrine ml-1 border-l border-graphene pl-3 transition cursor-pointer" title="Reset Zoom">
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer" title="Close">
          <X className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}

export default function MemberDossier() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const member = getMember(memberId);
  const [activeArtifact, setActiveArtifact] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [category, setCategory] = useState("all");
  
  // Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [htmlPopupOpen, setHtmlPopupOpen] = useState(false);
  const [popupZoom, setPopupZoom] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveArtifact(0);
    setActiveDocIndex(0);
    setCategory("all");
    setLightboxOpen(false);
    setHtmlPopupOpen(false);
  }, [memberId]);

  useEffect(() => {
    if (lightboxOpen) setPopupZoom(1);
  }, [lightboxOpen]);

  if (!member) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center gap-4 bg-obsidian px-6 text-center">
        <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          ERROR // FILE NOT FOUND
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">No dossier on record.</h1>
        <Link to="/team" className="font-mono-label text-[12px] uppercase tracking-widest text-foreground hover:text-foreground">
          ← Back to collective
        </Link>
      </div>
    );
  }

  const currentIndex = teamMembers.findIndex((m) => m.id === member.id);
  const next = teamMembers[(currentIndex !== -1 ? currentIndex + 1 : 0) % teamMembers.length];

  const categoryOptions = ["All", ...Array.from(new Set(member.artifacts?.map((a) => a.category) || [])).sort()];
  const filteredArtifacts =
    category === "all" ? (member.artifacts || []) : (member.artifacts || []).filter((a) => a.category === category);
  const safeActive = Math.min(activeArtifact, Math.max(0, filteredArtifacts.length - 1));

  const docs = member.portfolios || [];
  const safeDocIndex = Math.min(activeDocIndex, Math.max(0, docs.length - 1));
  const currentDoc = docs[safeDocIndex] || null;

  const docFile = currentDoc?.file || currentDoc?.portfolio;
  const downloadTarget = currentDoc?.isHtml ? currentDoc?.download : docFile;
  const hasLink = Boolean(currentDoc?.link);
  const linkOnly = hasLink && !currentDoc?.file;

  return (
    <div className="flex flex-col w-full bg-obsidian text-foreground min-h-screen relative">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-graphene px-6 py-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-12 bg-obsidian z-10 relative">
        <Link to="/team" className="flex items-center gap-2 transition hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Collective
        </Link>
        <span>FILE {member.index} // SPECIALIST DOSSIER</span>
        <span className="hidden md:inline">{collective.cohort}</span>
      </div>

      <div className="flex flex-col lg:flex-row w-full items-start relative">
        
        {/* LEFT COLUMN */}
        <div className="hidden lg:block sticky top-0 w-1/2 h-screen border-r border-graphene shrink-0 overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="font-mono-label text-[11px] text-foreground">FILE {member.index}</div>
            <div className="mt-2 font-heading text-5xl font-extrabold tracking-tighter">{member.name}</div>
            <div className="mt-1 font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
              {member.pillar}
            </div>
            <div className="mt-4 flex items-center gap-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  member.pitchReady ? "bg-citrine animate-pulse-dot" : "bg-foreground/30"
                }`}
              />
              {member.pitchReady ? "Pitch Ready" : "Standby"}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-1/2 px-6 py-10 md:px-12 md:py-16 shrink-0">
          
          {/* mobile portrait */}
          <div className="relative mb-8 aspect-[4/5] overflow-hidden lg:hidden">
            <Image 
              src={member.image} 
              alt={member.name} 
              className="h-full w-full object-cover" 
              fittingType="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="font-mono-label text-[11px] text-foreground">FILE {member.index}</div>
              <div className="mt-1 font-heading text-3xl font-extrabold tracking-tight">{member.name}</div>
              <div className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">{member.pillar}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <section className="border-b border-graphene pb-10">
            <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              / Executive Summary
            </div>
            <p className="mt-5 text-xl font-light leading-relaxed text-foreground md:text-2xl">
              {member.summary}
            </p>
          </section>

          {/* Technical Stack */}
          {member.stack && member.stack.length > 0 && (
            <section className="border-b border-graphene py-10">
              <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                / Technical Stack
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {member.stack.map((s) => (
                  <span
                    key={s}
                    className="border border-graphene px-3 py-1.5 font-mono-label text-[11px] uppercase tracking-wide text-foreground transition hover:border-foreground hover:text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Project Artifacts */}
          {filteredArtifacts.length > 0 && (
            <section className="border-b border-graphene py-10">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  / Project Artifacts
                </div>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v);
                    setActiveArtifact(0);
                  }}
                >
                  <SelectTrigger className="w-[200px] border-graphene bg-transparent font-mono-label text-[10px] uppercase tracking-widest text-foreground">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="border-graphene bg-background font-mono-label text-[11px] uppercase tracking-widest text-foreground">
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c === "All" ? "all" : c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 overflow-x-auto">
                <div className="flex gap-px bg-graphene">
                  {filteredArtifacts.map((a, i) => (
                    <button
                      key={a.title || i}
                      type="button"
                      onClick={() => setActiveArtifact(i)}
                      className={`min-w-[180px] flex-1 border-0 p-5 text-left transition ${
                        safeActive === i ? "bg-citrine text-foreground" : "bg-obsidian text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className={`font-mono-label text-[10px] ${safeActive === i ? "text-foreground/70" : "text-foreground"}`}>
                        ART.{String(i + 1).padStart(2, "0")} // {a.year}
                      </div>
                      <div className="mt-1 font-mono-label text-[9px] uppercase tracking-wide text-muted-foreground">
                        {a.category}
                      </div>
                      <div className="mt-2 font-heading text-base font-bold leading-tight">{a.title}</div>
                    </button>
                  ))}
                </div>
              </div>
              {filteredArtifacts[safeActive] && (
                <div className="mt-5 border border-graphene p-6">
                  <div className="font-mono-label text-[10px] uppercase tracking-widest text-foreground">
                    {filteredArtifacts[safeActive].year} — {filteredArtifacts[safeActive].category}
                  </div>
                  <p className="mt-3 text-lg leading-relaxed text-foreground">
                    {filteredArtifacts[safeActive].summary}
                  </p>

                  <div className="mt-5 pt-4 border-t border-graphene flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/showcase", {
                          state: { memberId: member.id, artifactIndex: safeActive }
                        })
                      }
                      className="inline-flex items-center gap-1.5 font-mono-label text-[10px] uppercase tracking-widest text-[#a8b238] transition hover:text-[#c4d03f]"
                    >
                      <span>Click here to view more details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Why Me */}
          {member.whyMe && (
            <section className="border-b border-graphene py-10">
              <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-foreground">
                / Why Me — On This Capstone
              </div>
              <div className="mt-5 border-l-2 border-foreground bg-secondary/40 p-6">
                <p className="text-xl font-light leading-relaxed text-foreground">
                  {member.whyMe}
                </p>
              </div>
            </section>
          )}

          {/* Portfolio & CV / Documents */}
          <section className="border-b border-graphene py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                / Portfolio & CV {docs.length > 1 && `// ${docs.length} Documents`}
              </div>
              {currentDoc && (
                <div className="flex items-center gap-2">
                  {linkOnly ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="inline-flex items-center gap-1.5 border border-graphene px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40 cursor-pointer"
                      >
                        <Maximize2 className="h-3 w-3" /> Expand
                      </button>
                      <a
                        href={currentDoc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-citrine px-3 py-1.5 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-black transition hover:bg-foreground hover:text-citrine cursor-pointer select-none"
                      >
                        <ExternalLink className="h-3 w-3 pointer-events-none" /> Open Website
                      </a>
                    </>
                  ) : hasLink ? (
                    <a
                      href={currentDoc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-citrine px-3 py-1.5 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-black transition hover:bg-foreground hover:text-citrine cursor-pointer select-none"
                    >
                      <ExternalLink className="h-3 w-3 pointer-events-none" /> Open Website
                    </a>
                  ) : (
                    <>
                      {currentDoc.isHtml ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPopupZoom(1);
                            setHtmlPopupOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 border border-graphene px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40 cursor-pointer"
                        >
                          <Maximize2 className="h-3 w-3" /> Expand
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          className="inline-flex items-center gap-1.5 border border-graphene px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40 cursor-pointer"
                        >
                          <Maximize2 className="h-3 w-3" /> Expand
                        </button>
                      )}

                      {currentDoc.isHtml && (
                        <a
                          href={downloadTarget || currentDoc.file}
                          download={`${member.id}-${currentDoc.fileName || "document"}`}
                          className="inline-flex items-center gap-1.5 bg-citrine px-3 py-1.5 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-black transition hover:bg-foreground hover:text-citrine cursor-pointer select-none"
                        >
                          <Download className="h-3 w-3 pointer-events-none" /> Download
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {docs.length > 1 && (
              <div className="mt-6 overflow-x-auto">
                <div className="flex gap-px bg-graphene">
                  {docs.map((doc, idx) => (
                    <button
                      key={doc.id || idx}
                      type="button"
                      onClick={() => setActiveDocIndex(idx)}
                      className={`min-w-[190px] flex-1 border-0 p-4 text-left transition cursor-pointer ${
                        safeDocIndex === idx
                          ? "bg-citrine text-foreground"
                          : "bg-obsidian text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between font-mono-label text-[10px] ${
                          safeDocIndex === idx ? "text-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        <span>DOC.{String(idx + 1).padStart(2, "0")}</span>
                        <span className="uppercase font-semibold">
                          {doc.isHtml ? "[ HTML ]" : doc.isPdf ? "[ PDF ]" : doc.link ? "[ LINK ]" : "[ IMAGE ]"}
                        </span>
                      </div>
                      <div className="mt-1 font-heading text-sm font-bold leading-tight">
                        {doc.title}
                      </div>
                      <div
                        className={`mt-1 font-mono-label text-[9px] uppercase tracking-wide ${
                          safeDocIndex === idx ? "text-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {doc.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentDoc ? (
              linkOnly ? (
                <div className="mt-5 overflow-hidden border border-graphene bg-obsidian">
                  <div className="flex items-center justify-between gap-3 border-b border-graphene bg-secondary/30 px-4 py-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-citrine" />
                      <span className="truncate">{currentDoc.title} // {currentDoc.link}</span>
                    </span>
                    <span className="shrink-0">LIVE PREVIEW</span>
                  </div>
                  <iframe
                    key={currentDoc.link}
                    src={currentDoc.link}
                    title={currentDoc.title}
                    className="h-[650px] w-full border-0 bg-white"
                  />
                  <div className="border-t border-graphene px-4 py-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    Preview blank? Some sites block embedding — use “Open Website” above.
                  </div>
                </div>
              ) : hasLink ? (
                <a
                  href={currentDoc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 block w-full text-left"
                >
                  <div className="relative overflow-hidden border border-graphene bg-secondary/20 transition hover:border-foreground">
                    {currentDoc.file && currentDoc.isPdf ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian pointer-events-none">
                        <object
                          data={`${currentDoc.file}#view=FitH`}
                          type="application/pdf"
                          className="h-full w-full object-cover scale-105 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                      </div>
                    ) : currentDoc.file ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian">
                        <Image
                          src={currentDoc.file}
                          alt={currentDoc.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                          fittingType="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                      </div>
                    ) : null}
                    <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      <div className="min-w-0 flex-1">
                        <div className="font-mono-label text-[10px] uppercase tracking-widest text-citrine flex items-center gap-1.5">
                          <ExternalLink className="h-3 w-3" /> External Workspace // Link Redirect
                        </div>
                        <div className="mt-1 font-heading text-xl font-bold text-foreground group-hover:text-citrine transition truncate">
                          {currentDoc.title}
                        </div>
                        <p className="mt-1 font-mono-label text-[11px] text-muted-foreground truncate w-full">
                          {currentDoc.link}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ) : currentDoc.isHtml ? (
                <div className="mt-5 overflow-hidden border border-graphene bg-obsidian">
                  <div className="flex items-center justify-between border-b border-graphene bg-secondary/30 px-4 py-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Code className="h-3.5 w-3.5 text-citrine" />
                      {currentDoc.title} // {currentDoc.fileName}
                    </span>
                  </div>

                  <div className="w-full h-[650px] relative bg-obsidian overflow-hidden">
                    <iframe
                      key={currentDoc.file}
                      src={currentDoc.file}
                      title={currentDoc.title}
                      className="absolute top-0 left-0 border-0 bg-obsidian"
                      style={{
                        width: '333.33%',
                        height: '333.33%',
                        transform: 'scale(0.30)',
                        transformOrigin: '0 0',
                      }}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
                    />
                  </div>
                </div>
              ) : currentDoc.isPdf ? (
                <div className="mt-5 overflow-hidden border border-graphene bg-obsidian">
                  <div className="flex items-center justify-between border-b border-graphene bg-secondary/30 px-4 py-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-citrine" />
                      {currentDoc.title} // {currentDoc.fileName}
                    </span>
                    <span>
                      {docs.length > 1
                        ? `DOC ${safeDocIndex + 1} OF ${docs.length}`
                        : "PREVIEW ACTIVE"}
                    </span>
                  </div>
                  <object
                    key={currentDoc.file}
                    data={`${currentDoc.file}#view=FitH`}
                    type="application/pdf"
                    className="h-[650px] w-full bg-obsidian"
                  >
                    <div className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
                      <FileText className="h-12 w-12 text-citrine" />
                      <div className="mt-3 font-heading text-xl font-bold tracking-tight text-foreground">
                        {currentDoc.title}
                      </div>
                      <p className="mt-2 max-w-md font-mono-label text-[11px] leading-relaxed text-muted-foreground">
                        Direct PDF viewing is available. Use the actions above to open or view the complete document.
                      </p>
                    </div>
                  </object>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group mt-5 block w-full text-left cursor-pointer"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-graphene bg-obsidian sm:aspect-[4/3]">
                    <Image
                      src={currentDoc.file}
                      alt={currentDoc.title}
                      className="h-full w-full object-cover transition group-hover:opacity-90"
                      fittingType="fit"
                    />
                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-obsidian/80 via-transparent to-transparent p-4">
                      <div>
                        <div className="font-heading text-base font-bold text-foreground">
                          {currentDoc.title}
                        </div>
                        <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                          Click to enlarge
                        </span>
                      </div>
                      <span className="font-mono-label text-[10px] uppercase tracking-widest text-citrine">
                        [ Visual Sheet ]
                      </span>
                    </div>
                  </div>
                </button>
              )
            ) : (
              <div className="mt-5 border border-graphene bg-secondary/20 p-8 text-center font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
                FILE PENDING // CV ON REQUEST
              </div>
            )}
          </section>

          {/* Direct contact */}
          {member.contact && (
            <section className="py-10">
              <a
                href={`mailto:${member.contact}`}
                className="group flex items-center justify-between border border-graphene p-6 transition hover:border-foreground hover:bg-secondary/40"
              >
                <span>
                  <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    Direct Line
                  </span>
                  <span className="mt-1 block font-heading text-2xl font-bold tracking-tight text-foreground">
                    {member.contact}
                  </span>
                </span>
                <Mail className="h-6 w-6 text-foreground transition group-hover:translate-x-1" />
              </a>
            </section>
          )}

          {/* Next dossier */}
          {next && (
            <Link
              to={`/team/${next.id}`}
              className="group flex items-center justify-between border-t border-graphene pt-8"
            >
              <span>
                <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                  Next Dossier // {next.index}
                </span>
                <span className="mt-1 block font-heading text-3xl font-extrabold tracking-tight transition group-hover:text-foreground">
                  {next.name}
                </span>
              </span>
              <ArrowRight className="h-8 w-8 text-foreground transition group-hover:translate-x-2" />
            </Link>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}

      {/* 1. Lightbox Popup with safe type rendering */}
      {lightboxOpen && currentDoc && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-obsidian/95 backdrop-blur-sm animate-fade-in">
          <PreviewHeader
            title={currentDoc.title}
            zoom={popupZoom}
            setZoom={setPopupZoom}
            onClose={() => setLightboxOpen(false)}
          />
          <div className="flex-1 overflow-hidden p-4 md:p-8 bg-secondary/10">
            {linkOnly ? (
              /* Website: reflow like the HTML preview so zooming out shows more of the page */
              <div className="relative h-full w-full overflow-auto border border-graphene shadow-2xl bg-white">
                <iframe
                  src={currentDoc.link}
                  title={currentDoc.title}
                  className="border-0 bg-white"
                  style={{
                    width: `${100 / popupZoom}%`,
                    height: `${100 / popupZoom}%`,
                    transform: `scale(${popupZoom})`,
                    transformOrigin: "0 0",
                  }}
                />
              </div>
            ) : (
              /* PDF / image: frame stays fixed, only the media inside zooms */
              <div className="relative flex h-full w-full overflow-auto border border-graphene shadow-2xl bg-obsidian">
                {currentDoc.isPdf ? (
                  <object
                    key={popupZoom}
                    data={`${currentDoc.file}#${popupZoom === 1 ? "view=FitH" : `zoom=${Math.round(popupZoom * 100)}`}`}
                    type="application/pdf"
                    className="h-full w-full shrink-0 bg-obsidian"
                  />
                ) : (
                  <div
                    className="m-auto shrink-0 transition-[width,height] duration-200"
                    style={{ width: `${popupZoom * 100}%`, height: `${popupZoom * 100}%` }}
                  >
                    <Image
                      src={currentDoc.file}
                      alt={currentDoc.title}
                      className="h-full w-full object-contain"
                      fittingType="fit"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. HTML Interactive Zoom Popup */}
      {htmlPopupOpen && currentDoc && currentDoc.isHtml && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-obsidian/95 backdrop-blur-sm animate-fade-in">
          <PreviewHeader
            title={currentDoc.title}
            zoom={popupZoom}
            setZoom={setPopupZoom}
            onClose={() => setHtmlPopupOpen(false)}
          />
          <div className="flex-1 overflow-hidden p-4 md:p-8 bg-secondary/10">
            <div className="relative h-full w-full overflow-auto bg-white shadow-2xl border border-graphene">
              <iframe
                src={currentDoc.file}
                title={currentDoc.title}
                className="border-0 bg-white"
                style={{
                  width: `${100 / popupZoom}%`,
                  height: `${100 / popupZoom}%`,
                  transform: `scale(${popupZoom})`,
                  transformOrigin: "0 0",
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}