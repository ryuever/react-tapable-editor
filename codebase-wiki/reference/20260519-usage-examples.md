---
id: R-002
title: Lexical AI Editor Usage Examples
description: Chat composer、agent console、artifact editor 三类集成示例。
category: reference
created: 2026-05-19
updated: 2026-05-19
tags: [examples, ai-editor, integration]
status: stable
references:
  - id: R-001
    rel: references
    file: ./20260519-api-reference.md
---

# Lexical AI Editor Usage Examples

## Chat Composer

```tsx
<LexicalTapableEditor
  context={[{ id: 'thread', label: 'current-thread', type: 'chat' }]}
  models={[{ id: 'fast', label: 'Fast model' }]}
  onSubmit={payload => sendMessage(payload)}
/>
```

适合普通聊天输入：`text` 作为用户问题，`parts` 作为上下文、附件、工具意图。

## Agent Console

```tsx
<LexicalTapableEditor
  defaultToolMode="agent"
  onAIBlockAction={event => agentRuntime.dispatch(event)}
  onSubmit={payload => agentRuntime.start(payload)}
/>
```

适合长任务 agent：tool-call block 承载审批、运行、成功、失败、日志和输出。

## Artifact Editor

```tsx
const editorRef = useRef<LexicalTapableEditorHandle>(null);

editorRef.current?.insertAIBlock({
  id: 'artifact-1',
  kind: 'artifact',
  title: 'Spec draft',
  status: 'success',
  content: markdown,
});
```

适合把 AI 产物以内嵌 block 形式放回输入流或任务流，再由 portable schema 导出 Markdown 或 plain text。
