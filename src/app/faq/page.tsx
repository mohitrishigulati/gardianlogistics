"use client";

import { useState } from "react";
import { faqCategories, faqs } from "@/data/faqs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered =
    activeCategory === "all" ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="container-site section-padding">
      <SectionHeading
        eyebrow="FAQs"
        title="Frequently Asked Questions"
        description="Answers to common questions about tracking, customs, delivery timelines, payments, and our partner carrier network."
        align="center"
        className="mb-10"
      />

      <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-navy-900 text-white"
              : "bg-surface text-navy-600 hover:bg-navy-100"
          }`}
        >
          All
        </button>
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.id
                ? "bg-navy-900 text-white"
                : "bg-surface text-navy-600 hover:bg-navy-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-navy-100 rounded-xl border border-navy-100 bg-white">
        {filtered.map((faq) => (
          <div key={faq.id}>
            <h2>
              <button
                type="button"
                id={`faq-${faq.id}`}
                aria-expanded={openId === faq.id}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-navy-900 hover:bg-surface"
              >
                {faq.question}
                <span className="ml-4 shrink-0 text-accent-500" aria-hidden="true">
                  {openId === faq.id ? "−" : "+"}
                </span>
              </button>
            </h2>
            {openId === faq.id && (
              <div
                id={`faq-panel-${faq.id}`}
                role="region"
                aria-labelledby={`faq-${faq.id}`}
                className="px-6 pb-4 text-sm leading-relaxed text-navy-600"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
