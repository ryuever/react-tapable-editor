# Runtime

The runtime layer connects editor UI to chat systems, agents, tools and storage.
Its job is to preserve structure instead of flattening everything into a prompt
string.

## Adapter preview

<RuntimeAdapterPreview />

## Submit payload

`onSubmit` receives `PromptInputPayload`. Runtime adapters should read:

- `text` for natural-language instructions.
- `parts` for structured intent and embedded AI blocks.
- `context` for product-provided references.
- `attachments` for uploaded resources.
- `model` for selected model.
- `toolMode` for user intent.
- `portable` for storage or cross-editor interchange.

```tsx
<AIElementsComposer
  onSubmit={payload => {
    const message = createPromptInputMessage(payload, {
      metadata: { product: 'agent-console' },
    });

    sendMessage(toAISDKSendMessageInput(message));
  }}
/>
```

## Normalized message

`PromptInputMessage` is the stable handoff contract for chat and agent runtimes.
It keeps editor-specific state out of the runtime while preserving references,
attachments, model selection and portable document state.

```ts
interface PromptInputMessage {
  text: string;
  parts: PromptInputPart[];
  attachments: PromptInputAttachment[];
  context: ContextItem[];
  referencedSources: ReferencedSourceItem[];
  toolMode: ToolMode;
  model?: ModelOption;
  portable: PortableEditorDocument;
  metadata?: Record<string, unknown>;
}
```

## AI SDK adapter

Use `toAISDKSendMessageInput` when the runtime expects a text field plus files
and metadata.

```tsx
const message = createPromptInputMessage(payload);

sendMessage(toAISDKSendMessageInput(message));
```

## OpenAI Responses adapter

Use `toOpenAIResponsesInput` when image/file attachments and image parts should
be converted into Responses input content.

```tsx
const input = toOpenAIResponsesInput(createPromptInputMessage(payload));

client.responses.create(input);
```

## AI block actions

Tool-call blocks emit actions:

```ts
type AIBlockAction = 'approve' | 'reject' | 'retry' | 'inspect';
```

Use `onAIBlockAction` to connect these actions to an agent runtime.

```tsx
<AIElementsAgentConsole
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
