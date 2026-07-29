"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  changePasswordAction,
  updateSettingsAction,
  type ChangePasswordState,
  type UpdateSettingsState,
} from "../../actions/settings";
import PasswordInput from "../../components/PasswordInput";
import type { SiteSettingsData } from "../../lib/site-settings";

type SettingsManagerProps = {
  settings: SiteSettingsData | null;
  canEditSiteSettings: boolean;
  user: {
    name: string;
    email: string;
  };
};

const initialSettingsState: UpdateSettingsState = {};
const initialPasswordState: ChangePasswordState = {};

export default function SettingsManager({
  settings,
  canEditSiteSettings,
  user,
}: SettingsManagerProps) {
  const router = useRouter();
  const [settingsState, settingsAction, settingsPending] = useActionState(
    updateSettingsAction,
    initialSettingsState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    initialPasswordState,
  );

  useEffect(() => {
    if (settingsState.success) {
      router.refresh();
    }
  }, [settingsState.success, router]);

  useEffect(() => {
    if (passwordState.success) {
      router.refresh();
    }
  }, [passwordState.success, router]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {canEditSiteSettings && settings && (
        <form action={settingsAction} className="space-y-6">
          {settingsState.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {settingsState.error}
            </div>
          )}

          {settingsState.success && (
            <div
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              Settings saved successfully.
            </div>
          )}

          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-semibold text-foreground">General Settings</h2>
            <p className="mb-6 text-sm text-muted">Basic site information</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="organizationName" className="mb-1.5 block text-sm font-medium text-foreground">
                  Organization Name
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  defaultValue={settings.organizationName}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="mb-1.5 block text-sm font-medium text-foreground">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  required
                  defaultValue={settings.contactEmail}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="defaultRegion" className="mb-1.5 block text-sm font-medium text-foreground">
                  Default Region
                </label>
                <input
                  id="defaultRegion"
                  name="defaultRegion"
                  type="text"
                  required
                  defaultValue={settings.defaultRegion}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="mb-6 text-sm text-muted">Email alerts for admin events</p>
            <div className="space-y-4">
              {[
                { name: "notifyNewInquiries", label: "New inquiry submissions", checked: settings.notifyNewInquiries },
                { name: "notifyTrainingUpdates", label: "Training enrollment updates", checked: settings.notifyTrainingUpdates },
                { name: "notifyUserChanges", label: "User account changes", checked: settings.notifyUserChanges },
                { name: "notifyWeeklyReports", label: "Weekly summary reports", checked: settings.notifyWeeklyReports },
              ].map((item) => (
                <label key={item.name} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <input
                    type="checkbox"
                    name={item.name}
                    defaultChecked={item.checked}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-semibold text-foreground">Security</h2>
            <p className="mb-6 text-sm text-muted">Access and authentication preferences</p>
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted">Require 2FA for all admin accounts</p>
                </div>
                <input
                  type="checkbox"
                  name="requireTwoFactor"
                  defaultChecked={settings.requireTwoFactor}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Session Timeout</p>
                  <p className="text-xs text-muted">Auto-logout after inactivity</p>
                </div>
                <select
                  name="sessionTimeoutMinutes"
                  defaultValue={String(settings.sessionTimeoutMinutes)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </select>
              </label>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={settingsPending}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {settingsPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      <form
        key={passwordState.success ? "password-reset" : "password-form"}
        action={passwordAction}
        className="rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <h2 className="font-semibold text-foreground">Change Password</h2>
        <p className="mb-6 text-sm text-muted">
          Update the password for {user.name} ({user.email}).
        </p>

        {passwordState.error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {passwordState.error}
          </div>
        )}

        {passwordState.success && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            Password updated successfully.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium text-foreground">
              Current password
            </label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-foreground">
              New password
            </label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
              Confirm new password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-lg border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground hover:bg-surface disabled:cursor-not-allowed disabled:opacity-70"
          >
            {passwordPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
