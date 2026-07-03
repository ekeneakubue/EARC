"use client";

import { createContext, useContext } from "react";
import type { SidebarBadges } from "../lib/data";

const BadgesContext = createContext<SidebarBadges | undefined>(undefined);

export function BadgesProvider({
  badges,
  children,
}: {
  badges: SidebarBadges;
  children: React.ReactNode;
}) {
  return (
    <BadgesContext.Provider value={badges}>{children}</BadgesContext.Provider>
  );
}

export function useBadges() {
  return useContext(BadgesContext);
}
