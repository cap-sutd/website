import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMember, teamMembers, collective } from "@/data/team";
import { Image } from "@/components/ui/image";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Mail, FileText, ExternalLink, Download, Code, Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// View 03 — The "Specialist Dossier" (Individual Member Page)
export default function MemberDossier() {
  const { memberId } = useParams();
  const member = getMember(memberId);
  const [activeArtifact, setActiveArtifact] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [category, setCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [htmlPopupOpen, setHtmlPopupOpen] = useState(false);
  const [popupZoom, setPopupZoom] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveArtifact(0);
    setActiveDocIndex(0);
    setCategory("all");
  }, [memberId]);

  if (!member) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-obsidian px-6 text-center">
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
  // link exists but no file → iframe the link
  const linkOnly = hasLink && !currentDoc?.file;
  const showLightbox =
    lightboxOpen && currentDoc && !currentDoc.isHtml && (linkOnly || !hasLink);

  return (
    <div className="min-h-screen bg-obsidian text-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-graphene px-6 py-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-12">
        <Link to="/team" className="flex items-center gap-2 transition hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Collective
        </Link>
        <span>FILE {member.index} // SPECIALIST DOSSIER</span>
        <span className="hidden md:inline">{collective.cohort}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT — fixed portrait */}
        <div className="relative hidden h-screen lg:block lg:sticky lg:top-0">
          <Image
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover "
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

        {/* RIGHT — scrollable intel feed */}
        <div className="px-6 py-10 md:px-12 md:py-16">
          {/* mobile portrait */}
          <div className="relative mb-8 aspect-[4/5] overflow-hidden lg:hidden">
            <Image src={member.image} alt={member.name} className="h-full w-full object-cover" fittingType="fill" />
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
                    {filteredArtifacts[safeActive].description}
                  </p>
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
                        className="inline-flex items-center gap-1.5 border border-graphene px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40"
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
                          className="inline-flex items-center gap-1.5 border border-graphene px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40"
                        >
                          <Maximize2 className="h-3 w-3" /> Expand
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          className="inline-flex items-center gap-1.5 border border-graphene px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary/40"
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

            {/* Document Tabs if member has multiple files */}
            {docs.length > 1 && (
              <div className="mt-6 overflow-x-auto">
                <div className="flex gap-px bg-graphene">
                  {docs.map((doc, idx) => (
                    <button
                      key={doc.id || idx}
                      type="button"
                      onClick={() => setActiveDocIndex(idx)}
                      className={`min-w-[190px] flex-1 border-0 p-4 text-left transition ${
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
                /* LINK ONLY (no file) → IFRAME THE LINK */
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
                /* EXTERNAL LINK REDIRECT CARD (link + file) */
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
                /* HTML VIEW (Reverted to Normal) */
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
                /* PDF VIEW */
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
                /* IMAGE VIEW */
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group mt-5 block w-full text-left"
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

      {/* Lightbox: images, PDF, or link-only iframe */}
      {showLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-foreground/85 p-4 md:p-10"
        >
          {linkOnly ? (
            <>
              <div
                className="flex w-full max-w-5xl items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={currentDoc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-citrine px-3 py-1.5 font-mono-label text-[10px] font-semibold uppercase tracking-widest text-black transition hover:bg-foreground hover:text-citrine cursor-pointer select-none"
                >
                  <ExternalLink className="h-3 w-3 pointer-events-none" /> Open Website
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="font-mono-label text-[11px] uppercase tracking-widest text-background transition hover:opacity-70"
                >
                  [ Close ]
                </button>
              </div>
              <iframe
                src={currentDoc.link}
                title={currentDoc.title}
                className="w-full max-w-5xl flex-1 border-0 bg-white"
                onClick={(e) => e.stopPropagation()}
              />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute right-5 top-5 font-mono-label text-[11px] uppercase tracking-widest text-background transition hover:opacity-70"
              >
                [ Close ]
              </button>
              {currentDoc.isPdf ? (
                <iframe
                  src={`${currentDoc.file}#view=FitH`}
                  title={currentDoc.title}
                  className="h-[85vh] w-full max-w-5xl border-0 bg-white"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img
                  src={currentDoc.file || member.portfolioImage}
                  alt={currentDoc.title || `${member.name} — portfolio & CV`}
                  className="max-h-full max-w-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* HTML Fullscreen Popup Modal with Expanded Width */}
      {htmlPopupOpen && currentDoc && currentDoc.isHtml && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setHtmlPopupOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 md:p-6"
        >
          <div
            className="relative w-full max-w-7xl h-[92vh] bg-obsidian border border-graphene flex flex-col overflow-hidden rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-graphene bg-secondary/40 px-6 py-3 shrink-0">
              <div className="font-mono-label text-xs uppercase tracking-widest text-citrine">
                {currentDoc.title} // Interactive View [{Math.round(popupZoom * 100)}%]
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPopupZoom((prev) => Math.max(0.3, prev - 0.15))}
                  className="inline-flex items-center gap-1 border border-graphene px-2.5 py-1 font-mono-label text-[10px] uppercase tracking-wider text-foreground hover:bg-secondary transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPopupZoom(1)}
                  className="inline-flex items-center gap-1 border border-graphene px-2.5 py-1 font-mono-label text-[10px] uppercase tracking-wider text-foreground hover:bg-secondary transition"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPopupZoom((prev) => Math.min(1.5, prev + 0.15))}
                  className="inline-flex items-center gap-1 border border-graphene px-2.5 py-1 font-mono-label text-[10px] uppercase tracking-wider text-foreground hover:bg-secondary transition"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <div className="h-4 w-px bg-graphene mx-1" />
                <button
                  type="button"
                  onClick={() => setHtmlPopupOpen(false)}
                  className="flex items-center gap-1.5 font-mono-label text-xs uppercase tracking-widest text-foreground hover:text-citrine transition"
                >
                  <X className="h-4 w-4" /> [ Close ]
                </button>
              </div>
            </div>

            {/* Viewport Frame */}
            <div className="flex-1 w-full bg-obsidian relative overflow-hidden">
              <iframe
                src={currentDoc.file}
                title={currentDoc.title}
                className="w-full h-full border-0 bg-obsidian absolute top-0 left-0"
                style={{
                  transform: `scale(${popupZoom})`,
                  transformOrigin: "0 0",
                  width: `${100 / popupZoom}%`,
                  height: `${100 / popupZoom}%`,
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