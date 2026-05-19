---
id: P-001
title: Draft 到 AI Native Editor 的渐进式重构路线图
description: >
  面向 react-tapable-editor 的下一步重构计划：先保留 Draft legacy，抽出 editor runtime，
  再以 Lexical 实现 AI input editor，最终支持 message block、artifact block 与 agent 操作层。
category: roadmap
created: 2026-05-19
updated: 2026-05-19
tags: [roadmap, migration, draft-js, lexical, ai-input, refactor]
status: draft
sources:
  - title: "Draft.js GitHub archive status"
    url: "https://github.com/facebookarchive/draft-js"
  - title: "Lexical introduction"
    url: "https://lexical.dev/docs/intro"
  - title: "Tiptap Content AI overview"
    url: "https://tiptap.dev/docs/content-ai/getting-started/overview"
  - title: "Vercel AI Elements Prompt Input"
    url: "https://elements.ai-sdk.dev/components/prompt-input"
references:
  - id: D-001
    rel: derived-from
    file: ../discussion/20260519-editor-kernel-selection.md
  - id: A-001
    rel: derived-from
    file: ../architecture/20260519-ai-native-editor-architecture.md
  - id: P-002
    rel: extended-by
    file: ./20260519-ai-editor-migration-tracker.md
---

# Draft 到 AI Native Editor 的渐进式重构路线图

> 这份路线图的目标是避免一次性大迁移：先建立 runtime 保护层，再用 AI input editor 作为新内核试验场，最后将稳定能力迁移回文档编辑器。

## 来源

