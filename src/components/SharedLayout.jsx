import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TeamSidebar from "@/components/TeamSidebar";

export default function SharedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // CRITICAL FIX: "overflow-x-hidden" is REMOVED so sticky positioning works!
    <div className="block min-h-screen bg-obsidian text-foreground">
      <TeamSidebar expanded={isSidebarOpen} setExpanded={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 pt-16 md:pt-0 ${
          isSidebarOpen ? "md:ml-72" : "md:ml-16"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}