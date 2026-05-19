---
id: A-002
title: React Tapable Editor 设计理念
description: >
  解释为什么编辑器要从富文本组件变成 AI runtime surface，以及当前架构如何服务 chat、agent、artifact 与 portable schema。
category: architecture
created: 2026-05-19
updated: 2026-05-19
tags: [design, architecture, ai-editor, lexical]
status: stable
references:
  - id: A-001
    rel: extends
    file: ./20260519-ai-native-editor-architecture.md
---

# React Tapable Editor 设计理念

## 从富文本组件到 AI Runtime Surface

传统 editor 的核心问题是“如何编辑文档”。AI editor 的核心问题变成了“如何组织人、上下文、工具、模型、agent 状态与产物之间的交互”。

因此当前设计不把编辑器理解为一个 textarea 的增强版，而是把它定义为 AI runtime surface：

- 用户自然语言是 `text`。
- 上下文、附件、工具、artifact、image 是结构化 `parts`。
- Agent 执行过程以内嵌 block 呈现。
- Portable schema 作为跨 runtime、跨页面、跨存储层的交换格式。

## 为什么选 Lexical

Lexical 的价值不是“开箱即用组件最多”，而是它适合做内核：

- node model 可控，方便把 AI chip、tool-call、artifact、image 作为一等节点。
- command/plugin 模型清晰，适合把产品层能力封装成可替换模块。
- React 集成轻，适合在 chat composer、agent console、artifact editor 等不同场景复用。
- editor state 与 serialization 明确，便于构造 portable schema。

## 架构原则

### 结构化优先

AI 输入不应该只是一段字符串。字符串适合模型消费，但不适合作为产品系统的唯一协议。编辑器输出应同时包含：

- 人类可读的 `text`。
- 模型可消费的 prompt 上下文。
- 系统可执行的 structured parts。
- 可长期存储的 portable document。

### 产品层接管关键决策

编辑器提供 interaction surface，但不绑定具体业务 runtime：

- 上传由 `onAttachmentUpload` 接管。
- tool-call action 由 `onAIBlockAction` 接管。
- model/tool mode 由产品层配置。
- agent run 与 external invocation id 由业务系统映射。

### Block 是未来 AI UI 的基本单位

AI chat 未来不会只是 message list，而是由不同 block 组成：

- prompt block。
- context block。
- tool-call block。
- artifact block。
- media block。
- approval block。
- log/output block。

这些 block 可以出现在输入框、消息体、agent console、artifact workspace 中。编辑器内核要能承载它们，而不是把它们放在编辑器外部绕行。
