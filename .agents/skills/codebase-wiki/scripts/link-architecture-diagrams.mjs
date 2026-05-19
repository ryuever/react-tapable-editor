#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DIAGRAM_DIR = "architecture-diagrams";

function parseArgs(argv) {
  const out = {
    root: process.cwd(),
    force: false,
    sourceDir: "codebase-wiki",
    sourceName: "codebase-wiki",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) out.root = path.resolve(argv[++i]);
    else if (a === "--force") out.force = true;
    else if (a === "--source-dir" && argv[i + 1]) out.sourceDir = argv[++i];
    else if (a === "--source-name" && argv[i + 1]) out.sourceName = argv[++i];
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

function main() {
  const { root, force, sourceDir, sourceName } = parseArgs(process.argv);
  const wikiDir = path.join(root, sourceDir);
  const diagramDir = path.join(root, DIAGRAM_DIR);
  const sourceUpper = sourceName.toUpperCase().replace(/[^A-Z0-9]+/g, "-");

  if (!fs.existsSync(wikiDir) || !fs.existsSync(diagramDir)) {
    console.log(
      `Skip linking: requires both ${sourceDir}/ and ${DIAGRAM_DIR}/ in target repo`,
    );
    return;
  }

  const wikiBridge = path.join(wikiDir, "ARCHITECTURE-DIAGRAM-LINKS.md");
  const diagramBridge = path.join(diagramDir, `${sourceUpper}-LINKS.md`);

  writeFileIfNeeded(
    wikiBridge,
    `# Diagram Links

Bridge file between \`${sourceDir}/\` and \`${DIAGRAM_DIR}/\`.

## Mapping table

| Wiki Doc | Diagram HTML | Notes |
| --- | --- | --- |
| | | |

## Recommended linking

In each wiki doc, add:

\`\`\`md
## 架构图

- [对应架构图](../${DIAGRAM_DIR}/YYYYMMDD-your-architecture.html)
\`\`\`
`,
    force,
  );

  writeFileIfNeeded(
    diagramBridge,
    `# Wiki Links

Bridge file between \`${DIAGRAM_DIR}/\` and \`${sourceDir}/\`.

## Mapping table

| Diagram HTML | Wiki Doc | Notes |
| --- | --- | --- |
| | | |

## Naming convention

- Prefer paired naming:
  - \`YYYYMMDD-payment-architecture.md\`
  - \`YYYYMMDD-payment-architecture.html\`
`,
    force,
  );

  // Backward-compatibility for older bridge file names used by early adopters.
  const legacyWikiBridge = path.join(wikiDir, "DIAGRAM-LINKS.md");
  const legacyDiagramBridge = path.join(diagramDir, "WIKI-LINKS.md");
  if (!fs.existsSync(legacyWikiBridge)) {
    fs.copyFileSync(wikiBridge, legacyWikiBridge);
    console.log(`Wrote ${legacyWikiBridge}`);
  }
  if (!fs.existsSync(legacyDiagramBridge)) {
    fs.copyFileSync(diagramBridge, legacyDiagramBridge);
    console.log(`Wrote ${legacyDiagramBridge}`);
  }

  console.log(
    `Linked ${sourceDir} <-> ${DIAGRAM_DIR}. Keep mapping table updated when adding new docs/diagrams.`,
  );
}

main();
