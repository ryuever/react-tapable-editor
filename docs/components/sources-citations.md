# Sources & Citations

Use `SourcesBlock` and `CitationChip` for retrieval-heavy answers, research
agents and document-grounded chat.

## Preview

<SourcesCitationsPreview />

## Import

```tsx
import { SourcesBlock, CitationChip } from 'react-tapable-editor';
```

## Sources

```tsx
<SourcesBlock
  sources={[
    {
      id: 'docs',
      title: 'Product brief',
      description: 'Source document used by the agent.',
      url: '/docs/product-brief',
    },
  ]}
/>
```

## Citations

```tsx
<p>
  The answer is grounded in <CitationChip label="[1]" sourceId="docs" />.
</p>
```

## Future direction

Sources should eventually become portable schema parts so that an answer can
move between chat, docs and artifacts without losing provenance.
