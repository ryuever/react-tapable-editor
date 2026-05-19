---
id: R-003
title: Playground 用例指南
description: >
  说明 demo 中每个场景按钮展示什么、如何观察 payload，以及这些用例对应的真实产品集成方式。
category: reference
created: 2026-05-19
updated: 2026-05-19
tags: [playground, demo, ai-editor]
status: stable
references:
  - id: R-001
    rel: references
    file: ./20260519-api-reference.md
---

# Playground 用例指南

本地 playground 地址是 `http://localhost:5173/`。它不是营销页，而是一个可以直接操作的 AI editor surface，用来验证组件如何嵌入 chat、agent、artifact 与 media workflow。

## Demo 展示的用例

### Chat composer

按钮：`Load chat composer`

展示内容：

- 一段普通 prompt text。
- 一个 repo context chip。
- `@` 面板默认暴露 People、Files、Folders、Context、Actions。
- model selector 与 tool mode selector。
- submit 后 payload 中的 `text`、`parts`、`model`、`toolMode`。

真实产品映射：

- ChatGPT / Claude / Cursor 类输入框。
- 项目上下文、当前文件、当前 issue 作为结构化 chip，而不是被拼成一段不透明 prompt。

### AI Elements catalog

页面中的 system map 和 catalog cards 展示了可市场化的 AI Elements：

- Surfaces：Composer、Agent Console、Artifact Workspace。
- Primitives：Mention Picker、Model Select、Tool Mode、History、Attachments。
- Blocks：Tool Call、Artifact、Sources、Reasoning、Task Plan。
- Runtime Bridge：Payload Inspector、Terminal、Test Results、Action Events。

- AI Composer。
- Agent Console。
- Artifact Block。
- Visual Context。
- Mention Picker。
- Payload Inspector。
- Reasoning Block。
- Task Plan。
- Sources and Citations。
- Terminal and Test Results。

这些卡片对应 `AIElementsCatalog`，用于表达组件库不是单一 editor，而是一组可以围绕同一 schema 组合的 AI UI primitives。

### Component market

`Composable AI Elements` 区域展示当前已导出的可复用组件：

- `MentionPicker`：people/files/folders/context/actions 五类联想，点击后可插入 context chip。
- `AttachmentTray`：附件列表。
- `ModelSelector` 与 `ToolModeTabs`：模型和运行意图控制。
- `PromptHistoryMenu`：prompt 模板与历史。
- `SourcesBlock` 与 `CitationChip`：RAG/检索来源展示。
- `ReasoningBlock`：推理步骤或执行摘要。
- `TaskPlanBlock`：agent plan 的 todo/doing/done/blocked 状态。
- `FileTreeBlock`：repo context 或 workspace context。
- `TerminalBlock` 与 `TestResultsBlock`：工具运行、命令输出、测试结果。
- `PayloadInspector`：调试当前 `PromptInputPayload`。

这个区域是后续组件市场的雏形：每个组件都可以独立复制到业务页面，也可以逐步升级为 Lexical 内嵌 block。

### Agent console

按钮：`Load agent console`

展示内容：

- `tool-call` block。
- `pending / running / success / error / approval-required` lifecycle。
- approve、reject、retry、inspect action。
- logs、output、runId、invocationId。

真实产品映射：

- coding agent、research agent、workflow automation。
- 编辑器不仅提交 prompt，还能承载 agent 的执行过程与用户审批。

### Artifact editor

按钮：`Load artifact editor`

展示内容：

- `artifact` block。
- AI 生成的结构化内容以内嵌 block 的形式回到输入流。
- block 可以被选中、复制 JSON、移动、删除、重复。

真实产品映射：

- 生成 PRD、SQL、代码片段、报告、任务列表。
- Artifact 不只是右侧预览，而是可被继续引用、编辑、提交给下一轮 AI 的上下文。

### Visual context

按钮：`Load image workflow`

展示内容：

- image block。
- alignment、width presets、caption、alt 编辑。
- image 作为 `parts` 进入 payload。

真实产品映射：

- 截图问答、UI review、视觉标注、设计稿上下文。

## 观察 Payload

点击 `Send` 或 `Refresh payload` 后，页面下方会展示 `PromptInputPayload`：

- `text`: 用户自然语言正文。
- `parts`: context、attachment、tool、artifact、tool-call、image。
- `portable`: 与 Lexical 解耦的 portable schema v2。
- `lexical`: Lexical 原始 JSON。
- `model`: 当前模型选择。

设计重点是：AI runtime 不需要猜测 DOM，也不需要从纯文本里解析所有意图；它可以直接读取结构化 payload。
