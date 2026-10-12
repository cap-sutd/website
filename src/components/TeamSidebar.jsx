import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { teamMembers, collective } from "@/data/team";
import { Image } from "@/components/ui/image";

// The "Drop-Side" Navigator — fixed left sidebar (20% width on desktop)
// and responsive sticky top bar / full-screen drawer on mobile.
export default function TeamSidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef(null);

  const activeId = location.pathname.split("/").pop();

  // Auto-collapse on mobile when navigating
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setExpanded(false);
    }
  }, [location.pathname]);

  // Keep desktop expanded on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setExpanded(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile drawer is expanded
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  const onMouseMove = (e) => {
    if (!sidebarRef.current) return;
    const rect = sidebarRef.current.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMobileNavClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setExpanded(false);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      onMouseMove={onMouseMove}
      className={`bg-obsidian border-graphene ${
        expanded
          ? "fixed inset-0 z-50 flex h-screen w-full flex-col md:fixed md:left-0 md:top-0 md:z-40 md:h-screen md:w-1/5 lg:w-[20%] md:border-r md:border-b-0"
          : "sticky top-0 z-30 flex w-full flex-col border-b md:fixed md:left-0 md:top-0 md:z-40 md:h-screen md:w-1/5 lg:w-[20%] md:border-r md:border-b-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-graphene px-5 py-4 md:block md:p-5">
        <Link to="/" onClick={handleMobileNavClick} className="group block">
          <div className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {collective.unit}
          </div>
          <div className="mt-0.5 font-heading text-xl font-extrabold tracking-tight text-foreground md:mt-1 md:text-2xl">
            {collective.name}
            <span className="text-foreground">.</span>
          </div>
        </Link>

        {/* Mobile toggle button */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 border border-graphene bg-secondary/40 px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:border-foreground hover:bg-secondary md:hidden"
          aria-expanded={expanded}
          aria-label={expanded ? "Close menu" : "Open directory menu"}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              expanded ? "bg-citrine" : "bg-citrine animate-pulse-dot"
            }`}
          />
          <span>{expanded ? "[ Close ✕ ]" : "[ Directory ▾ ]"}</span>
        </button>
      </div>

      {/* Directory label (desktop and expanded mobile) */}
      <div
        className={`items-center justify-between border-b border-graphene px-5 py-3 ${
          expanded ? "flex" : "hidden md:flex"
        }`}
      >
        <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          / Directory
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="font-mono-label text-[10px] uppercase tracking-widest text-foreground transition hover:text-foreground"
        >
          {expanded ? "[ Collapse ]" : "[ Expand ]"}
        </button>
      </div>

      {/* Member directory */}
      {expanded ? (
        <nav className="relative flex-1 overflow-y-auto">
          <ul className="divide-y divide-graphene">
            <li>
              <Link
                to="/team"
                onClick={handleMobileNavClick}
                className={`flex items-center justify-between px-5 py-3.5 transition ${
                  location.pathname === "/team"
                    ? "bg-secondary text-foreground"
                    : "text-foreground hover:bg-secondary/60"
                }`}
              >
                <span className="font-mono-label text-[13px] uppercase tracking-wide">
                  Overview
                </span>
                <span className="font-mono-label text-[10px] text-muted-foreground">00</span>
              </Link>
            </li>
            {teamMembers.map((m) => {
              const isActive = activeId === m.id;
              return (
                <li
                  key={m.id}
                  onMouseEnter={() => setHovered(m)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Link
                    to={`/team/${m.id}`}
                    onClick={handleMobileNavClick}
                    className={`flex items-center justify-between px-5 py-3.5 transition ${
                      isActive ? "bg-secondary text-foreground" : "text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          m.pitchReady ? "bg-citrine animate-pulse-dot" : "bg-foreground/30"
                        }`}
                      />
                      <span className="font-mono-label text-[13px] uppercase tracking-wide">
                        {m.name}
                      </span>
                    </span>
                    <span className="font-mono-label text-[10px] text-muted-foreground">
                      {m.index}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Kinetic ghost image — follows cursor within sidebar bounds (desktop only) */}
          {hovered && (
            <div
              className="pointer-events-none absolute z-10 hidden h-44 w-36 overflow-hidden border border-graphene opacity-20 transition-opacity duration-200 md:block"
              style={{
                left: Math.min(cursor.x + 18, (sidebarRef.current?.offsetWidth ?? 200) - 150),
                top: Math.min(cursor.y - 88, (sidebarRef.current?.offsetHeight ?? 800) - 180),
              }}
            >
              <Image
                src={hovered.image}
                alt={hovered.name}
                className="h-full w-full object-cover grayscale"
                fittingType="fill"
              />
            </div>
          )}
        </nav>
      ) : (
        <div className="hidden flex-1 items-center justify-center p-6 text-center md:flex">
          <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
            Directory Collapsed
          </span>
        </div>
      )}

      {/* Footer of sidebar */}
      <div
        className={`border-t border-graphene p-5 ${
          expanded ? "block" : "hidden md:block"
        }`}
      >
        <div className="font-mono-label text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {collective.cohort}
        </div>
      </div>
    </aside>
  );
}