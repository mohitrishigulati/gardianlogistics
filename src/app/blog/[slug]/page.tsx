import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog";
import { createMetadata } from "@/lib/metadata";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container-site section-padding">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-medium text-accent-600 hover:text-accent-500">
          ← Back to Blog
        </Link>
        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-navy-500">
            <span className="rounded bg-accent-100 px-2 py-0.5 font-medium text-accent-700">
              {post.category}
            </span>
            <time dateTime={post.date}>
              {new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(post.date))}
            </time>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-navy-500">By {post.author}</p>
        </header>
        <div className="prose prose-navy mt-10 max-w-none">
          {post.content.map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed text-navy-700">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-surface p-6 text-center">
          <p className="font-medium text-navy-900">Need help with your shipment?</p>
          <Link href="/quote" className="btn-primary mt-4 inline-flex">
            Get a Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
