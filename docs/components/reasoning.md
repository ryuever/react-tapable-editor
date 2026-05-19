# Reasoning

`ReasoningBlock` shows a readable reasoning summary or step trace.

## Import

```tsx
import { ReasoningBlock } from 'react-tapable-editor';
```

## Usage

```tsx
<ReasoningBlock
  steps={[
    'Read the prompt and referenced files.',
    'Decide whether to answer directly or start an agent run.',
    'Return structured blocks that can be inspected later.',
  ]}
/>
```

## Product guidance

Use this for summaries of model behavior, planning state or explainable agent
steps. Keep sensitive hidden chain-of-thought out of user-facing UI; expose
useful summaries instead.
