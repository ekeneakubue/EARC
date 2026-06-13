import AdminShell from "../components/AdminShell";

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="System and site configuration">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">General Settings</h2>
          <p className="mb-6 text-sm text-muted">Basic site information</p>
          <div className="space-y-4">
            {[
              { label: "Organization Name", value: "Education And Research Consortium" },
              { label: "Contact Email", value: "info@earc.org" },
              { label: "Default Region", value: "Africa & Beyond" },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                </label>
                <input
                  type="text"
                  defaultValue={field.value}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Notifications</h2>
          <p className="mb-6 text-sm text-muted">Email alerts for admin events</p>
          <div className="space-y-4">
            {[
              "New inquiry submissions",
              "Training enrollment updates",
              "User account changes",
              "Weekly summary reports",
            ].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Security</h2>
          <p className="mb-6 text-sm text-muted">Access and authentication</p>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted">Require 2FA for all admin accounts</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Session Timeout</p>
                <p className="text-xs text-muted">Auto-logout after inactivity</p>
              </div>
              <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Save Changes
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
