# Media Insert

Media insertion is split into small primitives so product teams can place them
inside a composer toolbar, a side panel or an artifact workspace.

## File upload

```tsx
import { FileUploadButton } from 'react-tapable-editor';

<FileUploadButton
  accept="image/*,.md,.txt,.pdf"
  label="Attach files"
  onFiles={files => uploadFiles(files)}
/>
```

## File dropzone

```tsx
import { FileDropzone } from 'react-tapable-editor';

<FileDropzone
  label="Drop context files"
  acceptLabel="Images, markdown, documents"
  onFiles={files => uploadFiles(files)}
/>
```

## Image insert

`ImageInsertPanel` creates an `ImagePayload`. Connect it to the editor handle to
insert a real Lexical image block.

```tsx
import { ImageInsertPanel, LexicalTapableEditorHandle } from 'react-tapable-editor';
import { useRef } from 'react';

export function MediaComposer() {
  const editorRef = useRef<LexicalTapableEditorHandle | null>(null);

  return (
    <ImageInsertPanel
      onInsert={image => {
        editorRef.current?.insertImage(image);
      }}
    />
  );
}
```

## Editor-level support

The composer also has built-in support:

- `+` opens a native file picker and inserts attachment chips.
- Slash menu can insert an image block.
- `insertImage(payload)` is available on the imperative editor handle.
- Image blocks support alignment, width presets, caption and alt text.

## Runtime shape

Files become `attachment` parts. Images become `image` parts and are included in
the portable schema.
