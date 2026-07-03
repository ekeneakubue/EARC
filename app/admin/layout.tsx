import type { Metadata } from "next";
import { BadgesProvider } from "./components/BadgesContext";
import { getSidebarBadges } from "./lib/badges";

export const metadata: Metadata = {
  title: "Admin Dashboard | EARC",
  description: "EARC Super Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const badges = await getSidebarBadges();

  return (
    <div className="min-h-screen">
      <BadgesProvider badges={badges}>{children}</BadgesProvider>
    </div>
  );
}
