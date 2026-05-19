---
id: P-002
title: AI Editor 全量迁移实施追踪
description: >
  用于跟踪从 Draft.js legacy editor 迁移到 AI native editor runtime 的执行状态，
  覆盖 PR 拆分、验收标准、风险、当前进度与后续里程碑。
category: roadmap
created: 2026-05-19
updated: 2026-05-19
tags: [migration, tracker, lexical, draft-adapter, ai-editor]
status: wip
references:
  - id: P-001
    rel: extends
    file: ./20260519-draft-to-ai-editor-roadmap.md
  - id: A-001
    rel: derived-from
    file: ../architecture/20260519-ai-native-editor-architecture.md
  - id: D-001
    rel: derived-from
    file: ../discussion/20260519-editor-kernel-selection.md
  - id: P-003
    rel: extended-by
    file: ./20260519-next-iteration-backlog.md
---

# AI Editor 全量迁移实施追踪

> 本文追踪全量迁移执行状态。用户已明确不需要维护旧项目，因此迁移目标调整为直接升级现代 React/Lexical 工具链，默认入口切换到新的 Lexical editor；旧 Draft 源码后续作为历史代码清理。

## 当前状态

| 项 | 状态 | 备注 |
| --- | --- | --- |
| 迁移策略 | 已调整 | 直接现代化，不再维护 Draft legacy 行为 |
| Draft legacy adapter | 放弃 | 旧代码不再进入构建入口 |
| Lexical runtime | 已启用 | 默认导出新的 Lexical editor |
| React / build tooling 升级 | 已完成第一版 | React 18 + Vite library build + TypeScript 5 |
| AI input editor | 已完成第五版 | 支持 tool mode、context、attachments、AI chip nodes、artifact blocks、tool-call blocks、image layout、portable document、submit payload |

## Milestone 1：现代工具链与 Lexical 默认入口

目标：抛开旧 Draft 架构，直接用现代 React/Lexical 作为默认编辑器入口。

范围：

- React 18。
- Vite library build。
- TypeScript 5。
- Lexical 0.44。
- 默认入口 `src/index.tsx` 导出 `LexicalTapableEditor`。
- 旧 Draft 源码从 tsconfig/build 图中移除。

验收：

- `npm run build` 通过。
- package 不再依赖 `draft-js`、`immutable`、`tapable`、TSDX、Storybook 5。
- `dist/` 输出 ESM、CJS、CSS 与类型声明。
- 默认导出是 Lexical editor。

## Milestone 2：Portable Document Schema

目标：建立内核无关文档格式，避免业务层直接绑定 Draft Raw 或 Lexical JSON。

范围：

- 完善 `PortableEditorDocument` 与 `PortableEditorNode`。
- 实现 Draft Raw -> Portable JSON。
- 实现 Portable JSON -> Draft Raw 的最小回写。
- 为 `paragraph`、`heading`、`list`、`code`、`image`、`link` 建立映射。

验收：

- 旧文档能转换为 portable document。
- stable block id 不依赖 Draft runtime key。
- image entity 数据不丢失。

## Milestone 3：React / Build Tooling Upgrade

目标：满足现代 Lexical 依赖要求，并降低旧 TSDX 工具链风险。

范围：

- 将 React peer 范围提升到至少 `>=17`。
- 评估 dev dependency 升级到 React 18。
- 评估 TSDX 迁移到 Vite library mode 或 tsup。
- 升级 TypeScript 到现代版本。

验收：

- 旧 editor build 与 story/demo 继续可用。
- 可安装 `lexical` 与 `@lexical/react`。
- 不引入双 React runtime。

## Milestone 4：Lexical AI Input Editor

目标：新增一个独立 AI input editor surface，不替换旧文档编辑器入口。

范围：

- 新增 Lexical runtime adapter。
- 新增 `PromptInputEditor`。
- 支持 context chip、attachment chip、slash command、submit。
- 输出 portable message payload。

验收：

- 可以独立作为 chat composer 使用。
- 可以从外部 command 插入 context/attachment。
- 可以序列化为 `{ text, blocks, attachments, context }`。

