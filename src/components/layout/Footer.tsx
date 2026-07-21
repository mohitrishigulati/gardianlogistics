import Link from "next/link";
import { offices } from "@/data/offices";
import { navLinks, siteConfig } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const delhi = offices.find((o) => o.id === "delhi")!;
  const london = offices.find((o) => o.id === "london")!;

  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-200">
      <div className="container-site section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" className="mb-4" />
            <p className="text-sm leading-relaxed text-navy-300">
              International courier and freight forwarding since {siteConfig.founded}.
              Competitive rates through our global partner network.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-navy-400">
              {siteConfig.partnerDisclaimer}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition hover:text-accent-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {delhi.city} Office {delhi.isHQ && "(HQ)"}
            </h3>
            <address className="not-italic text-sm leading-relaxed text-navy-300">
              {delhi.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`tel:${delhi.phone.replace(/\s/g, "")}`} className="mt-2 block hover:text-accent-400">
                {delhi.phone}
              </a>
              <a href={`mailto:${delhi.email}`} className="block hover:text-accent-400">
                {delhi.email}
              </a>
            </address>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {london.city} Office
            </h3>
            <address className="not-italic text-sm leading-relaxed text-navy-300">
              {london.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`tel:${london.phone.replace(/\s/g, "")}`} className="mt-2 block hover:text-accent-400">
                {london.phone}
              </a>
              <a href={`mailto:${london.email}`} className="block hover:text-accent-400">
                {london.email}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-8 sm:flex-row">
          <p className="text-sm text-navy-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-400 transition hover:text-accent-400"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-400 transition hover:text-accent-400"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
