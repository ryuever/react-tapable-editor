---
id: D-001
title: 编辑器内核选型调研：Lexical、Tiptap 与 Draft 后继路线
description: >
  基于当前 Draft.js 项目的源码依赖与现代开源编辑器生态，对 Lexical、Tiptap、
  BlockNote、Plate/Slate 等方案进行对比，并给出 AI chat 场景下的内核选择建议。
category: discussion
created: 2026-05-19
updated: 2026-05-19
tags: [editor, draft-js, lexical, tiptap, ai-editor, migration]
status: draft
sources:
  - title: "Draft.js GitHub archive status"
    url: "https://github.com/facebookarchive/draft-js"
  - title: "Lexical introduction"
    url: "https://lexical.dev/docs/intro"
  - title: "Lexical GitHub repository"
    url: "https://github.com/facebook/lexical"
  - title: "Lexical nodes"
    url: "https://lexical.dev/docs/concepts/nodes"
  - title: "Lexical commands"
    url: "https://lexical.dev/docs/concepts/commands"
  - title: "Tiptap docs"
    url: "https://tiptap.dev/docs"
  - title: "Tiptap Content AI overview"
    url: "https://tiptap.dev/docs/content-ai/getting-started/overview"
  - title: "BlockNote docs"
    url: "https://www.blocknotejs.org/docs"
  - title: "Plate AI docs"
    url: "https://platejs.org/docs/ai"
  - title: "Vercel AI Elements Prompt Input"
    url: "https://elements.ai-sdk.dev/components/prompt-input"
references:
  - id: A-001
    rel: derives
    file: ../architecture/20260519-ai-native-editor-architecture.md
  - id: P-001
    rel: derives
    file: ../roadmap/20260519-draft-to-ai-editor-roadmap.md
  - id: P-002
    rel: derives
    file: ../roadmap/20260519-ai-editor-migration-tracker.md
---

# 编辑器内核选型调研：Lexical、Tiptap 与 Draft 后继路线

> 当前项目已经深度绑定 Draft.js 与 Draft 内部数据结构，不能安全地做一次性替换。更合理的路线是保留 Draft legacy surface，先抽象统一 runtime，再用 Lexical 做 AI input editor 的新入口。

## 来源

