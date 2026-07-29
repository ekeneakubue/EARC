import AdminShell from "../components/AdminShell";
import { getDbErrorMessage } from "../../lib/db";
import { getAdminNewsItems } from "../../lib/news-data";
import NewsManager from "./NewsManager";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  try {
    const items = await getAdminNewsItems();

    return (
      <AdminShell title="News" subtitle="Manage homepage news feed items">
        <NewsManager items={items} />
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell title="News" subtitle="Manage homepage news feed items">
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
