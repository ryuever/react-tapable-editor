#!/usr/bin/env node
/** Wiki Markdown root inside the target repo (Starlight content directory). */
const WIKI_DIR = "codebase-wiki";

/**
 * Scaffold codebase-wiki/ + Astro Starlight project for the codebase-wiki workflow.
 *
 * Uses template files from assets/starlight/ instead of generating config
 * strings in code. The script copies the asset skeleton, applies variable
 * substitution, and then runs regenerate-starlight-sidebar.mjs.
 *
 * Usage (from target repo root):
 *   node <path-to-this-skill>/scripts/init-starlight.mjs --root .
 *
 * Options:
 *   --root <dir>       Target repository root (default: cwd)
 *   --skill-dir <dir>  Path to the codebase-wiki skill folder (default: parent of scripts/)
 *   --title <string>   Wiki title (default: Codebase Wiki)
 *   --github <url>     Optional GitHub repo URL for social link
 *   --force            Overwrite generated files if they already exist
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
    github: "",
    force: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) out.root = path.resolve(argv[++i]);
    else if (a === "--skill-dir" && argv[i + 1])
      out.skillDir = path.resolve(argv[++i]);
    else if (a === "--title" && argv[i + 1]) out.title = argv[++i];
    else if (a === "--github" && argv[i + 1]) out.github = argv[++i];
    else if (a === "--force") out.force = true;
  }
  return out;
}

/**
 * Recursively copy a directory, applying text replacements to non-binary files.
 * Skips existing files unless `force` is true.
 */
function copyDirWithReplacements(srcDir, destDir, replacements, force) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirWithReplacements(srcPath, destPath, replacements, force);
    } else {
      if (fs.existsSync(destPath) && !force) {
        console.log(`Skip existing ${destPath}`);
        continue;
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      let content = fs.readFileSync(srcPath, "utf8");
      for (const [pattern, value] of replacements) {
        content = content.replaceAll(pattern, value);
      }
      fs.writeFileSync(destPath, content, "utf8");
      console.log(`Wrote ${destPath}`);
    }
  }
}

function mergePackageJson(root) {
  const pkgPath = path.join(root, "package.json");
  let pkg = { name: path.basename(root), private: true, version: "0.0.0" };
  if (fs.existsSync(pkgPath)) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  }
  pkg.scripts = pkg.scripts || {};
  const scripts = {
    "docs:wiki:dev": "astro dev",
    "docs:wiki:build": "astro build",
    "docs:wiki:preview": "astro preview",
  };
  let changed = false;
  for (const [k, v] of Object.entries(scripts)) {
    if (!pkg.scripts[k]) {
      pkg.scripts[k] = v;
      changed = true;
    }
  }
  pkg.devDependencies = pkg.devDependencies || {};
  const deps = {
    astro: "^5.7.10",
    "@astrojs/starlight": "^0.34.1",
    sharp: "^0.33.0",
    "remark-mermaidjs": "^7.0.0",
  };
  for (const [k, v] of Object.entries(deps)) {
    if (!pkg.devDependencies[k]) {
      pkg.devDependencies[k] = v;
      changed = true;
    }
  }
  if (changed || !fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log(`Updated ${pkgPath}`);
  } else {
    console.log("No package.json changes needed");
  }
}

function main() {
  const { root, skillDir, title, github, force } = parseArgs(process.argv);
  const refs = path.join(skillDir, "references", "CONVENTIONS.md");
  const assetsDir = path.join(skillDir, "assets", "starlight");

  if (!fs.existsSync(refs)) {
    console.error(`Missing ${refs}`);
    process.exit(1);
  }
  if (!fs.existsSync(assetsDir)) {
    console.error(`Missing assets directory: ${assetsDir}`);
    process.exit(1);
  }

  // Starlight expects content in src/content/docs/
  const docsDir = path.join(root, "src", "content", "docs");

  // 1. Create wiki content directories with .gitkeep
  for (const d of ["architecture", "discussion", "issue", "reference", "roadmap"]) {
    const dir = path.join(docsDir, d);
    fs.mkdirSync(dir, { recursive: true });
    const g = path.join(dir, ".gitkeep");
    if (!fs.existsSync(g)) fs.writeFileSync(g, "", "utf8");
  }

  // Also create the codebase-wiki/ directory for convention compatibility
  const wikiDir = path.join(root, WIKI_DIR);
  fs.mkdirSync(wikiDir, { recursive: true });

  // 2. Copy CONVENTIONS.md to both locations
  const conventionsDocsDest = path.join(docsDir, "conventions.md");
  if (!fs.existsSync(conventionsDocsDest) || force) {
    const conventionsContent = fs.readFileSync(refs, "utf8");
    const starlightConventions = `---
title: 文档书写规范
description: "Codebase wiki 文档书写规范"
---

${conventionsContent}
`;
    fs.writeFileSync(conventionsDocsDest, starlightConventions, "utf8");
    console.log(`Wrote ${conventionsDocsDest}`);
  } else {
    console.log(`Skip existing ${conventionsDocsDest}`);
  }

  const conventionsWikiDest = path.join(wikiDir, "CONVENTIONS.md");
  if (!fs.existsSync(conventionsWikiDest) || force) {
    fs.copyFileSync(refs, conventionsWikiDest);
    console.log(`Wrote ${conventionsWikiDest}`);
  } else {
    console.log(`Skip existing ${conventionsWikiDest}`);
  }

  // 3. Build replacement pairs
  const socialLinks = github
    ? `social: [{ icon: "github", label: "GitHub", href: ${JSON.stringify(github)} }],`
    : "";

  const replacements = [
    ["__WIKI_TITLE__", title],
    ["__SOCIAL_LINKS__", socialLinks],
  ];

  // 4. Copy assets/starlight/ skeleton into target repo root
  copyDirWithReplacements(assetsDir, root, replacements, force);

  // 5. Merge package.json (keep our pinned versions)
  mergePackageJson(root);

  // 6. Run regenerate-starlight-sidebar.mjs to create initial sidebar
  const regen = path.join(__dirname, "regenerate-starlight-sidebar.mjs");
  if (fs.existsSync(regen)) {
    execFileSync(process.execPath, [regen, "--root", root], {
      stdio: "inherit",
    });
  }

  // 7. Auto-link with architecture-diagrams/ when present
  const linker = path.join(__dirname, "link-architecture-diagrams.mjs");
  if (fs.existsSync(linker)) {
    execFileSync(process.execPath, [linker, "--root", root], {
      stdio: "inherit",
    });
  }

  console.log("\nStarlight scaffold complete!");
  console.log("\nNext steps:");
  console.log(
    "  pnpm install             # Install dependencies",
  );
  console.log("  pnpm run docs:wiki:dev   # Start dev server");
  console.log(
    `  After adding Markdown under src/content/docs/, re-run: node <skill-dir>/scripts/regenerate-starlight-sidebar.mjs --root .`,
  );
}

main();
