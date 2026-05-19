# Philosophy

React Tapable Editor follows a simple principle: AI editor UI should be made of
composable elements, not one sealed editor box.

## Design stance

The project is closer to a shadcn-minded AI element system than a traditional
rich text editor package. The goal is to give product teams a set of visible,
typed, copyable pieces that can be owned in their app: composer surfaces,
mention controls, runtime blocks, artifact nodes and payload adapters.

The editor is only one layer. The reusable asset is the system around it:
registry metadata, live previews, portable schema, runtime events and blocks
that make agent state visible.

## Composable

The composer, mention picker, sources block, task plan, terminal output and
payload inspector can be used independently. Product teams can place them in a
chat input, a side panel, an artifact workspace or an agent console.

## Structured

AI input is not only text. It can contain people, files, folders, actions,
attachments, images, tool calls and generated artifacts. These should remain
structured through the entire runtime path.

String prompts are still useful, but they are not enough for product UI. A file
mention, an attached screenshot, a selected model, a tool mode and a generated
artifact need separate identities so runtimes can route, store, inspect and
replay them.

## Runtime aware

Agent products need approval, retry, inspect, logs, output, run ids and test
results. These are product states, not decoration. The editor exposes events and
blocks for them.

The UI should show what the runtime is doing without forcing every product to
invent its own terminal, task list, source list and payload debugger.

## Type-first

The package exports types for suggestions, payloads, blocks, tool modes, models
and portable schema. Runtime adapters should be built with autocomplete, not
string parsing.

## Preview-first

Every meaningful element should be visible in the docs before it is copied into
an app. A component is not complete when it has props; it is complete when a
developer can see the state, inspect the code and understand where the payload
goes.

This is why the public docs favor live previews, code tabs, recipes and the
central registry over prose-only API descriptions.

## shadcn-minded

The components ship with restrained defaults, small radii, clear borders and
copyable structure. The goal is to give teams a strong starting point without
forcing a closed theme system.

The default visual language should feel like product infrastructure: neutral
colors, dense but readable layouts, explicit borders, compact controls and no
decorative styling that fights the host application.

## Registry-oriented

AI-era component systems need metadata, not only exports. React Tapable Editor
keeps the element catalog as data: category, maturity, import name, docs path,
source path and tags. That makes the system browsable by humans today and
searchable by AI agents later.

## Lexical as the kernel

Lexical gives the editor a modern node model, command system and React
integration. The AI layer uses that kernel to represent AI parts as document
state while keeping a portable schema for storage and runtime handoff.
