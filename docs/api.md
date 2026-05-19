# API

## Main exports

```tsx
export {
  LexicalTapableEditor,
  AIElementsComposer,
  AIElementsSystemMap,
  AIElementsCatalog,
  MentionPicker,
  AttachmentTray,
  FileDropzone,
  FileUploadButton,
  ModelSelector,
  ImageInsertPanel,
  ToolModeTabs,
  PromptHistoryMenu,
  SourcesBlock,
  CitationChip,
  ReasoningBlock,
  TaskPlanBlock,
  FileTreeBlock,
  TerminalBlock,
  TestResultsBlock,
  PayloadInspector,
  PromptInputProvider,
  createPromptInputMessage,
  toAISDKSendMessageInput,
  toOpenAIResponsesInput,
};
```

## Presets

```tsx
export {
  aiElementsMentionSuggestions,
  aiElementsModels,
  aiElementsPromptHistory,
  aiElementsToolModes,
};
```

## Editor handle

```ts
interface LexicalTapableEditorHandle {
  focus(): void;
  getEditor(): LexicalEditor | null;
  getPayload(): PromptInputPayload | null;
  insertAIBlock(payload: AIBlockPayload): void;
  insertAIChip(payload: AIChipPayload): void;
  insertImage(payload: ImagePayload): void;
  updateAIBlock(payload: UpdateAIBlockPayload): void;
  updateImage(payload: UpdateImagePayload): void;
}
```

## Prompt input runtime

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

`AIElementsComposer` and `LexicalTapableEditor` still emit the legacy
`PromptInputPayload` through `onSubmit`. Use `onPromptInputSubmit` when you want
the normalized chat input contract.

```tsx
<AIElementsComposer
  onPromptInputSubmit={message => {
    sendMessage(toAISDKSendMessageInput(message));
  }}
/>
```

Use `PromptInputProvider`, `usePromptInputState` and
`usePromptInputController` when the surrounding chat runtime needs to own
submitting, streaming, stopping, retrying or clearing composer state.

## Portable schema helpers

```tsx
export {
  createLexicalJSONFromPortableDocument,
  createPortableDocumentFromEditorState,
  createPortableDocumentFromJSON,
  exportPortableDocumentToMarkdown,
  exportPortableDocumentToPlainText,
  migratePortableDocument,
};
```

## Commands

```tsx
export {
  INSERT_AI_BLOCK_COMMAND,
  INSERT_AI_CHIP_COMMAND,
  INSERT_IMAGE_COMMAND,
  UPDATE_AI_BLOCK_COMMAND,
  UPDATE_IMAGE_COMMAND,
};
```
