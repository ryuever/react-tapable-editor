---
name: codebase-wiki
description: "将对话中的源码阅读与分析整理为规范化 Markdown，归档到项目 codebase-wiki/（architecture/discussion/issue/reference/roadmap）、维护 INDEX 与 references 图；支持 VitePress、Mintlify、Starlight、Fumadocs 等文档站点。适用于「保存到 wiki / 归档到 codebase-wiki / 生成学习笔记」等意图。"
---

# Codebase wiki（知识库目录）

把当前对话中的分析整理为**可长期维护**的文档，写入目标仓库根目录的 **`codebase-wiki/`**，并支持四种文档引擎：

- **VitePress**（`srcDir: ./codebase-wiki`）—— 默认选项
- **Mintlify**（内容目录 `codebase-wiki/`，配置文件 `codebase-wiki/docs.json`）
- **Starlight**（Astro 集成，内容目录 `src/content/docs/`，配置文件 `astro.config.mjs`）
- **Fumadocs**（React 文档框架，内容目录按项目现有 source 配置；常见为 `content/docs/`）

详细书写规范见本 skill 包内 `references/CONVENTIONS.md`；初始化后的目标仓库内会复制一份到 `codebase-wiki/CONVENTIONS.md`。

各引擎的模板文件（配置、首页、侧栏占位等）存放在 `assets/` 目录下，初始化脚本通过复制 + 变量替换的方式生成骨架：

- `assets/vitepress/` — VitePress 项目骨架（`.vitepress/config.mts`、`INDEX.md` 等）
- `assets/mintlify/` — Mintlify 项目骨架（`docs.json`、`INDEX.mdx` 等）
- `assets/starlight/` — Starlight/Astro 项目骨架（`astro.config.mjs`、`src/content/docs/index.mdx` 等）

## 加载策略（Progressive Disclosure）

`SKILL.md` 只保留流程路由与决策规则，细节规范按需读取，避免一次性加载过多上下文：

| 用户意图 | 必读内容 |
| --- | --- |
| 仅归档单篇文档 | `SKILL.md` + `references/CONVENTIONS.md` |
| 需要维护双向引用 | 上述 + `CONVENTIONS` 中 references 关系表 |
| 需要更新站点导航 | 上述 + 对应脚本注释（`scripts/regenerate-*.mjs`） |
| 首次初始化站点 | 上述 + 对应引擎模板目录 `assets/<engine>/`（Fumadocs 使用 `scripts/init-fumadocs.mjs`） |

默认不要并行阅读全部 references，先完成最小闭环，再按任务升级读取深度。

## 首次运行闸门（First-run Gate）

当目标仓库第一次使用本 skill（不存在 `codebase-wiki/`）时，先暂停并给用户三选一：

1. 立即初始化（推荐）：执行对应引擎 `init-*.mjs`
2. 仅输出计划（不写文件）
3. 继续写入默认目录（用户明确同意时）

未得到用户明确选择前，不要隐式写入大量文档。

## 首次接入（人类或 Agent 执行）

