---
layout: home

hero:
  name: "React Tapable Editor"
  text: "AI-native editor playground and docs"
  tagline: Chat composer · Agent console · Artifact blocks · Portable schema
  actions:
    - theme: brand
      text: 快速使用
      link: /reference/20260519-api-reference
    - theme: alt
      text: Playground 指南
      link: /reference/20260519-playground-guide

features:
  - title: Playground
    details: 通过四个场景体验 AI editor 的输入、agent、artifact 与视觉上下文。
    link: /reference/20260519-playground-guide
  - title: 能力矩阵
    details: 查看当前支持的编辑能力、AI block、payload、schema 与测试覆盖。
    link: /reference/20260519-capabilities
  - title: 设计理念
    details: 为什么从 Draft 迁移到 Lexical，以及为什么编辑器要成为 AI runtime surface。
    link: /architecture/20260519-design-philosophy
  - title: 未来形态
    details: 关于 AI editor、chat ecosystem、block runtime 与生态分层的判断。
    link: /discussion/20260519-ai-editor-future-and-ecosystem
  - title: API Reference
    details: Props、payload、imperative handle 与 portable helpers 的使用入口。
    link: /reference/20260519-api-reference
---

这个站点是 React Tapable Editor 的产品化文档入口：它不仅记录迁移过程，也解释当前 playground 展示什么、组件怎么接入、为什么把编辑器设计成 AI chat / agent / artifact 的统一输入层。

本地入口：

- Playground: `http://localhost:5173/`
- 文档站: `http://localhost:5174/`

## 文档索引

### architecture/ — 架构分析

| # | 文件 | 标题 | 概述 |
|---|------|------|------|
| A-001 | [20260519-ai-native-editor-architecture.md](./architecture/20260519-ai-native-editor-architecture.md) | AI Native Editor 目标架构 | 将 react-tapable-editor 从 Draft.js 绑定的富文本组件，演进为面向 AI chat、prompt input、message block 与 artifact block 的可插拔编辑器运行时。 |
| A-002 | [20260519-design-philosophy.md](./architecture/20260519-design-philosophy.md) | React Tapable Editor 设计理念 | 解释为什么编辑器要从富文本组件变成 AI runtime surface，以及当前架构如何服务 chat、agent、artifact 与 portable schema。 |

### discussion/ — 技术讨论

| # | 文件 | 标题 | 概述 |
|---|------|------|------|
| D-001 | [20260519-editor-kernel-selection.md](./discussion/20260519-editor-kernel-selection.md) | 编辑器内核选型调研：Lexical、Tiptap 与 Draft 后继路线 | 基于当前 Draft.js 项目的源码依赖与现代开源编辑器生态，对 Lexical、Tiptap、BlockNote、Plate/Slate 等方案进行对比，并给出 AI chat 场景下的内核选择建议。 |
| D-002 | [20260519-ai-editor-future-and-ecosystem.md](./discussion/20260519-ai-editor-future-and-ecosystem.md) | AI Editor 未来形态与生态设想 | 从 chat ecosystem、agent runtime、artifact block、schema interoperability 与插件生态角度，描述 AI editor 的演进方向。 |

### issue/ — Issue 记录

| # | 文件 | 标题 | 概述 |
|---|------|------|------|
| R-001 | [20260519-api-reference.md](./reference/20260519-api-reference.md) | Lexical AI Editor API Reference | React Tapable Editor 的 Lexical AI 输入层 API 参考。 |
| R-002 | [20260519-usage-examples.md](./reference/20260519-usage-examples.md) | Lexical AI Editor Usage Examples | Chat composer、agent console、artifact editor 三类集成示例。 |
| R-003 | [20260519-playground-guide.md](./reference/20260519-playground-guide.md) | Playground 用例指南 | 说明 demo 中每个场景按钮展示什么、如何观察 payload，以及这些用例对应的真实产品集成方式。 |
| R-004 | [20260519-capabilities.md](./reference/20260519-capabilities.md) | 当前能力矩阵 | 汇总编辑器当前支持的富文本、AI block、agent lifecycle、image、schema、测试与发布能力。 |

### reference/ — 参考手册

| # | 文件 | 标题 | 概述 |
|---|------|------|------|
|  |  |  |  |

### roadmap/ — 规划路线

| # | 文件 | 标题 | 概述 |
|---|------|------|------|
| P-001 | [20260519-draft-to-ai-editor-roadmap.md](./roadmap/20260519-draft-to-ai-editor-roadmap.md) | Draft 到 AI Native Editor 的渐进式重构路线图 | 面向 react-tapable-editor 的下一步重构计划：先保留 Draft legacy，抽出 editor runtime，再以 Lexical 实现 AI input editor，最终支持 message block、artifact block 与 agent 操作层。 |
| P-002 | [20260519-ai-editor-migration-tracker.md](./roadmap/20260519-ai-editor-migration-tracker.md) | AI Editor 全量迁移实施追踪 | 用于跟踪从 Draft.js legacy editor 迁移到 AI native editor runtime 的执行状态，覆盖 PR 拆分、验收标准、风险、当前进度与后续里程碑。 |
| P-003 | [20260519-next-iteration-backlog.md](./roadmap/20260519-next-iteration-backlog.md) | Lexical AI Editor 下一阶段迭代 Backlog | 记录 Lexical AI Editor 在工具栏、节点交互、agent lifecycle、portable schema、测试与发布工程上的后续迭代事项。 |
