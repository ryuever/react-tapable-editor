# Task Plan

`TaskPlanBlock` displays an agent plan with lightweight status.

## Import

```tsx
import { TaskPlanBlock } from 'react-tapable-editor';
```

## Usage

```tsx
<TaskPlanBlock
  tasks={[
    { id: '1', title: 'Read selected files', status: 'done' },
    { id: '2', title: 'Implement component primitives', status: 'doing' },
    { id: '3', title: 'Run release checks', status: 'todo' },
  ]}
/>
```

## Status values

```ts
type TaskPlanStatus = 'todo' | 'doing' | 'done' | 'blocked';
```

## Future direction

The next natural step is a Lexical `TaskPlanNode`, so plans can be inserted
inside the composer and updated by an agent stream.
