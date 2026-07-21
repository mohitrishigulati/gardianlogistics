"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "gardian_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-navy-200 bg-white p-4 shadow-elevated md:p-6"
    >
      <div className="container-site flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 id="cookie-title" className="text-sm font-semibold text-navy-900">
            Cookie & Privacy Notice
          </h2>
          <p id="cookie-desc" className="mt-1 text-sm text-navy-600">
            We use essential cookies to operate this site and optional analytics to improve our
            services. By continuing, you agree to our use of cookies in accordance with UK GDPR
            and applicable Indian data protection regulations.{" "}
            <Link href="/faq" className="font-medium text-accent-600 underline hover:text-accent-500">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button type="button" onClick={decline} className="btn-secondary text-sm">
            Essential Only
          </button>
          <button type="button" onClick={accept} className="btn-primary text-sm">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
