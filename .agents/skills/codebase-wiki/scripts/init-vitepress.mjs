#!/usr/bin/env node
/** Wiki Markdown root inside the target repo (VitePress `srcDir`). */
const WIKI_DIR = "codebase-wiki";

/**
 * Scaffold codebase-wiki/ + .vitepress for the codebase-wiki workflow.
 *
 * Uses template files from assets/vitepress/ instead of generating config
 * strings in code. The script copies the asset skeleton, applies variable
 * substitution, and then runs regenerate-sidebar.mjs.
 *
 * Usage (from target repo root):
 *   node <path-to-this-skill>/scripts/init-vitepress.mjs --root .
 *
 * Options:
 *   --root <dir>       Target repository root (default: cwd)
 *   --skill-dir <dir>  Path to the codebase-wiki skill folder (default: parent of scripts/)
 *   --title <string>   Wiki title for INDEX hero + VitePress title (default: Codebase Wiki)
 *   --github <url>     Optional GitHub repo URL for theme social link
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

// `npx skills` filters out dotfiles/dotdirs during installation, so assets
// use underscore-prefixed names (e.g. `_vitepress`) that are restored to
// dot-prefixed names (`.vitepress`) when copied into the target repo.
const DOTDIR_RENAME = { _vitepress: ".vitepress", _starlight: ".starlight" };

/**
 * Recursively copy a directory, applying text replacements to non-binary files.
 * Skips existing files unless `force` is true.
 */
function copyDirWithReplacements(srcDir, destDir, replacements, force) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destName = DOTDIR_RENAME[entry.name] || entry.name;
    const destPath = path.join(destDir, destName);
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
    "docs:wiki:dev": "vitepress dev",
    "docs:wiki:build": "vitepress build",
    "docs:wiki:preview": "vitepress preview",
  };
  let changed = false;
  for (const [k, v] of Object.entries(scripts)) {
    if (!pkg.scripts[k]) {
      pkg.scripts[k] = v;
      changed = true;
    }
  }
  pkg.devDependencies = pkg.devDependencies || {};
  if (!pkg.devDependencies.vitepress) {
    pkg.devDependencies.vitepress = "^1.6.3";
    changed = true;
  }
  if (!pkg.devDependencies["vitepress-plugin-mermaid"]) {
    pkg.devDependencies["vitepress-plugin-mermaid"] = "^2.0.17";
    changed = true;
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
  const assetsDir = path.join(skillDir, "assets", "vitepress");

  if (!fs.existsSync(refs)) {
    console.error(`Missing ${refs}`);
    process.exit(1);
  }
  if (!fs.existsSync(assetsDir)) {
    console.error(`Missing assets directory: ${assetsDir}`);
    process.exit(1);
  }

  // 1. Create wiki content directories with .gitkeep
  for (const d of ["architecture", "discussion", "issue", "reference", "roadmap"]) {
    const dir = path.join(root, WIKI_DIR, d);
    fs.mkdirSync(dir, { recursive: true });
    const g = path.join(dir, ".gitkeep");
    if (!fs.existsSync(g)) fs.writeFileSync(g, "", "utf8");
  }

  // 2. Copy CONVENTIONS.md into wiki root
  const conventionsDest = path.join(root, WIKI_DIR, "CONVENTIONS.md");
  if (!fs.existsSync(conventionsDest) || force) {
    fs.copyFileSync(refs, conventionsDest);
    console.log(`Wrote ${conventionsDest}`);
  } else {
    console.log(`Skip existing ${conventionsDest}`);
  }

  // 3. Build replacement pairs
  const socialLinks =
    github && github.length > 0
      ? `{ icon: "github", link: ${JSON.stringify(github)} }`
      : "";

  const replacements = [
    ["__WIKI_TITLE__", title],
    ["__SOCIAL_LINKS__", socialLinks],
  ];

  // 4. Copy assets/vitepress/ skeleton into target repo
  //    - assets/vitepress/_vitepress/* → <root>/.vitepress/*
  //    - assets/vitepress/INDEX.md    → <root>/codebase-wiki/INDEX.md
  // NOTE: assets use `_vitepress` (not `.vitepress`) because `npx skills`
  // filters out dotfiles/dotdirs during installation.
  const vpAssetsDir = path.join(assetsDir, "_vitepress");
  const vpDestDir = path.join(root, ".vitepress");
  copyDirWithReplacements(vpAssetsDir, vpDestDir, replacements, force);

  const indexSrc = path.join(assetsDir, "INDEX.md");
  const indexDest = path.join(root, WIKI_DIR, "INDEX.md");
  if (fs.existsSync(indexSrc)) {
    if (!fs.existsSync(indexDest) || force) {
      let content = fs.readFileSync(indexSrc, "utf8");
      for (const [pattern, value] of replacements) {
        content = content.replaceAll(pattern, value);
      }
      fs.writeFileSync(indexDest, content, "utf8");
      console.log(`Wrote ${indexDest}`);
    } else {
      console.log(`Skip existing ${indexDest}`);
    }
  }

  // 5. Merge package.json (keep our pinned versions)
  mergePackageJson(root);

  // 6. Run regenerate-sidebar.mjs to create initial sidebar
  const regen = path.join(__dirname, "regenerate-sidebar.mjs");
  execFileSync(process.execPath, [regen, "--root", root], { stdio: "inherit" });

  // 7. Auto-link with architecture-diagrams/ when present
  const linker = path.join(__dirname, "link-architecture-diagrams.mjs");
  if (fs.existsSync(linker)) {
    execFileSync(process.execPath, [linker, "--root", root], { stdio: "inherit" });
  }

  console.log("\nNext steps:");
  console.log("  pnpm add -D vitepress   # or npm/yarn if not already installed");
  console.log("  pnpm run docs:wiki:dev");
  console.log(
    `  After adding Markdown under ${WIKI_DIR}/, re-run: node <skill-dir>/scripts/regenerate-sidebar.mjs --root .`,
  );
}

main();
