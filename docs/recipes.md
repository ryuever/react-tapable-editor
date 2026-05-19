# Recipes

## Chat composer

```tsx
<AIElementsComposer
  title="Ask anything"
  toolModes={[{ label: 'Chat', value: 'chat' }]}
  onSubmit={payload => sendChat(payload)}
/>
```

## Coding agent console

```tsx
<AIElementsComposer
  title="Coding agent"
  toolModes={[
    { label: 'Agent', value: 'agent' },
    { label: 'Code', value: 'code' },
  ]}
  mentionSuggestions={[
    { id: 'src', kind: 'folder', label: 'src/' },
    { id: 'tests', kind: 'folder', label: 'tests/' },
    { id: 'fix', kind: 'action', label: 'Fix failing tests' },
  ]}
  onAIBlockAction={handleAgentAction}
  onSubmit={payload => runCodingAgent(payload)}
/>
```

## Retrieval answer

```tsx
<SourcesBlock
  sources={[
    { id: 'brief', title: 'Product brief', url: '/brief' },
    { id: 'api', title: 'API reference', url: '/api' },
  ]}
/>
```

## Verification panel

```tsx
<TerminalBlock command="npm run release:check" status="running" />
<TestResultsBlock
  results={[
    { id: 'e2e', name: 'Playwright e2e', status: 'passed' },
    { id: 'docs', name: 'Docs build', status: 'passed' },
  ]}
/>
```
