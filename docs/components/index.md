# Components

The component set is organized around how AI products are built.

## Preview

<ComponentCatalogPreview />

## Full gallery

<AIElementsGalleryPreview />

## System model

Components are grouped by product responsibility instead of implementation
shape. Surfaces are complete screens or panels. Primitives are focused controls.
Blocks represent structured AI output. Runtime and debug pieces make the
payload path inspectable.

## Surfaces

| Component | Purpose |
| --- | --- |
| `AIElementsComposer` | Full prompt composer surface backed by Lexical. |
| `AIElementsAgentConsole` | Product-ready agent workspace with composer, plan, sources, files, terminal, tests and payload inspection. |
| `AIElementsSystemMap` | Explains the product architecture to users or docs readers. |
| `AIElementsCatalog` | Displays the available AI UI elements as a market/catalog. |
| `AIElementsGallery` | Registry-driven gallery grouped by surface, primitive, block, runtime and debug. |

## Input primitives

| Component | Purpose |
| --- | --- |
| `MentionPicker` | People, files, folders, context and actions. |
| `AttachmentTray` | Attached file/image/resource list. |
| `FileUploadButton` | File picker for attaching files to a prompt. |
| `FileDropzone` | Drag-and-drop file insert surface. |
| `ImageInsertPanel` | URL-based image block insertion panel. |
| `ModelSelector` | AI model selection. |
| `ToolModeTabs` | Chat, agent, search, code or product-specific intent. |
| `PromptHistoryMenu` | Prompt history and templates. |

## AI blocks

| Component | Purpose |
| --- | --- |
| `SourcesBlock` | Retrieval sources or references. |
| `CitationChip` | Compact inline source reference. |
| `ReasoningBlock` | Reasoning summary or step trace display. |
| `TaskPlanBlock` | Agent plan status list. |
| `FileTreeBlock` | Workspace context tree. |

## Runtime and debug

| Component | Purpose |
| --- | --- |
| `TerminalBlock` | Command and output display. |
| `TestResultsBlock` | Verification results. |
| `PayloadInspector` | Inspect the current structured payload. |

## Registry

The public catalog is backed by `aiElementsRegistry`, so docs, examples and
future agent tooling can refer to the same metadata.

```tsx
import { aiElementsRegistry } from 'react-tapable-editor';

const blocks = aiElementsRegistry.filter(item => item.category === 'Block');
```

## Import

```tsx
import {
  AIElementsStats,
  AIElementsAgentConsole,
  AIElementsComposer,
  AIElementsGallery,
  AIElementsWorkflow,
  MentionPicker,
  SourcesBlock,
  TaskPlanBlock,
  TerminalBlock,
  PayloadInspector,
} from 'react-tapable-editor';
```
