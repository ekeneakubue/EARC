import { navLinks, site } from "../lib/content";

function LogoMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-9 shrink-0"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" className="fill-primary-light" />
      <path
        d="M10 28V12h4.2l5.8 9.4V12H24v16h-4.2l-5.8-9.4V28H10z"
        className="fill-white"
      />
      <circle cx="30" cy="12" r="3" className="fill-accent" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="EARC Logo" className="h-20 w-20 bg-white rounded-full p-2"/>
              <div>
                <p className="font-display text-xl font-semibold">{site.shortName}</p>
                <p className="text-sm text-white/70">{site.name}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
              Advancing evidence-based decision-making, capacity development, and
              sustainable community transformation across Africa and beyond.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-light">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-light">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>
                <span className="block text-white/50">Email</span>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block text-white/50">Region</span>
                {site.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/50">
            Powered by : &nbsp; <a href="https://www.expertmediasolution.com/" className="text-white">Expert Media Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
