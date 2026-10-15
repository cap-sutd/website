import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { teamMembers, collective } from "@/data/team";
import { Users, FolderGit2, PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react";

export default function TeamSidebar({ expanded, setExpanded }) {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef(null);

  const activeId = location.pathname.split("/").pop();

  const onMouseMove = (e) => {
    setCursor({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {/* MOBILE TOP BAR (Visible only when sidebar is closed on small screens) */}
      {!expanded && (
        <div className="fixed left-0 top-0 z-40 flex w-full items-center justify-between border-b border-graphene bg-obsidian px-5 py-4 md:hidden">
          <Link to="/" className="font-heading text-xl font-extrabold text-foreground">
            {collective.name}.
          </Link>
          <button onClick={() => setExpanded(true)} className="text-foreground">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* COLLAPSIBLE SIDEBAR */}
      <aside
        ref={sidebarRef}
        onMouseMove={onMouseMove}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-graphene bg-obsidian transition-all duration-300 ${
          expanded ? "w-full md:w-72" : "-translate-x-full md:w-16 md:translate-x-0"
        }`}
      >
        {/* Header / Toggle Area */}
        <div className={`flex h-16 items-center border-b border-graphene ${expanded ? "justify-between px-4" : "justify-center px-0"}`}>
          {expanded && (
            <Link to="/" className="group block overflow-hidden whitespace-nowrap">
              <div className="font-mono-label text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {collective.unit}
              </div>
              <div className="font-heading text-xl font-extrabold tracking-tight text-foreground mt-0.5">
                {collective.name}.
              </div>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={`flex shrink-0 items-center justify-center rounded border border-transparent text-foreground transition hover:border-graphene hover:bg-secondary ${
              expanded ? "p-1.5" : "p-2 mx-auto w-10 h-10"
            }`}
            title={expanded ? "Collapse Sidebar" : "Open Sidebar"}
          >
            {expanded ? (
              <PanelLeftClose className="hidden h-5 w-5 md:block" />
            ) : (
              <PanelLeftOpen className="hidden h-5 w-5 md:block" />
            )}
            {expanded && <X className="h-6 w-6 md:hidden" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 py-4 space-y-2">
          <Link
            to="/team"
            className={`flex items-center rounded-md font-mono-label text-sm uppercase transition ${
              expanded ? "gap-4 px-3 py-3 tracking-wider" : "justify-center p-3 w-10 h-10 mx-auto"
            } ${location.pathname === "/team" ? "bg-secondary text-foreground" : "text-foreground hover:bg-secondary/50"}`}
            title="Collective"
          >
            <Users className="h-5 w-5 shrink-0 text-citrine" />
            {expanded && <span>Collective</span>}
          </Link>

          {expanded && (
            <div className="mb-5 mt-2 flex flex-col space-y-1 border-l border-graphene ml-[23px] pl-4">
              {teamMembers.map((m) => {
                const isActive = activeId === m.id;
                return (
                  <Link
                    key={m.id}
                    to={`/team/${m.id}`}
                    onMouseEnter={() => setHovered(m)}
                    onMouseLeave={() => setHovered(null)}
                    className={`flex items-center justify-between px-3 py-2.5 font-mono-label text-xs uppercase tracking-widest transition rounded-sm ${
                      isActive
                        ? "bg-secondary/80 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3 truncate">
                      <span
                        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                          m.pitchReady ? "bg-citrine animate-pulse-dot" : "bg-foreground/30"
                        }`}
                      />
                      <span className="truncate">{m.name}</span>
                    </span>
                    <span className="text-[10px] opacity-50 shrink-0">{m.index}</span>
                  </Link>
                );
              })}
            </div>
          )}

          <Link
            to="/showcase"
            className={`flex items-center rounded-md font-mono-label text-sm uppercase transition ${
              expanded ? "gap-4 px-3 py-3 tracking-wider" : "justify-center p-3 w-10 h-10 mx-auto"
            } ${location.pathname === "/showcase" ? "bg-secondary text-foreground" : "text-foreground hover:bg-secondary/50"}`}
            title="Showcase"
          >
            <FolderGit2 className="h-5 w-5 shrink-0 text-citrine" />
            {expanded && <span>Showcase</span>}
          </Link>
        </nav>

        {hovered && expanded && (
          <div
            className="pointer-events-none fixed z-50 hidden h-44 w-36 overflow-hidden border border-graphene opacity-20 transition-opacity duration-200 md:block shadow-2xl"
            style={{
              left: Math.min(cursor.x + 24, window.innerWidth - 160),
              top: Math.min(cursor.y - 88, window.innerHeight - 190),
            }}
          >
            <img
              src={hovered.image}
              alt={hovered.name}
              className="h-full w-full object-cover grayscale"
            />
          </div>
        )}

        <div className={`border-t border-graphene p-4 ${expanded ? "block" : "hidden"}`}>
          <div className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-muted-foreground truncate">
            {expanded ? collective.cohort : "C.01"}
          </div>
        </div>
      </aside>
    </>
  );
}