import AdminShell from "../components/AdminShell";
import { getDbErrorMessage } from "../../lib/db";
import { getAdminContentSections } from "../../lib/content-data";
import ContentManager from "./ContentManager";

export default async function AdminContentPage() {
  try {
    const sections = await getAdminContentSections();

    return (
      <AdminShell title="Content" subtitle="Manage website sections and pages">
        <ContentManager sections={sections} />
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell title="Content" subtitle="Manage website sections and pages">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700"
        >
          {getDbErrorMessage(error)}
        </div>
      </AdminShell>
    );
  }
}
