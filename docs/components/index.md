# Components

The component set is organized around how AI products are built.

## Preview

<ComponentCatalogPreview />

## Surfaces

| Component | Purpose |
| --- | --- |
| `AIElementsComposer` | Full prompt composer surface backed by Lexical. |
| `AIElementsSystemMap` | Explains the product architecture to users or docs readers. |
| `AIElementsCatalog` | Displays the available AI UI elements as a market/catalog. |

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

## Import

```tsx
import {
  AIElementsComposer,
  MentionPicker,
  SourcesBlock,
  TaskPlanBlock,
  TerminalBlock,
  PayloadInspector,
} from 'react-tapable-editor';
```
