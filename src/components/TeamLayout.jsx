import React from "react";
import { Outlet } from "react-router-dom";
import TeamSidebar from "@/components/TeamSidebar";

// Shared layout for the team section — the fixed sidebar never disappears.
// Main content slides up behind it ("Locked Frame" scroll).
export default function TeamLayout() {
  return (
    <div className="min-h-screen bg-obsidian">
      <TeamSidebar />
      <main className="md:ml-[20%]">
        <Outlet />
      </main>
    </div>
  );
}