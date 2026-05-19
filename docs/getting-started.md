# Getting Started

## Install

```bash
npm install react-tapable-editor
```

Import the package CSS once in your app shell:

```tsx
import 'react-tapable-editor/style.css';
```

## Use the composer preset

`AIElementsComposer` is the quickest way to ship an AI input surface. It wraps
the Lexical editor with a shadcn-minded container and default AI controls.

```tsx
import { AIElementsComposer } from 'react-tapable-editor';

export function AgentComposer() {
  return (
    <AIElementsComposer
      title="Agent workspace"
      context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
      onSubmit={payload => {
        runAgent(payload);
      }}
    />
  );
}
```

## Customize defaults

```tsx
<AIElementsComposer
  mentionSuggestions={[
    { id: 'me', kind: 'person', label: 'Current user' },
    { id: 'src', kind: 'folder', label: 'src/' },
    { id: 'fix', kind: 'action', label: 'Fix failing tests' },
  ]}
  models={[{ id: 'reasoning', label: 'Reasoning model' }]}
  toolModes={[{ label: 'Agent', value: 'agent' }]}
/>
```

## Use primitives directly

The component set is not locked behind the composer.

```tsx
import {
  MentionPicker,
  SourcesBlock,
  TaskPlanBlock,
  PayloadInspector,
  aiElementsMentionSuggestions,
} from 'react-tapable-editor';

export function AgentPanel({ payload }) {
  return (
    <aside>
      <MentionPicker items={aiElementsMentionSuggestions} />
      <SourcesBlock sources={[{ id: 'docs', title: 'Product brief' }]} />
      <TaskPlanBlock tasks={[{ id: '1', title: 'Review context', status: 'doing' }]} />
      <PayloadInspector payload={payload} />
    </aside>
  );
}
```

## Payload shape

Submit callbacks receive a `PromptInputPayload`:

```ts
type PromptInputPayload = {
  text: string;
  parts: PromptInputPart[];
  lexical: unknown;
  portable: PortableEditorDocument;
  context: ContextItem[];
  attachments: AttachmentItem[];
  toolMode?: ToolMode;
  model?: ModelOption;
};
```

Use `parts` for runtime intent, `portable` for storage/interchange and
`lexical` only when you need exact editor reconstruction.
