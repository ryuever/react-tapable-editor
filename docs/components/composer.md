# Composer

`AIElementsComposer` is the designed AI input surface. It combines the Lexical
editor core with mention suggestions, tool modes, model selection, prompt
history, attachments and structured submit payloads.

## Import

```tsx
import { AIElementsComposer } from 'react-tapable-editor';
```

## Usage

```tsx
<AIElementsComposer
  title="Agent workspace"
  description="Compose with files, tools, models and artifacts."
  context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
  attachments={[{ id: 'brief', name: 'editor-brief.md', type: 'text/markdown' }]}
  onAIBlockAction={event => handleToolAction(event)}
  onSubmit={payload => runAgent(payload)}
/>
```

## Key props

| Prop | Description |
| --- | --- |
| `mentionSuggestions` | Default `@` suggestions. |
| `models` | Model options shown in the composer. |
| `toolModes` | Product modes such as chat, agent, search or code. |
| `promptHistory` | Prompt history/template list. |
| `onAIBlockAction` | Handles approval, reject, retry and inspect actions. |
| `onSubmit` | Receives the structured `PromptInputPayload`. |

## When to use

Use this when you want an opinionated default surface. Use the lower-level
`LexicalTapableEditor` when you need to build your own shell from scratch.
