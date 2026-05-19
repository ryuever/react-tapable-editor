#!/usr/bin/env node
/** Wiki Markdown root inside the target repo (canonical source). */
const WIKI_DIR = "codebase-wiki";

/**
 * Scaffold codebase-wiki/ for Fumadocs projects.
 *
 * Unlike other engines, this init script does not generate framework runtime
 * config. It prepares a canonical wiki source directory and an optional
 * Fumadocs content mirror directory so teams can choose their own source
 * loader/navigation strategy.
 *
 * Usage (from target repo root):
 *   node <path-to-this-skill>/scripts/init-fumadocs.mjs --root .
 *
 * Options:
 *   --root <dir>          Target repository root (default: cwd)
 *   --skill-dir <dir>     Path to the codebase-wiki skill folder (default: parent of scripts/)
 *   --title <string>      Wiki title for generated INDEX.md (default: Codebase Wiki)
 *   --content-dir <dir>   Fumadocs content directory to scaffold (default: content/docs/codebase-wiki)
 *   --force               Overwrite generated files if they already exist
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = {
    root: process.cwd(),
    skillDir: path.join(__dirname, ".."),
    title: "Codebase Wiki",
    contentDir: path.join("content", "docs", WIKI_DIR),
    force: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) out.root = path.resolve(argv[++i]);
    else if (a === "--skill-dir" && argv[i + 1])
      out.skillDir = path.resolve(argv[++i]);
    else if (a === "--title" && argv[i + 1]) out.title = argv[++i];
    else if (a === "--content-dir" && argv[i + 1]) out.contentDir = argv[++i];
    else if (a === "--force") out.force = true;
  }
  return out;
}

function writeFileIfNeeded(target, content, force) {
  if (fs.existsSync(target) && !force) {
    console.log(`Skip existing ${target}`);
    return false;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
  console.log(`Wrote ${target}`);
  return true;
}

function ensureCategoryDirs(baseDir) {
  for (const d of ["architecture", "discussion", "issue", "reference", "roadmap"]) {
    const dir = path.join(baseDir, d);
    fs.mkdirSync(dir, { recursive: true });
    const keep = path.join(dir, ".gitkeep");
    if (!fs.existsSync(keep)) fs.writeFileSync(keep, "", "utf8");
  }
}

function mergePackageJson(root) {
  const pkgPath = path.join(root, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.devDependencies = pkg.devDependencies || {};

  let changed = false;
  if (!pkg.devDependencies["remark-mermaidjs"]) {
    pkg.devDependencies["remark-mermaidjs"] = "^7.0.0";
    changed = true;
  }
  if (!pkg.devDependencies.mermaid) {
    pkg.devDependencies.mermaid = "^11.12.0";
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log(`Updated ${pkgPath}`);
  } else {
    console.log("No package.json changes needed");
  }
}

function main() {
  const { root, skillDir, title, contentDir, force } = parseArgs(process.argv);
  const refs = path.join(skillDir, "references", "CONVENTIONS.md");
  const wikiRoot = path.join(root, WIKI_DIR);
  const docsMirrorRoot = path.join(root, contentDir);

  if (!fs.existsSync(refs)) {
    console.error(`Missing ${refs}`);
    process.exit(1);
  }

  // 1. Canonical source directory (codebase-wiki/)
  ensureCategoryDirs(wikiRoot);
  writeFileIfNeeded(
    path.join(wikiRoot, "INDEX.md"),
    `# ${title}

统一维护代码阅读与分析文档，按以下目录组织：

- architecture
- discussion
- issue
- reference
- roadmap
`,
    force,
  );
  if (!fs.existsSync(path.join(wikiRoot, "CONVENTIONS.md")) || force) {
    fs.copyFileSync(refs, path.join(wikiRoot, "CONVENTIONS.md"));
    console.log(`Wrote ${path.join(wikiRoot, "CONVENTIONS.md")}`);
  } else {
    console.log(`Skip existing ${path.join(wikiRoot, "CONVENTIONS.md")}`);
  }

  // 2. Optional Fumadocs content mirror directory
  ensureCategoryDirs(docsMirrorRoot);
  writeFileIfNeeded(
    path.join(docsMirrorRoot, "README.md"),
    `# ${title}（Fumadocs 内容目录）

此目录用于 Fumadocs 站点消费文档内容。

建议将 \`${WIKI_DIR}/\` 作为规范源目录，并在提交前同步到此目录，
或在项目中通过 loader/source 配置直接读取 \`${WIKI_DIR}/\`。

如需 Mermaid 渲染，请在 Fumadocs 的 MDX 配置中启用 \`remark-mermaidjs\`。
`,
    force,
  );

  // 3. Ensure Mermaid remark plugin dependency when package.json exists.
  mergePackageJson(root);

  // 4. Auto-link with architecture-diagrams/ when present
  const linker = path.join(__dirname, "link-architecture-diagrams.mjs");
  if (fs.existsSync(linker)) {
    execFileSync(process.execPath, [linker, "--root", root], {
      stdio: "inherit",
    });
  }

  console.log("\nFumadocs scaffold complete!");
  console.log("\nNext steps:");
  if (!fs.existsSync(path.join(root, "package.json"))) {
    console.log("  pnpm create fumadocs-app");
  }
  console.log(
    `  Configure your Fumadocs source to read from "${contentDir}" or "${WIKI_DIR}/"`,
  );
  console.log(
    '  Enable Mermaid in your Fumadocs MDX config: remarkPlugins: [remarkMermaid]',
  );
  console.log(
    "  Ensure `mermaid` runtime package is installed for Mermaid rendering",
  );
  console.log(
    "  Update your project navigation (meta.json or source/layout config) after adding docs",
  );
}

main();
