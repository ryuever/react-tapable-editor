# Attachment Tray

`AttachmentTray` displays selected files, images or external resources.

## Preview

<AttachmentTrayPreview />

## Import

```tsx
import { AttachmentTray } from 'react-tapable-editor';
```

## Usage

```tsx
<AttachmentTray
  attachments={[
    { id: 'brief', name: 'brief.md', type: 'text/markdown' },
    { id: 'screen', name: 'screenshot.png', type: 'image/png' },
  ]}
  onRemove={id => removeAttachment(id)}
/>
```

## Runtime role

Attachments are included in `PromptInputPayload.attachments` and can also be
inserted as structured parts. This lets the runtime distinguish uploaded files
from natural-language instructions.
