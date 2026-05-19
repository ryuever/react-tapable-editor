import { defineConfig } from "vitepress";
import type { MarkdownIt } from "markdown-it";
import { withMermaid } from "vitepress-plugin-mermaid";
import { wikiNav, wikiSidebar } from "./sidebar.generated.mts";

/**
 * Escape bare angle brackets in prose so TypeScript generics are not parsed as HTML.
 */
function escapeAngleBrackets(md: MarkdownIt) {
  const defaultHtmlInline =
    md.renderer.rules.html_inline ||
    ((tokens, idx) => tokens[idx].content);

  md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
    const htmlTagRe =
      /^<\/?(div|span|p|br|hr|img|a|b|i|em|strong|code|pre|ul|ol|li|table|thead|tbody|tr|td|th|h[1-6]|blockquote|details|summary|sup|sub|del|ins|mark|ruby|rt|rp|section|article|aside|nav|header|footer|main|figure|figcaption|caption|col|colgroup|dd|dl|dt|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|button|abbr|address|cite|dfn|kbd|s|samp|small|u|var|wbr|slot|template|component|transition|keep-alive|teleport|suspense)[\s>/]/i;

    if (!htmlTagRe.test(content)) {
      return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    return defaultHtmlInline(tokens, idx, options, env, self);
  };
}

export default withMermaid(
  defineConfig({
  title: "__WIKI_TITLE__",
  description: "__WIKI_TITLE__ — 架构分析、技术讨论、参考手册与路线图",
  lang: "zh-CN",
  srcDir: "./codebase-wiki",
  markdown: {
    defaultHighlightLang: "typescript",
    config: (md) => {
      md.use(escapeAngleBrackets);
    },
  },
  themeConfig: {
    nav: wikiNav,
    sidebar: wikiSidebar,
    search: { provider: "local" },
    socialLinks: [__SOCIAL_LINKS__],
    footer: {
      message: "AI 辅助生成的技术文档",
      copyright: "__WIKI_TITLE__",
    },
    docFooter: { prev: "上一篇", next: "下一篇" },
    outline: { label: "目录", level: [2, 3] },
    lastUpdated: { text: "最后更新于" },
  },
  }),
);