## Milestone 5：Block 与 Toolbar 迁移

目标：将现有 block/toolbar 能力逐步从 Draft 插件迁移到 runtime + React UI。

范围：

- Inline toolbar -> runtime commands。
- Image toolbar -> image node command。
- Code block -> portable code node。
- Link decorator -> link mark/node。
- Drag block -> `moveBlock` command。

验收：

- 旧 Draft 与新 Lexical surface 共用同一套产品命令命名。
- UI 层不直接依赖 Draft/ Lexical API。

## Milestone 6：AI Operation Layer

目标：让 AI 通过受控 command 操作编辑器内容。

范围：

- `read_selection`
- `read_blocks`
- `replace_selection`
- `insert_block`
- `apply_suggestion`
- `stream_into_block`

验收：

- 所有 AI 修改可审计、可撤销。
- AI patch 使用 portable schema。
- 用户可 accept/reject suggestion。

## 当前执行日志

### 2026-05-19

- 用户明确要求不背历史包袱，迁移策略从 legacy adapter 调整为直接现代化。
- package 升级到 React 18、Lexical 0.44、Vite、TypeScript 5。
- 默认入口替换为 `src/lexical/LexicalTapableEditor.tsx`。
- 新 editor 支持富文本工具栏、标题、引用、代码块、列表、链接、Markdown shortcuts、history、AI tool mode、context chips、attachment chips、submit payload。
- 继续清理旧 Draft 源码，`src/` 只保留新 Lexical editor、demo 与 Vite 类型入口。
- 新增 `AIChipNode` 和 `INSERT_AI_CHIP_COMMAND`，context、attachment、tool call 可以作为 Lexical 文档树内的结构化节点插入。
- `PromptInputPayload.parts` 会从 Lexical JSON 中提取 `ai-chip` 节点，供后续 agent/tool bridge 使用。
- 新增 `AIBlockNode` 和 `INSERT_AI_BLOCK_COMMAND`，artifact 与 tool-call 可以作为 block 级结构化节点插入。
- `PromptInputPayload.parts` 现在同时提取 `ai-chip` 与 `ai-block`，包含 block status 和 content。
- 新增 `ImageNode` 和 `INSERT_IMAGE_COMMAND`，图片作为 block 级节点插入并参与 payload parts 序列化。
- 新增 portable schema，`PromptInputPayload.portable` 输出内核无关文档树。
- 新增 `UPDATE_AI_BLOCK_COMMAND`，可以按 id 更新 tool-call/artifact 的 status、content、title、meta。
- 新增 `UPDATE_IMAGE_COMMAND`，可以按 id 更新 image 的 width、height、alignment、caption、alt、meta。
- 新增 `LexicalTapableEditorHandle`，外部业务/agent 可通过 ref 调用 insert/update/getPayload/focus。
- Demo 增加 agent run lifecycle 按钮，用 handle 插入 tool-call block 并推进 pending/running/success/error 状态。
- 旧 Draft 源码仍留在仓库中，但已从 `tsconfig` 与构建入口移除。

## 风险清单

| 风险 | 影响 | 处理 |
| --- | --- | --- |
| 旧 docs 仍引用 Draft 时代内容 | 后续维护者可能误读项目现状 | 下一步更新 README 与 docs 入口 |
| 新 editor 尚未覆盖旧图片/拖拽 block | 产品能力暂时变化 | 按新 AI block schema 重做，不移植旧实现 |
| Vite CJS Node API deprecation warning | 构建有非阻塞 warning | 后续将 `vite.config.ts` 迁到 ESM 配置或升级 Vite major |
| AI block schema 过早定死 | 后续扩展成本高 | 先轻 schema，稳定后收紧 |

## 下一步

- 更新 README，声明项目已转向 Lexical AI editor。
- 增加 image resize/alignment toolbar，基于 `UPDATE_IMAGE_COMMAND` 操作选中图片。
- 将 tool call 状态模型和真实 agent run lifecycle 连接，基于 `UPDATE_AI_BLOCK_COMMAND` 推进状态。
- 增加 demo app，用 Playwright 验证编辑器交互。
