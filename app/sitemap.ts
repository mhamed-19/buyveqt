import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://buyveqt.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/compare`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/inside-veqt`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/distributions`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/methodology`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic comparison pages
  const comparisonSlugs = ["veqt-vs-xeqt", "veqt-vs-zeqt", "veqt-vs-vgro"];
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map(
    (slug) => ({
      url: `${baseUrl}/compare/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // Dynamic learn article pages
  const contentDir = path.join(process.cwd(), "content", "learn");
  const articleSlugs = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...comparisonPages, ...articlePages];
}
