---
id: R-005
title: AI Elements 与 shadcn 风格设计系统
description: >
  说明 AI Elements preset 的设计理念、默认 @ 联想能力、组件导出和 UI 市场化方向。
category: reference
created: 2026-05-19
updated: 2026-05-19
tags: [ai-elements, shadcn, design-system, marketplace]
status: stable
references:
  - id: R-001
    rel: extends
    file: ./20260519-api-reference.md
---

# AI Elements 与 shadcn 风格设计系统

`LexicalTapableEditor` 是内核，`AIElementsComposer` 是面向产品集成的设计系统 preset。它的目标不是把 UI 写死，而是提供一套有观点的默认体验：用户引入组件时，能同时拿到 AI editor 的结构化能力和一层可复用的 shadcn 风格界面。

这个方向参考了 AI Elements 的设计哲学：组件应该是 building blocks 而不是黑盒，API 要简单，默认可用，同时保持可组合、可访问、性能友好、TypeScript first，并尽量贴近 shadcn/ui 的“组件进入你的代码库”的心智。

## Demo 维度

当前 playground 不只展示一个 editor，而是四层：

- Use cases：Chat composer、Agent console、Artifact editor、Visual context。
- System map：Surfaces、Primitives、Blocks、Runtime Bridge。
- Catalog：可市场化的 AI UI elements。
- Component Market：一组可复制的 primitives 与 runtime blocks。
- Composer preset：真正可输入、可插入、可提交 payload 的 `AIElementsComposer`。

这意味着 demo 的目标不是“证明 editor 能编辑文字”，而是证明一套 AI UI marketplace 可以围绕同一套 schema 和 runtime events 成立。

## 设计原则

### Composability

组件是小块能力，而不是封闭盒子。`AIElementsComposer` 可以直接使用，也可以拆成：

- Mention Picker。
- Model Select。
- Tool Mode。
- Agent Run Block。
- Artifact Block。
- Payload Inspector。

### Simplicity

默认 preset 开箱可用，但替换入口保持直接：

- `mentionSuggestions`
- `models`
- `toolModes`
- `promptHistory`
- `onAIBlockAction`
- `onSubmit`

### Accessibility

当前实现给核心交互保留了 aria label：

- `AI editor input`
- `Mention suggestions`
- `Search mentions`
- `AI model`
- tool-call action buttons

### Performance

样式使用静态 CSS，导出保持模块化；`AIElementsComposer` 只是组合层，底层仍复用同一个 Lexical editor runtime。

### Developer Experience

类型从 `MentionSuggestion`、`PromptInputPayload`、`AIBlockActionEvent` 到 portable schema 都是显式导出，方便业务侧 autocomplete 和 runtime adapter 编写。

### shadcn/ui Foundation

当前没有强依赖 shadcn 包，而是采用 shadcn 的设计心智：

- 清晰边框、8px radius、克制色彩。
- 可复制/可替换的组件结构。
- 让产品团队能把 preset 当起点，而不是被主题系统锁住。

## 默认 @ 联想

点击 `@` 后，默认展示五类 suggestion：

- People：人、角色、owner、reviewer。
- Files：文件名、当前打开文件、相关源码。
- Folders：目录、模块、工作区范围。
- Context：产品层传入的上下文。
- Actions：review、generate、implement 等可执行意图。

所有 suggestion 最终都进入 `PromptInputPayload.parts`，并通过 `meta.mentionKind` 标记类型。这样 AI runtime 可以知道用户引用的是一个人、文件、目录还是动作，而不是只拿到一段文本。

## 组件导出

```tsx
import {
  AIElementsCatalog,
  AIElementsComposer,
  AIElementsSystemMap,
  AttachmentTray,
  CitationChip,
  FileTreeBlock,
  MentionPicker,
  ModelSelector,
  PayloadInspector,
  PromptHistoryMenu,
  ReasoningBlock,
  SourcesBlock,
  TaskPlanBlock,
  TerminalBlock,
  TestResultsBlock,
  ToolModeTabs,
  aiElementsMentionSuggestions,
  aiElementsModels,
  aiElementsPromptHistory,
  aiElementsToolModes,
} from 'react-tapable-editor';
```

当前公开组件分为四组：

- Surface：`AIElementsComposer`、`AIElementsSystemMap`、`AIElementsCatalog`。
- Input primitives：`MentionPicker`、`AttachmentTray`、`ModelSelector`、`ToolModeTabs`、`PromptHistoryMenu`。
- AI blocks：`SourcesBlock`、`CitationChip`、`ReasoningBlock`、`TaskPlanBlock`、`FileTreeBlock`。
- Runtime/debug：`TerminalBlock`、`TestResultsBlock`、`PayloadInspector`。

这些组件目前作为 React UI primitives 暴露；下一步可以把高价值 blocks 继续沉入 Lexical node，例如 `TaskPlanNode`、`SourcesNode`、`ReasoningTraceNode`、`TerminalOutputNode`，让它们既能在 composer 外部展示，也能成为文档树中的可编辑 AI part。

## 推荐用法

```tsx
<AIElementsComposer
  title="Agent workspace"
  description="Compose with people, files, folders, tools, models and artifacts."
  context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
  onSubmit={payload => runAgent(payload)}
/>
```

如果产品已有自己的数据源，可以替换默认 preset：

```tsx
<AIElementsComposer
  mentionSuggestions={[
    { id: 'me', kind: 'person', label: 'Current user' },
    { id: 'app', kind: 'folder', label: 'src/app' },
    { id: 'fix', kind: 'action', label: 'Fix failing tests' },
  ]}
  models={[{ id: 'reasoning', label: 'Reasoning model' }]}
  toolModes={[{ label: 'Agent', value: 'agent' }]}
/>
```

## UI 市场化方向

AI Elements 可以继续拆成可发布的组合件：

- `AIComposer`: 输入框、toolbar、model/tool selector。
- `MentionPicker`: people/files/folders/actions 联想。
- `AgentRunBlock`: approval、logs、output、status。
- `ArtifactBlock`: structured output、copy JSON、export。
- `ImageContextBlock`: screenshot/image context。
- `PromptPayloadInspector`: payload/debug 面板。
- `SourcesBlock`: RAG sources、citation chips、retrieval metadata。
- `ReasoningBlock`: 可展示/可折叠的 reasoning summary 或 step trace。
- `TaskPlanBlock`: agent plan、todo、blocked、done 状态。
- `FileTreeBlock`: repo/file/folder context browser。
- `TerminalBlock`: command、logs、exit status。
- `TestResultsBlock`: verification output、failed/passed/skipped。

这些组件共享同一套 schema 与 payload 协议。市场化的重点不是“多几个漂亮组件”，而是让每个组件都能稳定参与 AI runtime：可序列化、可回放、可审计、可被 agent 更新。

## 下一步组件路线

1. 将 `TaskPlanBlock` 与 `SourcesBlock` 扩展为 Lexical nodes，支持在 editor 内直接插入和更新。
2. 为 `TerminalBlock` 与 `TestResultsBlock` 增加 streaming adapter，接入 agent/tool 执行过程。
3. 给 `MentionPicker` 增加 async provider，默认支持人、文件、文件夹、symbol、issue、PR、action。
4. 将 primitives 拆成更细的 copyable recipes，让使用者可以按 shadcn/ui 的方式复制到业务代码库中。
5. 为每个 block 定义 portable schema part，保证聊天、文档、agent workspace 之间可以搬运同一份内容。
