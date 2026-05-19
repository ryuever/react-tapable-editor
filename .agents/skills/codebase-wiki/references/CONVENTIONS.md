# Codebase wiki 文档书写规范

本规范约束仓库根目录下 `codebase-wiki/` 内所有 AI 辅助生成的文档。

---

## 1. 目录分类

每篇文档必须归入以下分类之一（物理路径均在 `codebase-wiki/` 下）：

| 分类 | 目录 | 编号前缀 | 适用场景 |
|------|------|----------|----------|
| 架构分析 | `architecture/` | A-xxx | 系统架构剖析、模块职责分析、依赖关系梳理 |
| 技术讨论 | `discussion/` | D-xxx | 技术方案对比、概念辨析、深度探讨、Session 讨论记录 |
| Issue 记录 | `issue/` | I-xxx | AI coding 实操中的问题现象、排查路径、修复动作与回归结论 |
| 参考手册 | `reference/` | R-xxx | API 速查、结构索引、使用指南、代码示例 |
| 规划路线 | `roadmap/` | P-xxx | 开发计划、差距分析、优先级建议、待办清单 |

如果文档不属于以上任何分类，请先在 `codebase-wiki/INDEX.md` 中提议新分类。

---

## 2. 文件命名

- 使用 **`YYYYMMDD-`** 日期前缀 + **小写字母** + **连字符** 分隔：`20250115-pregel-architecture.md`
- 日期取文档首次创建日期（与 frontmatter `created` 字段一致）
- 名称应简洁且具有描述性，避免缩写
- 禁止使用大写字母、下划线、空格
- 后缀统一为 `.md`

**示例**：
```
# 正确
20250115-pregel-architecture.md
20250115-checkpoint-comparison.md
20260412-human-in-the-loop-deep-dive.md

# 错误
pregel-architecture.md               ← 缺少日期前缀
2025-01-15-pregel-architecture.md     ← 日期格式错误（不要用连字符分隔日期）
ORCHESTRATOR_COMPLETE_ANALYSIS.md     ← 大写 + 下划线
```

---

## 3. 文档结构

每篇文档应包含以下结构（按顺序）：

### 3.1 Frontmatter（YAML 元信息块）

```markdown
---
id: A-001
title: Pregel 引擎四层架构详解
description: >
  对 LangGraph Pregel 模块进行完整架构分析，覆盖四层模型、
  核心文件职责和依赖关系。
category: architecture
created: 2025-01-15
updated: 2025-01-20
tags: [pregel, architecture, bsp, channels]
status: final | draft | wip
sources:
  - title: "Optional external title"
    url: "https://example.com/doc"
references:
  - id: D-001
    rel: related-to
    file: ../discussion/20250115-pregel-engine-deep-dive.md
---
```

字段说明：

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 分类前缀 + 三位数字序号，如 `A-001` |
| `title` | 是 | 文档标题（中文） |
| `description` | 是 | 1-3 句话的简短描述，用于索引和搜索摘要。可使用 YAML 多行语法 `>` |
| `category` | 是 | 分类名：`architecture` / `discussion` / `issue` / `reference` / `roadmap` |
| `created` | 是 | 创建日期，格式 `YYYY-MM-DD` |
| `updated` | 是 | 最后更新日期，格式 `YYYY-MM-DD`。首次创建时与 `created` 相同 |
| `tags` | 是 | 关键词标签数组，用于检索 |
| `status` | 是 | `draft`（草稿）/ `wip`（进行中）/ `final`（定稿） |
| `sources` | 否 | 外部来源列表；当讨论由用户提供的 URL 触发时建议填写，含 `title` 与 `url` |
| `references` | 否 | 关联文档列表，记录文档之间的引用关系（见下方说明） |

#### references 字段规范

`references` 记录当前文档与同目录树内其他 wiki 文档的**双向引用关系**。当文档 A 引用文档 B 时，A 和 B 的 frontmatter 中都应包含对彼此的引用。

```yaml
references:
  - id: P-001
    rel: derived-from        # 本文从该文档的话题引出
    file: ../roadmap/20250115-orchestrator-development-roadmap.md
  - id: P-002
    rel: related-to          # 与该文档主题相关
    file: ../roadmap/20250115-harness-agent-gap-analysis.md
```

支持的 `rel` 类型：

| rel 值 | 含义 | 反向 rel |
|--------|------|----------|
| `derived-from` | 本文从该文档的话题/需求引出 | `derives` |
| `derives` | 该文档从本文的话题/需求引出 | `derived-from` |
| `related-to` | 与该文档主题相关（对称关系） | `related-to` |
| `extends` | 本文是该文档的扩展/深入 | `extended-by` |
| `extended-by` | 该文档是本文的扩展/深入 | `extends` |
| `supersedes` | 本文替代/废弃该文档 | `superseded-by` |
| `superseded-by` | 本文被该文档替代/废弃 | `supersedes` |

**规则**：
- 添加引用时，**必须同时更新双方**的 `references` 字段
- `id` 为目标文档的编号（如 `P-001`）
- `file` 使用相对路径指向目标文档
- 无引用关系的文档可省略 `references` 字段

### 3.2 标题

使用一级标题，与 frontmatter 的 `title` 一致：

```markdown
# Pregel 引擎四层架构详解
```

### 3.3 概述

紧接标题后提供 1-3 句话的概述，使用引用块：

```markdown
> 本文对 LangGraph Pregel 模块进行完整架构分析，覆盖四层模型、
> 核心文件职责和依赖关系。
```

若存在外部来源，在概述后增加 `## 来源` 章节，并用 Markdown 链接列出 URL（与 `sources` 一致）。

### 3.4 正文

