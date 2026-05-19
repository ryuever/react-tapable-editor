# Gallery

The gallery is the public view of `aiElementsRegistry`. It is the place to scan
available surfaces, primitives, blocks and runtime tools before choosing a
recipe or API.

## Preview

<AIElementsGalleryPreview />

## How to read it

Each element carries enough metadata for docs, product teams and future agent
tooling to make the same decision:

| Field | Purpose |
| --- | --- |
| `category` | Product responsibility: surface, primitive, block, runtime or debug. |
| `maturity` | Whether the element is ready, preview or planned. |
| `importName` | The public export to import from the package. |
| `docsPath` | The public page or recipe that explains the element. |
| `sourcePath` | The implementation file for local ownership and review. |
| `tags` | Search and grouping hints for docs and agents. |

## Registry usage

```tsx
import { aiElementsRegistry } from 'react-tapable-editor';

const surfaces = aiElementsRegistry.filter(
  item => item.category === 'Surface' && item.maturity === 'ready'
);
```