1. 用 [skills CLI](https://github.com/vercel-labs/skills) 安装本 skill（示例）：

   ```bash
   npx skills add <your-github>/agent-skills --skill codebase-wiki -a cursor -y
   ```

2. 根据所选引擎，在**目标仓库根目录**生成骨架（将 `<skill-dir>` 换成已安装的 `codebase-wiki` 目录，内含 `scripts/`）：

### 方案 A：VitePress（默认）

   ```bash
   node <skill-dir>/scripts/init-vitepress.mjs --root . --title "我的 Wiki"
   ```

   安装 VitePress 并本地预览：

   ```bash
   pnpm add -D vitepress
   pnpm run docs:wiki:dev
   ```

   **新增/重命名** Markdown 后，在仓库根执行：

   ```bash
   node <skill-dir>/scripts/regenerate-sidebar.mjs --root .
   ```

   以重写 `.vitepress/sidebar.generated.mts`（导航与侧栏从各篇 frontmatter 的 `id`、`title` 生成）。

### 方案 B：Mintlify

   ```bash
   node <skill-dir>/scripts/init-mintlify.mjs --root . --title "我的 Wiki" --color "#0D9373"
   ```

   安装 Mintlify CLI 并本地预览：

   ```bash
   npm i -g mint
   cd codebase-wiki && mint dev
   ```

   **新增/重命名** Markdown 后，在仓库根执行：

   ```bash
   node <skill-dir>/scripts/regenerate-navigation.mjs --root .
   ```

   以重写 `codebase-wiki/docs.json` 中的 `navigation.groups`（从各篇 frontmatter 的 `id`、`title` 生成）。

### 方案 C：Starlight（Astro）

   ```bash
   node <skill-dir>/scripts/init-starlight.mjs --root . --title "我的 Wiki"
   ```

   安装依赖并本地预览：

   ```bash
   pnpm install
   pnpm run docs:wiki:dev
   ```

   **新增/重命名** Markdown 后，在仓库根执行：

   ```bash
   node <skill-dir>/scripts/regenerate-starlight-sidebar.mjs --root .
   ```

   以重写 `.starlight/sidebar.generated.mjs`（侧栏从各篇 frontmatter 的 `id`、`title` 生成）。

   > Starlight 的内容目录为 `src/content/docs/`（Astro 内容集合规范），文档按 `architecture/`、`discussion/`、`issue/`、`reference/`、`roadmap/` 子目录组织。

### 方案 D：Fumadocs

   先执行 Fumadocs 初始化脚本（创建 `codebase-wiki/` 规范源目录，并按需创建 Fumadocs 内容目录）：

   ```bash
   node <skill-dir>/scripts/init-fumadocs.mjs --root . --title "我的 Wiki" --content-dir "content/docs/codebase-wiki"
   ```

   若目标仓库尚未接入 Fumadocs，再按官方脚手架创建站点：

   ```bash
   pnpm create fumadocs-app
   ```

   将 `codebase-wiki/` 下文档同步到项目已配置的 Fumadocs 内容源目录（常见为 `content/docs/` 下的 `codebase-wiki/` 子目录），并保持五个分类子目录结构：

   - `architecture/`
   - `discussion/`
   - `issue/`
   - `reference/`
   - `roadmap/`

   > Fumadocs 的内容源可由项目自行定义（如 `source.ts` + Content Collections）。执行前先读取目标项目现有配置，避免覆盖用户既有目录约定。

## 何时使用

- 用户要求把讨论保存到 `codebase-wiki/`、生成学习笔记、搭建/更新源码 wiki
- 用户说「归档」「写到 wiki」「保存文档」等
- 对话基于外部 URL 展开且用户希望沉淀成文
- 用户明确说要沉淀“issue/故障复盘/踩坑记录/修复备案”时，优先归入 `issue/`

## 工作流

### 第 0 步：识别外部来源链接

若用户粘贴了网页、Issue、PR、官方文档等 URL 并据此讨论，记录下来；生成文档时在 frontmatter 填写 `sources`，正文增加 `## 来源` 与链接列表。

### 第 1 步：判断分类

| 分类 | 目录 | 编号前缀 | 判断依据 |
|------|------|----------|----------|
| 架构分析 | `codebase-wiki/architecture/` | A-xxx | 模块职责、依赖、系统设计 |
| 技术讨论 | `codebase-wiki/discussion/` | D-xxx | 方案对比、概念辨析、深度笔记 |
| Issue 记录 | `codebase-wiki/issue/` | I-xxx | AI coding 实操中遇到的问题现象、排查路径、修复动作与回归结论 |
| 参考手册 | `codebase-wiki/reference/` | R-xxx | API、索引、示例、速查 |
| 规划路线 | `codebase-wiki/roadmap/` | P-xxx | 计划、差距、优先级、待办 |

用户指定分类时服从用户；否则自动选择最合适的类。

### 第 2 步：确定编号

读取 `codebase-wiki/INDEX.md` 对应分类表格中的最大编号，分配下一个序号（如当前最大 A-003 → 新文 A-004）。

### 第 3 步：生成文档

遵循 `codebase-wiki/CONVENTIONS.md`（与本包 `references/CONVENTIONS.md` 一致）。

**文件命名**：`YYYYMMDD-` + 小写连字符 slug + `.md`，日期与 frontmatter `created` 一致；禁止大写、下划线、空格。

**Frontmatter**（必填项见 CONVENTIONS；常用字段）：

- `id`、`title`、`description`、`category`、`created`、`updated`、`tags`、`status`（新建默认 `draft`）
- 可选：`sources`（外部 URL 列表）、`references`（文档间关系）

**正文**：中文为主，术语保留英文；源码引用写 `path/to/file.ts:行号-行号`；代码块标明语言。

### 源码分析深度偏好

生成 `architecture` 或 `reference` 类文档时，除架构概述外，应包含以下源码级细节（按需取舍，不必全部包含）：

- **代码模式示例**：精选 2-3 个最典型的用法，附完整可运行代码块
- **导入参考**：列出扩展开发所需的 `import` 语句（类型导入与值导入分开）
- **行号引用**：关键实现标注 `file.ts:行号-行号`，便于跳转
- **Type Guard 用法**：如有判别联合，说明正确的窄化方式与常见陷阱

### Issue 文档建议结构

生成 `issue` 类文档时，优先覆盖以下信息（按需取舍）：

- **现象**：用户可见表现 + 触发路径（步骤/路由/命令）
- **根因**：直接触发因、放大因、辅助因（避免只写“最终结论”）
- **时间线**：关键排查节点（发现、验证、修复、回归）
- **变更清单**：涉及文件、关键改动点、为什么这么改
- **验证与回归**：复验步骤、判定标准、复发时 runbook

### 第 4 步：维护 references（双向）

为新文与被引用文同时更新 `references`，并更新被引用文的 `updated` 日期。`rel` 取值与反向关系见 `references/CONVENTIONS.md` 表格。

### 第 5 步：更新 INDEX

在 `codebase-wiki/INDEX.md` 对应分类表格中追加一行：编号、链接、标题、概述。

### 第 6 步：同步侧栏与导航

> **必做检查**：只要本次工作流中发生了文档的**新增、删除或重命名**，就**必须**在结束前执行下方对应的 sidebar 脚本。如果跳过此步骤，侧栏导航将与实际文档不同步，用户在站点中无法找到新文档或仍能看到已删除的文档入口。
>
> **执行要求（强约束）**：无论用户是否显式要求，只要发生增删改名，Agent 都应默认执行导航重建；并在最终回复中明确报告“已执行的脚本命令 + 输出结果（成功/失败）”。

根据项目使用的文档引擎执行对应脚本：

- **VitePress**：在仓库根运行 `node <skill-dir>/scripts/regenerate-sidebar.mjs --root .`
  若目标项目未使用该脚本（旧式手工配置），再按 `references/CONVENTIONS.md` §7.2 手工编辑 `.vitepress/config.mts`。

- **Mintlify**：在仓库根运行 `node <skill-dir>/scripts/regenerate-navigation.mjs --root .`
  若目标项目未使用该脚本，手工编辑 `codebase-wiki/docs.json` 的 `navigation.groups`。

- **Starlight**：在仓库根运行 `node <skill-dir>/scripts/regenerate-starlight-sidebar.mjs --root .`
  若目标项目未使用该脚本，手工编辑 `astro.config.mjs` 中 `starlight()` 的 `sidebar` 配置。

- **Fumadocs**：当前无内置 `regenerate-*` 脚本。根据目标项目导航实现手工同步：
  1) 若使用 `meta.json` 维护目录顺序，更新对应目录的 `meta.json`；
  2) 若在 `source.ts`/`layout` 中手写导航，补充新文档入口；
  3) 确保首页与分类页能链接到新增文档。

### 第 7 步：向用户确认

报告：文件路径、编号、分类、标题、本次 references 变更、侧栏是否已重新生成。

## 与 architecture-diagram 自动联动

初始化脚本会自动检测目标仓库是否存在 `architecture-diagrams/`：

- 若存在：自动生成桥接文件
  - `codebase-wiki/ARCHITECTURE-DIAGRAM-LINKS.md`
  - `architecture-diagrams/CODEBASE-WIKI-LINKS.md`
- 若不存在：跳过，不影响 wiki 正常使用

手工补联动（可选）：

```bash
node <skill-dir>/scripts/link-architecture-diagrams.mjs --root .
```
