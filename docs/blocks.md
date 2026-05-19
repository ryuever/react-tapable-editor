# Blocks

Blocks are structured AI UI units. Some are Lexical nodes today; others are
React primitives that can become nodes later.

## Preview

<BlocksPreview />

## Why blocks matter

AI products need to show more than assistant text. A useful runtime can produce
sources, plans, logs, test results, tool calls, generated artifacts and images.
Those states should be represented as first-class UI blocks so they can be
inspected, updated, serialized and moved through the product.

## Lexical-backed blocks

| Block | Description |
| --- | --- |
| Artifact | Generated structured output that can be moved, copied or serialized. |
| Tool call | Agent/tool lifecycle with status, actions, logs and output. |
| Image | Visual context with caption, alt text, alignment and width controls. |

## React block primitives

| Block | Description |
| --- | --- |
| Sources | Retrieval sources and provenance. |
| Reasoning | Summary or step trace. |
| Task plan | Agent plan with statuses. |
| File tree | Workspace context. |
| Terminal | Command output. |
| Test results | Verification state. |

## Direction

High-value primitives should graduate into Lexical nodes when they need to be
edited inline, serialized as document state or updated by agent commands.

## Graduation rule

A React block should become a Lexical-backed block when at least one of these is
true:

- It needs inline editing inside the document flow.
- It needs durable document serialization.
- It needs command-based updates from an agent runtime.
- It affects copy, move, duplicate or payload export behavior.
