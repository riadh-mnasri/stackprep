import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { topics } from "@/content/topics";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const staticPaths = ["", "/practice", "/test"];
  const topicPaths = topics.map((topic) => `/practice/${topic.id}`);
  const paths = [...staticPaths, ...topicPaths];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
        ),
      },
    })),
  );
}
