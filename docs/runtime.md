# Runtime

The runtime layer connects editor UI to AI systems.

## Submit payload

`onSubmit` receives `PromptInputPayload`. Runtime adapters should read:

- `text` for natural-language instructions.
- `parts` for structured intent and embedded AI blocks.
- `context` for product-provided references.
- `attachments` for uploaded resources.
- `model` for selected model.
- `toolMode` for user intent.
- `portable` for storage or cross-editor interchange.

## AI block actions

Tool-call blocks emit actions:

```ts
type AIBlockAction = 'approve' | 'reject' | 'retry' | 'inspect';
```

Use `onAIBlockAction` to connect these actions to an agent runtime.

```tsx
<AIElementsComposer
  onAIBlockAction={event => {
    if (event.action === 'approve') {
      startToolInvocation(event.id);
    }
  }}
/>
```

## Imperative updates

Use the editor ref to update runtime blocks:

```tsx
editorRef.current?.updateAIBlock({
  id: 'run-1',
  status: 'running',
  appendLog: { level: 'info', message: 'Agent started.' },
});
```

This lets tools and agents stream status back into the editor surface.
