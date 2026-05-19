---
layout: home

hero:
  name: React Tapable Editor
  text: AI Elements for Lexical
  tagline: Composable editor surfaces, AI blocks, runtime UI and portable schema for chat and agent products.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Browse Gallery
      link: /gallery

features:
  - title: Composer Surface
    details: A Lexical-powered prompt editor with mentions, tools, model selection, prompt history, attachments and structured submit payloads.
  - title: AI Blocks
    details: Artifacts, tool calls, images, sources, reasoning traces, task plans and runtime output as first-class UI.
  - title: Runtime Bridge
    details: Typed payloads, action events and portable schema v2 connect the UI to chat, agents, tools and storage.
---

## System preview

<HomeSystemPreview />

## Why this exists

Most editors were designed for documents. Most chat inputs were designed for
plain text. AI products need something in between: a small, composable editor
that can express user intent, referenced context, generated artifacts and agent
state without turning everything into prompt string glue.

React Tapable Editor is built on Lexical and exposes a set of AI Elements:

| Layer | Purpose |
| --- | --- |
| Surfaces | Product-level entry points such as composer, agent console and artifact workspace. |
| Primitives | Small controls such as mention picker, model selector, tool modes and attachment tray. |
| Blocks | Structured AI UI such as sources, reasoning, task plan, terminal output and test results. |
| Runtime | Payloads, schema helpers and action events for AI systems. |

## Product shape

The ideal system is not a pile of components. It is a browsable registry of AI
Elements with live previews, copyable code and runtime contracts:

- Pick a complete surface when you need to ship quickly.
- Pull out primitives when your product already owns the layout.
- Render blocks when the AI runtime produces sources, plans, tools or logs.
- Keep submit payloads typed so storage, agents and adapters stay predictable.

## Install

```bash
npm install react-tapable-editor
```

```tsx
import {
  AIElementsComposer,
  AIElementsCatalog,
  AIElementsGallery,
  AIElementsStats,
  AIElementsSystemMap,
  AIElementsWorkflow,
} from 'react-tapable-editor';
import 'react-tapable-editor/style.css';

export function App() {
  return (
    <>
      <AIElementsStats />
      <AIElementsGallery />
      <AIElementsSystemMap />
      <AIElementsCatalog />
      <AIElementsWorkflow />
      <AIElementsComposer onSubmit={payload => console.log(payload)} />
    </>
  );
}
```

## Mental model

The editor is not the whole product. It is the place where chat, context,
documents, artifacts and agents meet. Each component is designed to be useful on
its own and stronger when connected through the shared payload contract.
