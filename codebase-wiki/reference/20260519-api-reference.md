---
id: R-001
title: Lexical AI Editor API Reference
description: React Tapable Editor 的 Lexical AI 输入层 API 参考。
category: reference
created: 2026-05-19
updated: 2026-05-19
tags: [api, lexical, ai-editor]
status: stable
references:
  - id: P-003
    rel: implements
    file: ../roadmap/20260519-next-iteration-backlog.md
---

# Lexical AI Editor API Reference

## 入口

```tsx
import LexicalTapableEditor from 'react-tapable-editor';
import 'react-tapable-editor/style.css';
```

## 核心 Props

- `context`: 可插入为 `@context` chip 的上下文对象。
- `attachments`: 可插入为 attachment chip 的外部附件。
- `onAttachmentUpload(file)`: 上传适配器，返回 `AttachmentItem`。
- `toolModes`: 产品层定义的 mode 列表，默认 `chat / agent / search / code`。
- `models`: 产品层定义的模型列表。
- `promptHistory`: 输入历史，编辑器提供 prev/next 装载。
- `emptySubmitPolicy`: `allow`、`allow-structured`、`block`。
- `onAIBlockAction(event)`: 接管 tool-call 的 `approve / reject / retry / inspect`。
- `onChange(payload)` / `onSubmit(payload)`: 获取结构化 prompt payload。

## Payload

`PromptInputPayload` 包含：

- `text`: 只包含用户自然语言正文，不包含 AI chip/block 的展示文案。
- `lexical`: Lexical 原始 JSON。
- `portable`: 与编辑器内核解耦的 portable schema v2。
- `parts`: context、attachment、tool、artifact、tool-call、image 等结构化部分。
- `context` / `attachments`: 产品层传入和上传得到的上下文。
- `toolMode`: 当前 mode。
- `model`: 当前模型。

## Imperative Handle

```ts
interface LexicalTapableEditorHandle {
  focus(): void;
  getEditor(): LexicalEditor | null;
  getPayload(): PromptInputPayload | null;
  insertAIBlock(payload: AIBlockPayload): void;
  insertAIChip(payload: AIChipPayload): void;
  insertImage(payload: ImagePayload): void;
  updateAIBlock(payload: UpdateAIBlockPayload): void;
  updateImage(payload: UpdateImagePayload): void;
}
```

## Portable Schema Helpers

- `createPortableDocumentFromEditorState(editorState)`
- `createPortableDocumentFromJSON(json)`
- `migratePortableDocument(document)`
- `createLexicalJSONFromPortableDocument(document)`
- `exportPortableDocumentToMarkdown(document)`
- `exportPortableDocumentToPlainText(document)`