- [Draft.js GitHub archive status](https://github.com/facebookarchive/draft-js)
- [Lexical introduction](https://lexical.dev/docs/intro)
- [Tiptap Content AI overview](https://tiptap.dev/docs/content-ai/getting-started/overview)
- [Vercel AI Elements Prompt Input](https://elements.ai-sdk.dev/components/prompt-input)

## 北极星

未来编辑器应该服务三类 surface：

1. **Input surface**：prompt editor、comment composer、inline assistant。
2. **Conversation surface**：message block、引用、折叠、编辑、重放。
3. **Artifact surface**：代码、表格、图表、图片、任务、文档片段。

所有 surface 共享同一套结构化能力：

- stable block id
- portable JSON schema
- command-based mutation
- undo/redo
- AI-readable context
- AI-applicable patch

## 阶段 0：盘点与保护网

周期：约 1 周。

目标：明确哪些旧能力必须保留，哪些实验能力可以延后。

任务：

- 梳理现有能力矩阵：标题、列表、链接、代码高亮、图片、resize、inline toolbar、image toolbar、drag block、nested block。
- 为核心故事补 Storybook 或最小 demo：basic editor、image、code、drag block。
- 标记 Draft 内部 API 依赖：`DraftOffsetKey`、`ContentBlockNode`、`generateRandomKey`、`.DraftEditor-root`。
- 明确 legacy 输入输出格式：Draft Raw、entity data、block data、nested block links。

验收：

- 有一份能力矩阵。
- 至少能手动跑通现有 basic/image/code demo。
- 明确哪些能力进入第一阶段迁移范围。

## 阶段 1：抽出 EditorRuntime

周期：1-2 周。

目标：让产品 UI 不再直接认识 Draft API。

任务：

- 新增 `src/core/commands.ts`、`src/core/runtime.ts`、`src/core/document.ts`、`src/core/selection.ts`。
- 新增 `src/adapters/draft/DraftRuntime.ts`，内部仍调用现有 Draft 逻辑。
- 将三个低风险动作先接入 runtime：`toggleMark`、`setBlockType`、`insertImage`。
- 保留 `createEditor` 的 tapable hooks，但把新命令从 hook 里代理出去。

第一批命令：

```typescript
runtime.commands.toggleMark('bold');
runtime.commands.setBlockType('heading-one');
runtime.commands.insertImage({ src, alignment: 'center' });
```

验收：

- 旧 editor 功能不回退。
- inline style、block type、image insertion 可以通过 runtime 调用。
- UI 层新增代码不再直接 import `RichUtils` 或 `AtomicBlockUtils`。

## 阶段 2：AI Input Editor MVP

周期：2-4 周。

目标：不触碰旧文档编辑器，用 Lexical 做第一个新 surface。

范围：

- 新增 `src/ai/PromptInputEditor.tsx`。
- 新增 Lexical adapter 最小实现。
- 支持 plain/rich text、link、context chip、attachment chip、slash command、submit。
- 输出统一 message payload。

建议节点：

| Node | 作用 |
| --- | --- |
| `ContextNode` | @文件、@网页、@选区、@数据源 |
| `AttachmentNode` | 文件、图片、截图 |
| `ToolIntentNode` | 搜索、联网、运行工具等开关 |

验收：

- 可以作为独立输入框使用。
- 可以序列化为 `{ text, blocks, attachments, context }`。
- 可以从外部 command 插入 context 或 attachment。
- 不影响当前 Draft editor。

## 阶段 3：Portable Schema 与转换器

周期：3-6 周。

目标：形成 Draft、Lexical、AI message 共享的中间结构。

任务：

- 定义 `PortableEditorNode` 和 `PortableEditorDocument`。
- 实现 Draft Raw -> Portable JSON。
- 实现 Lexical JSON -> Portable JSON。
- 实现 Portable JSON -> Lexical input editor initial state。
- 为 image、link、heading、list、code 建立第一批映射。

验收：

- 新旧内容能通过 portable schema 做最小 round-trip。
- 图片 entity data 中的 `src`、`alignment`、`resizeLayout` 不丢失。
- block id 稳定，不依赖 Draft runtime key。

## 阶段 4：AI Block 操作层

周期：4-8 周。

目标：让 AI 能读、写、建议修改 editor 内容。

任务：

- 实现 `getContextForAI()`：根据 selection、block id、message thread 生成结构化上下文。
- 实现 `applyAIPatch()`：只接受 portable patch，不直接写内核状态。
- 实现 `streamIntoBlock()`：支持 AI 流式写入某个 block。
- 实现 `SuggestionBlock`：支持 accept/reject。
- 为 tool call 增加状态模型：pending、running、success、error、approval required。

验收：

- AI 可以把内容插入指定 block 后。
- AI 可以替换 selection。
- 用户可以接受或拒绝 AI suggestion。
- 所有 AI 修改都可被 undo/redo 捕获。

## 阶段 5：文档编辑器内核决策

周期：取决于阶段 2-4 的稳定度。

目标：决定旧 `ModernEditor` / `DocEditor` 的长期内核。

决策条件：

| 条件 | 倾向 |
| --- | --- |
| 产品继续偏 AI input、chat composer、轻文档 | Lexical |
| 产品转向长文档、协同、评论、审阅、CMS | Tiptap / ProseMirror |
| 短期只需维护旧功能 | 保留 Draft legacy |

验收：

- 有迁移成本评估。
- 有功能覆盖矩阵。
- 有数据转换与回滚策略。

## 下一步最小 PR

建议第一 PR 不引入 Lexical，先建立迁移边界。

文件建议：

```text
src/core/runtime.ts
src/core/commands.ts
src/core/document.ts
src/core/selection.ts
src/adapters/draft/DraftRuntime.ts
```

PR 内容：

- 定义 `EditorRuntime` interface。
- 用 Draft 包一层 `DraftRuntime`。
- 将 `toggleInlineStyle`、`toggleBlockType`、`addImage` 先代理到 runtime。
- 保留原 hooks，避免破坏现有插件。

验收标准：

- `npm run build` 通过。
- basic story 行为不变。
- 新 runtime 可以被单元测试或 demo 调用。

## 近期待办清单

- [ ] 建立能力矩阵。
- [ ] 增加 `EditorRuntime` interface。
- [ ] 包装 Draft adapter。
- [ ] 定义 portable schema 草案。
- [ ] 新建 AI input editor demo。
- [ ] 评估构建链是否需要从 TSDX 迁到 Vite/tsup。
- [ ] 评估 React 16 与现代 Lexical 的兼容成本。
- [ ] 为 AI block 定义 stable id 策略。

## 风险控制

- 不在第一阶段改现有 storage 格式。
- 不在第一阶段迁移 drag/nested block。
- 不让业务层直接依赖 Lexical JSON。
- 不把 AI tool contract 绑定到 Draft 或 Lexical。
- 每阶段都保留 legacy Draft editor 可运行。
