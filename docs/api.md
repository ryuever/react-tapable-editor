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
