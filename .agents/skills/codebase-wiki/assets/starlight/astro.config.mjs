import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMermaid from "remark-mermaidjs";
import { starlightSidebar } from "./.starlight/sidebar.generated.mjs";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  integrations: [
    starlight({
      title: "__WIKI_TITLE__",
      description: "__WIKI_TITLE__ — 架构分析、技术讨论、参考手册与路线图",
      __SOCIAL_LINKS__
      defaultLocale: "root",
      locales: {
        root: { label: "简体中文", lang: "zh-CN" },
      },
      sidebar: starlightSidebar,
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      credits: false,
    }),
  ],
});
