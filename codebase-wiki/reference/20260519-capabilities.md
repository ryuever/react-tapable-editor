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
- @ context picker。
- attachment upload adapter。
- prompt history。
- tool mode selector。
- model selector。

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
