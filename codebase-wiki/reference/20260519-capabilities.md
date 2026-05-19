---
id: R-004
title: 当前能力矩阵
description: 汇总编辑器当前支持的富文本、AI block、agent lifecycle、image、schema、测试与发布能力。
category: reference
created: 2026-05-19
updated: 2026-05-19
tags: [capabilities, api, ai-editor]
status: stable
references:
  - id: P-003
    rel: derived-from
    file: ../roadmap/20260519-next-iteration-backlog.md
---

# 当前能力矩阵

## 输入与编辑

- 富文本：bold、italic、underline、strikethrough、inline code。
- block：paragraph、heading、quote、code block、ordered list、unordered list、link。
- Markdown shortcuts。
- undo/redo history。

## AI 输入层

- context chip。
- attachment chip。
- tool chip。
- slash menu。
- @ mention suggestions：People、Files、Folders、Context、Actions。
- attachment upload adapter。
- prompt history。
- tool mode selector。
- model selector。
- shadcn 风格 `AIElementsComposer` preset。
- `AIElementsCatalog` 组件市场入口。
- `AIElementsSystemMap` 展示 surface、primitive、block、runtime bridge 分层。
- `MentionPicker`、`AttachmentTray`、`ModelSelector`、`ToolModeTabs`、`PromptHistoryMenu` 可单独导出使用。

## AI Elements 组件市场

- Sources 与 citations：`SourcesBlock`、`CitationChip`。
- Reasoning 展示：`ReasoningBlock`。
- Agent plan：`TaskPlanBlock`。
- Workspace context：`FileTreeBlock`。
- Runtime output：`TerminalBlock`、`TestResultsBlock`。
- Debug：`PayloadInspector`。

## AI Blocks

- artifact block。
- tool-call block。
- image block。
- selected state。
- block toolbar：delete、duplicate、move up/down、copy JSON。

## Agent Lifecycle

- 状态：`approval-required`、`pending`、`running`、`success`、`error`。
- actions：approve、reject、retry、inspect。
- logs。
- output。
- runId。
- invocationId。

## Image Workflow

- alignment：left、center、right、full。
- width presets。
- custom width。
- caption edit。
- alt edit。

## Payload 与 Schema

- `PromptInputPayload.text`：用户正文。
- `PromptInputPayload.parts`：结构化 AI parts。
- `PromptInputPayload.lexical`：Lexical JSON。
- `PromptInputPayload.portable`：portable schema v2。
- `migratePortableDocument`。
- `createLexicalJSONFromPortableDocument`。
- Markdown exporter。
- plain text exporter。

## 工程能力

- Vite library build。
- ESM + CJS + CSS + TypeScript declarations。
- Playwright e2e。
- VitePress 文档站。
- `release:check`：build + e2e + wiki build。
