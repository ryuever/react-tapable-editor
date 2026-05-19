# Philosophy

React Tapable Editor follows a simple principle: AI editor UI should be made of
composable elements, not one sealed editor box.

## Composable

The composer, mention picker, sources block, task plan, terminal output and
payload inspector can be used independently. Product teams can place them in a
chat input, a side panel, an artifact workspace or an agent console.

## Structured

AI input is not only text. It can contain people, files, folders, actions,
attachments, images, tool calls and generated artifacts. These should remain
structured through the entire runtime path.

## Runtime aware

Agent products need approval, retry, inspect, logs, output, run ids and test
results. These are product states, not decoration. The editor exposes events and
blocks for them.

## Type-first

The package exports types for suggestions, payloads, blocks, tool modes, models
and portable schema. Runtime adapters should be built with autocomplete, not
string parsing.

## shadcn-minded

The components ship with restrained defaults, small radii, clear borders and
copyable structure. The goal is to give teams a strong starting point without
forcing a closed theme system.

## Lexical as the kernel

Lexical gives the editor a modern node model, command system and React
integration. The AI layer uses that kernel to represent AI parts as document
state while keeping a portable schema for storage and runtime handoff.
