#!/usr/bin/env node
/** Wiki Markdown root inside the target repo (Mintlify content directory). */
const WIKI_DIR = "codebase-wiki";

/**
 * Scaffold codebase-wiki/ + Mintlify docs.json for the codebase-wiki workflow.
 *
 * Uses template files from assets/mintlify/ instead of generating config
 * strings in code. The script copies the asset skeleton, applies variable
 * substitution, and then runs regenerate-navigation.mjs.
 *
 * Usage (from target repo root):
 *   node <path-to-this-skill>/scripts/init-mintlify.mjs --root .
 *
 * Options:
 *   --root <dir>       Target repository root (default: cwd)
 *   --skill-dir <dir>  Path to the codebase-wiki skill folder (default: parent of scripts/)
 *   --title <string>   Wiki title (default: Codebase Wiki)
 *   --color <hex>      Primary brand color (default: #0D9373)
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
    color: "#0D9373",
    force: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) out.root = path.resolve(argv[++i]);
    else if (a === "--skill-dir" && argv[i + 1])
      out.skillDir = path.resolve(argv[++i]);
    else if (a === "--title" && argv[i + 1]) out.title = argv[++i];
    else if (a === "--color" && argv[i + 1]) out.color = argv[++i];
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

function main() {
  const { root, skillDir, title, color, force } = parseArgs(process.argv);
  const refs = path.join(skillDir, "references", "CONVENTIONS.md");
  const assetsDir = path.join(skillDir, "assets", "mintlify");

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
  const replacements = [
    ["__WIKI_TITLE__", title],
    ["__PRIMARY_COLOR__", color],
  ];

  // 4. Copy assets/mintlify/ skeleton into target wiki directory
  const wikiDest = path.join(root, WIKI_DIR);
  copyDirWithReplacements(assetsDir, wikiDest, replacements, force);

  // 5. Run regenerate-navigation.mjs to populate navigation
  const regen = path.join(__dirname, "regenerate-navigation.mjs");
  if (fs.existsSync(regen)) {
    execFileSync(process.execPath, [regen, "--root", root], {
      stdio: "inherit",
    });
  }

  // 6. Auto-link with architecture-diagrams/ when present
  const linker = path.join(__dirname, "link-architecture-diagrams.mjs");
  if (fs.existsSync(linker)) {
    execFileSync(process.execPath, [linker, "--root", root], {
      stdio: "inherit",
    });
  }

  console.log("\nMintlify scaffold complete!");
  console.log("\nNext steps:");
  console.log("  npm i -g mint          # Install Mintlify CLI");
  console.log(
    `  cd ${path.relative(process.cwd(), path.join(root, WIKI_DIR))} && mint dev   # Preview locally`,
  );
  console.log(
    `  After adding Markdown under ${WIKI_DIR}/, re-run: node <skill-dir>/scripts/regenerate-navigation.mjs --root .`,
  );
}

main();
