import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getSiteSettings } from "../../lib/site-settings";
import { isSuperAdmin } from "../../lib/user-permissions";
import AdminShell from "../components/AdminShell";
import SettingsManager from "./SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const canEditSiteSettings = isSuperAdmin(session.role);
  const settings = canEditSiteSettings ? await getSiteSettings() : null;

  return (
    <AdminShell
      title="Settings"
      subtitle={
        canEditSiteSettings
          ? "System and site configuration"
          : "Manage your account password"
      }
    >
      <SettingsManager
        settings={settings}
        canEditSiteSettings={canEditSiteSettings}
        user={{ name: session.name, email: session.email }}
      />
    </AdminShell>
  );
}
