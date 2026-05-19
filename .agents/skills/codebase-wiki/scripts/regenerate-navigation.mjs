#!/usr/bin/env node
/**
 * Scan codebase-wiki/{architecture,discussion,issue,reference,roadmap}/*.md for frontmatter
 * `id` + `title`, then rewrite the `navigation.groups` inside codebase-wiki/docs.json
 * (Mintlify configuration).
 *
 * Usage: node regenerate-navigation.mjs --root <project-root>
 */

import fs from "node:fs";
import path from "node:path";

const WIKI_DIR = "codebase-wiki";

const CATEGORIES = [
  { dir: "architecture", group: "架构分析", icon: "building" },
  { dir: "discussion", group: "技术讨论", icon: "comments" },
  { dir: "issue", group: "Issue 记录", icon: "triangle-exclamation" },
  { dir: "reference", group: "参考手册", icon: "book" },
  { dir: "roadmap", group: "规划路线", icon: "road" },
];

function parseArgs(argv) {
  const out = { root: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) {
      out.root = path.resolve(argv[++i]);
    }
  }
  return out;
}

function readFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const block = m[1];
  const map = {};
  for (const line of block.split(/\r?\n/)) {
    const lm = line.match(/^([\w-]+):\s*(.*)$/);
    if (lm) map[lm[1]] = lm[2].trim();
  }
  return map;
}

function idSortKey(id) {
  const s = String(id || "");
  const m = s.match(/^([ADIRP])-(\d{3})$/);
  if (!m) return [999, s];
  const prefixOrder = { A: 0, D: 1, I: 2, R: 3, P: 4 };
  return [prefixOrder[m[1]] ?? 50, Number(m[2], 10)];
}

function compareById(a, b) {
  const ka = idSortKey(a.id);
  const kb = idSortKey(b.id);
  if (ka[0] !== kb[0]) return ka[0] - kb[0];
  if (typeof ka[1] === "number" && typeof kb[1] === "number")
    return ka[1] - kb[1];
  return String(ka[1]).localeCompare(String(kb[1]));
}

function main() {
  const { root } = parseArgs(process.argv);
  const wikiRoot = path.join(root, WIKI_DIR);
  const docsJsonPath = path.join(wikiRoot, "docs.json");

  if (!fs.existsSync(wikiRoot)) {
    console.error(`Missing wiki directory: ${wikiRoot}`);
    process.exit(1);
  }

  if (!fs.existsSync(docsJsonPath)) {
    console.error(
      `Missing docs.json: ${docsJsonPath}\nRun init-mintlify.mjs first.`,
    );
    process.exit(1);
  }

  // Read existing docs.json
  const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, "utf8"));

  // Build navigation groups
  const groups = [
    {
      group: "首页",
      pages: ["INDEX"],
    },
  ];

  for (const { dir, group, icon } of CATEGORIES) {
    const dirPath = path.join(wikiRoot, dir);
    const pages = [];

    if (fs.existsSync(dirPath)) {
      const names = fs
        .readdirSync(dirPath)
        .filter((n) => n.endsWith(".md") || n.endsWith(".mdx"))
        .sort();

      const metas = [];
      for (const name of names) {
        const fp = path.join(dirPath, name);
        const fm = readFrontmatter(fp);
        if (!fm || !fm.id) continue;
        // Mintlify uses path relative to content root, without extension
        const base = name.replace(/\.mdx?$/i, "");
        const pagePath = `${dir}/${base}`;
        metas.push({ id: fm.id, pagePath });
      }
      metas.sort(compareById);
      for (const row of metas) {
        pages.push(row.pagePath);
      }
    }

    groups.push({
      group,
      icon,
      pages,
    });
  }

  // Update navigation in docs.json
  docsJson.navigation = docsJson.navigation || {};
  docsJson.navigation.groups = groups;

  fs.writeFileSync(docsJsonPath, JSON.stringify(docsJson, null, 2) + "\n", "utf8");
  console.log(`Wrote ${path.relative(root, docsJsonPath)}`);
}

main();
