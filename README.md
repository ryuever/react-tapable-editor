# react-tapable-editor

AI-native React editor built on Lexical.

The current entry point exports a modern Lexical editor designed for AI chat and
agent workflows: rich prompt input, structured context, attachments, tool
intent, and serializable AI parts.

## Features

- React 18 + Lexical 0.44
- Vite library build with ESM, CJS, CSS, and TypeScript declarations
- Rich text controls for bold, italic, underline, strike, inline code, headings,
  quote, code block, ordered list, unordered list, and links
- Markdown shortcuts and undo/redo history
- Product-configurable AI tool modes and model selector
- Slash menu, @ mention suggestions, attachment upload adapter, and prompt history
- shadcn-inspired AI Elements preset with people/files/folders/actions defaults
- AI Elements primitives for mention picker, attachments, models, tool modes,
  file upload, file dropzone, image insert, prompt history, sources, citations,
  reasoning, task plans, file trees, terminal output, test results, and payload
  inspection
- Structured AI chips inside the Lexical document tree:
  - context
  - attachment
  - tool
- Structured AI blocks inside the Lexical document tree:
  - artifact
  - tool call with status, actions, logs, output, run id, and invocation id
  - image
- Selected block toolbar for delete, duplicate, move up/down, and copy JSON
- Image toolbar for alignment, width presets, caption, and alt text
- Update commands for tool-call lifecycle and image layout
- Imperative React ref API for agent/runtime integration
- Submit payload with user text, Lexical JSON, portable schema v2,
  structured parts, context, attachments, active tool mode, and model

## Install

```bash
npm install
```

## Develop

```bash
npm run start
```

Open the local Vite URL and try the demo editor.

## Build

```bash
npm run build
```

Build output:

- `dist/react-tapable-editor.mjs`
- `dist/react-tapable-editor.cjs`
- `dist/react-tapable-editor.css`
- `dist/index.d.ts`

## Usage

```tsx
import LexicalTapableEditor from 'react-tapable-editor';
import 'react-tapable-editor/style.css';

export function Composer() {
  return (
    <LexicalTapableEditor
      context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
      attachments={[{ id: 'brief', name: 'editor-brief.md' }]}
      models={[{ id: 'fast', label: 'Fast model' }]}
      promptHistory={['Summarize the latest artifact.']}
      onAIBlockAction={event => {
        console.log(event.action, event.id);
      }}
      onSubmit={payload => {
        console.log(payload.text);
        console.log(payload.parts);
        console.log(payload.portable);
      }}
    />
  );
}
```

## AI Elements preset

Use `AIElementsComposer` when you want a designed composer surface instead of a
bare editor core. It ships with a shadcn-inspired container, default mention
suggestions for people/files/folders/actions, model options, tool modes, and
prompt history.

```tsx
import {
  AIElementsCatalog,
  AIElementsComposer,
  AIElementsSystemMap,
  MentionPicker,
  PayloadInspector,
  SourcesBlock,
  TaskPlanBlock,
  aiElementsMentionSuggestions,
} from 'react-tapable-editor';
import 'react-tapable-editor/style.css';

export function WorkspaceComposer() {
  return (
    <>
      <AIElementsSystemMap />
      <AIElementsCatalog />
      <MentionPicker items={aiElementsMentionSuggestions} />
      <SourcesBlock
        sources={[
          { id: 'docs', title: 'Design notes', url: '/docs/ai-elements' },
        ]}
      />
      <TaskPlanBlock
        tasks={[
          { id: '1', title: 'Review context', status: 'done' },
          { id: '2', title: 'Run implementation agent', status: 'doing' },
        ]}
      />
      <AIElementsComposer
        title="Agent workspace"
        context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
        onSubmit={payload => runAgent(payload)}
      />
      <PayloadInspector payload={null} />
    </>
  );
}
```

The preset is intentionally opinionated but not closed: pass
`mentionSuggestions`, `models`, `toolModes`, `promptHistory`, and the normal
editor callbacks to replace any default.

The primitives can also be used without the composer. They are ordinary React
components that share the same TypeScript types as the editor payload, so a
product can place them in sidebars, popovers, agent consoles, or artifact
workspaces while keeping one schema contract.

## Commands

```tsx
import {
  INSERT_AI_BLOCK_COMMAND,
  INSERT_AI_CHIP_COMMAND,
  INSERT_IMAGE_COMMAND,
  UPDATE_AI_BLOCK_COMMAND,
  UPDATE_IMAGE_COMMAND,
} from 'react-tapable-editor';
```

The command payload types are exported as TypeScript types.

## Portable schema

```tsx
import {
  createLexicalJSONFromPortableDocument,
  exportPortableDocumentToMarkdown,
  exportPortableDocumentToPlainText,
  migratePortableDocument,
} from 'react-tapable-editor';
```

The portable document is a versioned schema that can be stored or sent to an AI
runtime without coupling the caller to Lexical internals.

## Imperative handle

```tsx
import { useRef } from 'react';
import LexicalTapableEditor, {
  LexicalTapableEditorHandle,
} from 'react-tapable-editor';

export function AgentComposer() {
  const editorRef = useRef<LexicalTapableEditorHandle | null>(null);

  return (
    <LexicalTapableEditor
      ref={editorRef}
      onSubmit={() => {
        editorRef.current?.insertAIBlock({
          id: 'run-1',
          kind: 'tool-call',
          title: 'Agent run',
          status: 'running',
        });
      }}
    />
  );
}
```

## Wiki

Planning and architecture notes live in `codebase-wiki/`.

```bash
npm run docs:wiki:dev
```

## Docs site

The public documentation site lives in `docs/`. It is separate from the
internal codebase wiki and is organized around Philosophy, Components, Blocks,
Runtime, Recipes, and API.

```bash
npm run docs:dev
```

## Release check

```bash
npm run release:check
```

This runs the production build, Playwright e2e suite, and wiki build.
