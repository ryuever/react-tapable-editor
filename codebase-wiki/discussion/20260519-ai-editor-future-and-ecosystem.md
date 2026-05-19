---
id: D-002
title: AI Editor 未来形态与生态设想
description: >
  从 chat ecosystem、agent runtime、artifact block、schema interoperability 与插件生态角度，描述 AI editor 的演进方向。
category: discussion
created: 2026-05-19
updated: 2026-05-19
tags: [future, ecosystem, ai-editor, agent]
status: stable
references:
  - id: A-002
    rel: related
    file: ../architecture/20260519-design-philosophy.md
---

# AI Editor 未来形态与生态设想

## 未来的 AI Editor 不只是输入框

AI chat 的输入框会从“发一段话”演进成“组织一次任务”。这个任务可能包含：

- 用户目标。
- 当前文件、repo、网页、issue、截图。
- 可调用工具。
- 模型偏好。
- agent 权限。
- 输出格式。
- 中间产物。

所以 editor 的角色会从 composer 变成 task assembly surface。

## Chat 生态中的三种位置

### 输入层

最直接的切入点是 input editor：

- 结构化 context。
- attachment。
- model/tool selector。
- prompt history。
- slash command。

### 消息层

AI response 不应该只是 Markdown。它可以包含：

- artifact block。
- tool-call result。
- diff block。
- chart/table/image block。
- approval request。

同一套 block schema 可以在输入层和消息层共享。

### Workspace 层

当 artifact 变复杂，chat 会自然扩展出 workspace：

- 文档编辑。
- 代码修改。
- 表格分析。
- slide 生成。
- agent timeline。

Editor kernel 如果拥有 portable schema，就可以把 chat message、artifact editor、workspace view 串起来。

## 生态设想

### Node Package Ecosystem

围绕 node/block 建生态：

- `@rte/node-tool-call`
- `@rte/node-artifact`
- `@rte/node-image`
- `@rte/node-diff`
- `@rte/node-citation`
- `@rte/node-approval`

每个 node 提供：

- Lexical node。
- portable schema mapping。
- React view。
- command payload。
- optional toolbar。

### Runtime Adapter Ecosystem

围绕 AI runtime 做 adapter：

- OpenAI Responses / Agents adapter。
- LangGraph adapter。
- local tool runtime adapter。
- browser automation adapter。
- code agent adapter。

Adapter 负责把 `PromptInputPayload` 转成对应 runtime 的请求，并把 runtime events 映射回 editor block updates。

### Schema Interoperability

portable schema 是中间层：

- 向下可转 Lexical JSON。
- 向上可转 Markdown/plain text。
- 横向可给 server、database、agent runtime、analytics 使用。

长期看，AI editor 的护城河不只在 UI，而在 block schema 和 runtime events 的协议稳定性。

## 当前项目下一阶段

当前实现已经能证明方向。下一阶段可以继续推进：

- 多 block selection。
- streaming tool-call updates。
- citation/source block。
- diff/code review block。
- server-side schema validation。
- adapter examples。
- hosted docs/playground deployment。
