---
id: P-003
title: Lexical AI Editor 下一阶段迭代 Backlog
description: >
  记录 Lexical AI Editor 在工具栏、节点交互、agent lifecycle、portable schema、
  测试与发布工程上的后续迭代事项。
category: roadmap
created: 2026-05-19
updated: 2026-05-19
tags: [backlog, lexical, ai-editor, testing, agent]
status: completed
references:
  - id: P-002
    rel: derived-from
    file: ./20260519-ai-editor-migration-tracker.md
---

# Lexical AI Editor 下一阶段迭代 Backlog

> 当前项目已切到 React 18 + Lexical + Vite，并具备 AI chip、artifact block、tool-call block、image block、portable payload 与基础 e2e。下一阶段要把它从“可运行骨架”推进到“可被真实 AI 产品集成的编辑层”。

## P0：交互与稳定性

- [x] 增加 Playwright 对 toolbar 的覆盖：bold、heading、list、link、code block。
- [x] 增加 Playwright 对 image block 的覆盖：insert、alignment、width update、payload parts。
- [x] 增加 Playwright 对 imperative handle 的覆盖：`insertAIBlock`、`updateAIBlock`、`getPayload`。
- [x] 增加空内容提交策略：允许/禁止空文本但包含 context/tool block。
- [x] 修复 Vite CJS Node API warning，迁移配置为纯 ESM。

## P0：Agent Lifecycle

- [x] 抽象 tool-call lifecycle：
  - `approval-required`
  - `pending`
  - `running`
  - `success`
  - `error`
- [x] 增加 tool-call action buttons：approve、reject、retry、inspect。
- [x] 增加 tool-call log/output 子结构，避免只把内容塞进 `content` 字符串。
- [x] 增加 agent run id 与 external tool invocation id 映射。

## P1：节点选择与编辑

- [x] 给 image/artifact/tool-call block 增加 selected state。
- [x] 增加 block toolbar：
  - delete
  - duplicate
  - move up/down
  - copy JSON
- [x] 增加 image toolbar：
  - left/center/right/full
  - width presets
  - caption edit
  - alt edit

## P1：Portable Schema

- [x] 将 `PortableEditorDocument` 从 `src/lexical/portable.ts` 提升为独立 `src/schema/`。
- [x] 给 portable schema 增加 discriminated union，而不是宽松 `props`。
- [x] 增加 schema version migration。
- [x] 增加 portable -> Lexical importer。
- [x] 增加 Markdown exporter 与 plain text context exporter。

## P1：AI Input Experience

- [x] slash menu 替代当前按钮式插入。
- [x] @ mention/context picker。
- [x] attachment upload adapter。
- [x] prompt history。
- [x] model/tool selector 与产品层状态解耦。

## P2：Package 与文档

- [x] 增加 API reference 文档。
- [x] 增加 usage examples：
  - chat composer
  - agent console
  - artifact editor
- [x] 增加 changelog。
- [x] 增加 npm publish 前检查脚本。

## 当前完成项

- [x] React 18 + Lexical + Vite 构建。
- [x] 清理旧 Draft/TSDX/Storybook 代码。
- [x] `AIChipNode`、`AIBlockNode`、`ImageNode`。
- [x] insert/update commands。
- [x] `LexicalTapableEditorHandle`。
- [x] `PromptInputPayload.portable`。
- [x] Playwright 基础 e2e。
- [x] Playwright 覆盖 toolbar、image block、agent run 与 imperative handle。
- [x] `emptySubmitPolicy` 支持 `allow`、`allow-structured`、`block`。
- [x] payload `text` 与结构化 `parts` 分离，避免 AI chip 被误当作用户正文。
- [x] `AIBlockNode` 支持 actions、logs、output、runId、invocationId。
- [x] `onAIBlockAction` 支持产品层接管 approve/reject/retry/inspect。
- [x] block/image selected toolbar 与 image toolbar。
- [x] portable schema v2、migration、Lexical importer、Markdown/plain text exporter。
- [x] slash menu、context picker、attachment upload、prompt history、model selector。
- [x] API reference、usage examples、changelog、`release:check`。
