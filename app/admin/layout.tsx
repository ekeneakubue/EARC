import type { Metadata } from "next";
import { getSession } from "../lib/auth";
import { BadgesProvider } from "./components/BadgesContext";
import { SessionProvider } from "./components/SessionContext";
import { getSidebarBadges } from "./lib/badges";

export const metadata: Metadata = {
  title: "Admin Dashboard | EARC",
  description: "EARC Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const badges = await getSidebarBadges(session);

  return (
    <div className="min-h-screen">
      <SessionProvider session={session}>
        <BadgesProvider badges={badges}>{children}</BadgesProvider>
      </SessionProvider>
    </div>
  );
}
