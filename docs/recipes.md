# Recipes

Recipes are product-level compositions. Start here when you know the workflow
you want to ship, then open the component docs for lower-level details.

## Chat composer

Use this when the product needs a polished prompt input but does not yet need a
full agent workspace.

<ChatComposerRecipePreview />

```tsx
<AIElementsComposer
  title="Ask anything"
  toolModes={[{ label: 'Chat', value: 'chat' }]}
  onSubmit={payload => sendChat(payload)}
/>
```

## Coding agent console

Use the agent console when the user needs to see context, plan state, logs,
verification and payloads together.

<AgentConsolePreview />

```tsx
<AIElementsAgentConsole
  context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
  attachments={[{ id: 'brief', name: 'agent-brief.md', type: 'text/markdown' }]}
  onAIBlockAction={handleAgentAction}
  onSubmit={payload => runCodingAgent(payload)}
/>
```

## RAG answer with citations

Use sources and citation chips when generated text needs visible provenance.

<RagAnswerRecipePreview />

```tsx
<SourcesBlock
  sources={[
    { id: 'brief', title: 'Product brief', url: '/brief' },
    { id: 'api', title: 'Runtime API', url: '/api' },
  ]}
/>
```

## Runtime adapter

Use the normalized prompt-input message when connecting to chat SDKs, Responses
API calls or custom agent runtimes.

<RuntimeAdapterPreview />

```tsx
const message = createPromptInputMessage(payload, {
  metadata: { product: 'agent-console' },
});

sendMessage(toAISDKSendMessageInput(message));
client.responses.create(toOpenAIResponsesInput(message));
```

## Verification panel

Terminal and test result blocks should sit beside the agent surface instead of
being hidden in logs.

```tsx
<TerminalBlock command="npm run release:check" status="running" />
<TestResultsBlock
  results={[
    { id: 'e2e', name: 'Playwright e2e', status: 'passed' },
    { id: 'docs', name: 'Docs build', status: 'passed' },
  ]}
/>
```
