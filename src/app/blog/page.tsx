import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Blog & Shipping Tips",
  description:
    "International shipping guides, customs tips, and logistics insights from the Gardian Logistics team.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="container-site section-padding">
      <SectionHeading
        eyebrow="Blog"
        title="Shipping Tips & Insights"
        description="Practical guides on international shipping, customs clearance, and cost optimization from our logistics experts."
        align="center"
        className="mb-12"
      />

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col rounded-xl border border-navy-100 bg-white shadow-card transition hover:shadow-elevated"
          >
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 text-xs text-navy-500">
                <span className="rounded bg-accent-100 px-2 py-0.5 font-medium text-accent-700">
                  {post.category}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-navy-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent-600">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-navy-400">
                <time dateTime={post.date}>
                  {new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(post.date))}
                </time>
                <Link href={`/blog/${post.slug}`} className="font-semibold text-accent-600 hover:text-accent-500">
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
