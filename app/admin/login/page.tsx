import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { site } from "../../lib/content";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | EARC",
  description: "Sign in to the EARC admin dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-primary-dark text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.35) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(26, 107, 107, 0.45) 0%, transparent 40%)
            `,
          }}
        />

        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="EARC Logo"
              width={56}
              height={56}
              className="rounded-full bg-white p-1"
            />
            <div>
              <p className="font-display text-lg font-semibold">{site.shortName}</p>
              <p className="text-xs text-white/60">Admin Portal</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 px-10 pb-16">
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight">
            Manage your platform with confidence
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
            Access the admin dashboard to manage users, services, content, and
            partnership inquiries.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {["Users", "Services", "Inquiries", "Reports"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center bg-background px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="EARC Logo"
                width={48}
                height={48}
                className="rounded-full bg-white p-1 shadow-sm"
              />
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  {site.shortName}
                </p>
                <p className="text-xs text-muted">Admin Portal</p>
              </div>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted">
                Sign in to your admin account to continue
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Authorized personnel only. All access is monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
