# Payload Inspector

`PayloadInspector` is a debug component for inspecting the exact payload that
will be sent to an AI runtime.

## Preview

<PayloadInspectorPreview />

## Import

```tsx
import { PayloadInspector } from 'react-tapable-editor';
```

## Usage

```tsx
<PayloadInspector payload={payload} />
```

## Why it matters

AI editor bugs often happen when a UI looks right but the runtime receives the
wrong shape. Keep the payload visible while building adapters.
