import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPages = ["", "/services", "/track", "/quote", "/about", "/contact", "/faq", "/blog"];

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/track" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/track" ? 0.9 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
