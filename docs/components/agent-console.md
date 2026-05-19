# Agent Console

`AIElementsAgentConsole` is a product-level surface for agent workflows. It
combines the composer with task state, sources, file context, terminal output,
test results and payload inspection.

## Preview

<AgentConsolePreview />

## Use it

```tsx
import { AIElementsAgentConsole } from 'react-tapable-editor';

export function AgentWorkspace() {
  return (
    <AIElementsAgentConsole
      context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
      attachments={[{ id: 'brief', name: 'agent-brief.md', type: 'text/markdown' }]}
      onAIBlockAction={handleAgentAction}
      onSubmit={payload => runCodingAgent(payload)}
    />
  );
}
```

## Customize panels

Pass structured data for the default panels, or replace the side/runtime areas
entirely with slots.

```tsx
<AIElementsAgentConsole
  tasks={[
    { id: 'read', title: 'Read selected files', status: 'done' },
    { id: 'implement', title: 'Implement changes', status: 'doing' },
  ]}
  terminal={{
    command: 'npm run release:check',
    status: 'running',
    output: 'building...',
  }}
  runtimeSlot={<CustomRuntimePanel />}
  sidebarSlot={<CustomContextPanel />}
/>
```

## When to use

Use the agent console when the user needs to inspect the agent's working state.
Use the composer alone when the product only needs a prompt input.
