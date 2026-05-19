# Mention Picker

`MentionPicker` represents references that should stay structured in an AI
payload: people, files, folders, context and actions.

## Preview

<MentionPickerPreview />

## Import

```tsx
import { MentionPicker, aiElementsMentionSuggestions } from 'react-tapable-editor';
```

## Usage

```tsx
<MentionPicker
  items={aiElementsMentionSuggestions}
  onSelect={item => {
    editorRef.current?.insertAIChip({
      id: item.id,
      kind: 'context',
      label: item.label,
      meta: { mentionKind: item.kind },
    });
  }}
/>
```

## Item shape

```ts
type MentionSuggestion = {
  id: string;
  kind: 'person' | 'file' | 'folder' | 'context' | 'action';
  label: string;
  description?: string;
  meta?: Record<string, unknown>;
};
```

## Design note

A mention is not just display text. It is a runtime reference. Files, folders
and actions should reach the AI system as typed metadata, not a fragile prompt
substring.