- 使用二级标题（`##`）划分主要章节
- 使用三级标题（`###`）划分子章节
- 代码块标注语言：```typescript / ```python 等
- 表格对齐、列表层级不超过 3 层

### 3.5 交叉引用

引用其他 wiki 文档时使用相对路径：

```markdown
详见 [Checkpoint 对比](../discussion/20250115-checkpoint-comparison.md)
```

### 3.6 Issue 文档建议章节（推荐）

`issue/` 文档建议包含以下章节，便于后续复盘与复发排查：

1. `## 现象（Symptoms）`：用户可见表现与触发路径
2. `## 根因（Root Cause）`：直接触发因、放大因、辅助因
3. `## 时间线（Timeline）`：发现、定位、修复、回归节点
4. `## 修复动作（Changes Applied）`：改动文件与原因
5. `## 验证方法（How to Verify）` 与 `## Runbook`：复验步骤和复发排查顺序

---

## 4. 索引维护

每新增或修改一篇文档，**必须同步更新** `codebase-wiki/INDEX.md`：

1. 在对应分类表格中添加/更新条目
2. 分配下一个可用的编号（如 `A-004`）
3. 填写文件名、标题、概述

---

## 5. 内容规范

### 5.1 语言

- 主要使用**中文**撰写
- 技术术语保留英文原文，不强行翻译（如 superstep、checkpoint、channel）
- 首次出现的术语给出简要解释

### 5.2 代码引用

- 引用源码时标注文件路径和行号：`src/pregel/index.ts:171-227`
- 代码片段保持最小可理解范围，避免大段复制粘贴
- 对关键行添加注释说明

### 5.3 图表

- 优先使用 ASCII 图表或 Mermaid 语法
- 复杂架构图使用分层表示

---

## 6. 状态管理

| 状态 | 含义 | 允许的操作 |
|------|------|------------|
| `draft` | 初稿，内容可能不完整 | 可自由修改 |
| `wip` | 进行中，结构已定但细节待补充 | 可修改，需标注变更 |
| `final` | 定稿，内容已审核确认 | 仅允许勘误修正 |

---

## 7. 侧边栏与导航同步

当 `codebase-wiki/` 下文档发生变化（新增、重命名、删除）时，应更新侧边栏与顶部导航。根据项目使用的文档引擎选择对应方式。

> 强约束：只要发生新增、重命名、删除，Agent 必须默认执行导航重建（无需等待用户额外提醒），并在交付说明中报告执行命令与结果。

### 7.1 VitePress

#### 7.1.1 推荐：运行生成脚本

在**目标仓库根目录**执行（将 `<skill-dir>` 替换为已安装的 `codebase-wiki` skill 目录，内含 `scripts/`）：

```bash
node <skill-dir>/scripts/regenerate-sidebar.mjs --root .
```

该脚本会扫描 `codebase-wiki/architecture|discussion|issue|reference|roadmap` 下的 Markdown（读取 frontmatter 的 `id` 与 `title`），重写 `.vitepress/sidebar.generated.mts`。`.vitepress/config.mts` 从该文件导入 `wikiNav` 与 `wikiSidebar`。

#### 7.1.2 手动维护（备选）

若未使用生成脚本，则需手工编辑 `.vitepress/config.mts`：

1. **新增文档**：在对应分类的 `sidebar` 数组中添加条目，格式为 `{ text: "编号 标题", link: "/分类/文件名(不含.md)" }`
2. **重命名文档**：更新 `sidebar` 和 `nav` 中所有引用该文件的 `link` 路径
3. **删除文档**：从 `sidebar` 和 `nav` 中移除对应条目
4. 侧边栏条目按编号升序排列
5. `nav` 顶部导航的链接应指向每个分类的第一篇文档

### 7.2 Mintlify

#### 7.2.1 推荐：运行生成脚本

在**目标仓库根目录**执行：

```bash
node <skill-dir>/scripts/regenerate-navigation.mjs --root .
```

该脚本会扫描 `codebase-wiki/architecture|discussion|issue|reference|roadmap` 下的 Markdown（读取 frontmatter 的 `id`），重写 `codebase-wiki/docs.json` 中的 `navigation.groups`。

#### 7.2.2 手动维护（备选）

若未使用生成脚本，则需手工编辑 `codebase-wiki/docs.json`：

1. **新增文档**：在对应分类的 `pages` 数组中添加条目，格式为 `"分类/文件名(不含.md)"`
2. **重命名文档**：更新 `pages` 数组中对应的路径
3. **删除文档**：从 `pages` 数组中移除对应条目
4. 页面条目按编号升序排列

### 7.3 Starlight（Astro）

#### 7.3.1 推荐：运行生成脚本

在**目标仓库根目录**执行：

```bash
node <skill-dir>/scripts/regenerate-starlight-sidebar.mjs --root .
```

该脚本会扫描 `src/content/docs/architecture|discussion|issue|reference|roadmap` 下的 Markdown（读取 frontmatter 的 `id` 与 `title`），重写 `.starlight/sidebar.generated.mjs`。`astro.config.mjs` 从该文件导入 `starlightSidebar`。

#### 7.3.2 手动维护（备选）

若未使用生成脚本，则需手工编辑 `astro.config.mjs` 中 `starlight()` 集成的 `sidebar` 配置：

1. **新增文档**：在对应分类的 `items` 数组中添加条目，格式为 `{ slug: "分类/文件名(不含.md)" }`
2. **重命名文档**：更新 `items` 数组中对应的 `slug`
3. **删除文档**：从 `items` 数组中移除对应条目
4. 也可使用 `autogenerate: { directory: "分类" }` 让 Starlight 自动生成该分类的侧边栏