- [Draft.js GitHub archive status](https://github.com/facebookarchive/draft-js)
- [Lexical introduction](https://lexical.dev/docs/intro)
- [Lexical GitHub repository](https://github.com/facebook/lexical)
- [Lexical nodes](https://lexical.dev/docs/concepts/nodes)
- [Lexical commands](https://lexical.dev/docs/concepts/commands)
- [Tiptap docs](https://tiptap.dev/docs)
- [Tiptap Content AI overview](https://tiptap.dev/docs/content-ai/getting-started/overview)
- [BlockNote docs](https://www.blocknotejs.org/docs)
- [Plate AI docs](https://platejs.org/docs/ai)
- [Vercel AI Elements Prompt Input](https://elements.ai-sdk.dev/components/prompt-input)

## 当前项目信号

这个仓库不是普通 Draft 富文本组件，而是一个围绕 Draft.js 和 tapable 叠出来的插件化编辑器。

关键事实：

- `package.json:48-59` 直接依赖 `draft-js`、`immutable`、`prismjs` 和 `tapable` 相关生态。
- `src/createEditor.tsx:49-135` 定义了大量 tapable hooks，包括 state、selection、decorator、toolbar、image、drag drop 与 block depth。
- `src/createEditor.tsx:173-263` 在组件挂载后将 Draft 的 `EditorState`、`RichUtils`、`CompositeDecorator` 接入 hook 流。
- `src/Editor.tsx:39-77` 直接读取 Draft `ContentState` 和 `BlockMap`，用 block key diff 同步拖拽订阅。
- `src/Editor.tsx:131-140` 渲染 Draft `<Editor />`，并把 `blockRenderMap`、`blockRendererFn`、`customStyleMap` 作为核心扩展点。
- `src/plugins/AddImagePlugin.ts:20-40` 通过 Draft entity + atomic block 插入图片。
- `src/plugins/dnd-plugin/configNest.ts:59-91` 从 Draft offset key 提取 block key，并绑定 `.DraftEditor-root` DOM selector。

因此，替换内核不是把 `draft-js` 换成另一个 npm 包，而是要先切开四类耦合：

1. 编辑状态模型：`EditorState`、`ContentState`、selection。
2. 文档模型：block、entity、inline style、decorator。
3. UI 扩展点：toolbar、image toolbar、sidebar、placeholder。
4. DOM 依赖：Draft class、offset key、block key、selection rect。

## 方案对比

| 方案 | 定位 | 优点 | 风险 | 对本项目判断 |
| --- | --- | --- | --- | --- |
| Draft.js | legacy rich text framework | 当前项目已集成，迁移成本为 0 | 官方仓库已归档，只适合作为 legacy 兼容 | 不再作为未来投入方向 |
| Lexical | lightweight editor framework / interaction kernel | 命令系统、节点模型、React plugin、自定义 node、JSON/Markdown/HTML、Yjs；和 Draft 心智接近 | 0.x 仍有 deprecation/minor breaking；UI 需要自己组织 | 推荐先用于 AI input editor |
| Tiptap / ProseMirror | schema-first document editor framework | ProseMirror 生态成熟，强 schema，协同、评论、AI Toolkit 产品化能力强 | 心智较重，迁移成本高；更偏完整文档而非多处轻量嵌入 | 适合作为未来长文档/协同文档候选 |
| BlockNote | block-based React editor product layer | Notion-like 体验开箱即用，React UI 现成 | 产品层封装较厚，自定义内核和旧插件迁移空间较小 | 适合快速产品验证，不适合作为底层内核 |
| Plate / Slate | Slate-based plugin/editor kit | Plate 的 AI 与 shadcn 方向值得参考 | Slate core 文档仍标注 beta，底层维护成本偏高 | 可参考 UI/AI pattern，不建议作为主迁移目标 |

## 为什么 AI 方向先选 Lexical

Lexical 更像未来 AI 交互编辑内核，而 Tiptap 更像未来文档编辑器。

AI chat 里的编辑器往往不是单一长文档，而是很多个小 surface：

- prompt input editor
- message 内部可编辑区域
- AI 输出 artifact block
- tool invocation block
- inline suggestion / diff
- context chip / mention chip
- nested editor
- agent 对局部内容执行 read、insert、replace、accept、reject 操作

Lexical 的优势在这些场景里更直接：

1. **命令系统适合 Agent Tool 化**  
   `createCommand`、`dispatchCommand`、`registerCommand` 可以自然映射到 AI tool/action。未来可以暴露 `insertBlock`、`replaceSelection`、`streamIntoBlock`、`acceptSuggestion` 等命令。

2. **轻量，适合多处嵌入**  
   AI 产品可能同时存在 prompt 输入、评论框、message editor、artifact editor。Lexical 的轻 core 与插件延迟加载适合这种布局。

3. **自定义节点适合 AI block**  
   `DecoratorNode` 能承载 React UI，适合 `ContextChipNode`、`ToolCallNode`、`ArtifactNode`、`DiffSuggestionNode`、`CodePatchNode` 这类不只是文本的交互对象。

4. **迁移心智接近 Draft**  
   当前项目围绕 `EditorState`、selection、decorator、block/entity 和 plugin hooks 组织。Lexical 也是 immutable editor state + selection + command/plugin + custom node，比直接进入 ProseMirror transaction/schema 世界更平滑。

5. **探索期不会被强 schema 过早锁死**  
   AI-native block grammar 还需要迭代。Lexical 适合先探索交互，再逐步收紧 schema 与 serialization。

## Tiptap 仍然更强的场景

如果未来产品明确转向 Notion/Google Docs/CMS 级完整文档，Tiptap 需要重新进入候选优先级第一梯队。

它更强的方向包括：

- 长文档 schema 管控。
- 协同编辑、评论、版本、审阅工作流。
- ProseMirror 社区积累。
- Tiptap Content AI、Server AI Toolkit、schema-aware generation 等产品化能力。
- 文档导入导出、分页、comments、tracked changes 等成熟路线。

因此当前建议不是否定 Tiptap，而是阶段性选择：

- AI input / chat composer / message block / artifact editor：Lexical 优先。
- 长文档 / 协同文档 / CMS / 评论审阅：Tiptap 优先重新评估。

## 结论

短期不要全量迁移。推荐路线：

1. 保留 Draft.js 作为 legacy editor。
2. 抽出 editor runtime 和 command layer，降低 UI 与 Draft 的直接耦合。
3. 用 Lexical 实现新的 AI input editor。
4. 通过统一 schema 将 Draft Raw、Lexical JSON、AI block JSON 隔离在 adapter 之外。
5. 当 AI input 与 block schema 稳定后，再决定文档编辑器最终使用 Lexical 还是 Tiptap。

详见 [AI Native Editor 目标架构](../architecture/20260519-ai-native-editor-architecture.md) 和 [Draft 到 AI Editor 迁移路线图](../roadmap/20260519-draft-to-ai-editor-roadmap.md)。
