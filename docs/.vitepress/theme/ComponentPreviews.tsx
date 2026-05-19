import React, { Component, ReactNode, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  AIElementsAgentConsole,
  AIElementsCatalog,
  AIElementsComposer,
  AIElementsGallery,
  AIElementsStats,
  AIElementsSystemMap,
  AIElementsWorkflow,
  AttachmentTray,
  CitationChip,
  FileDropzone,
  FileTreeBlock,
  FileUploadButton,
  ImageInsertPanel,
  MentionPicker,
  PayloadInspector,
  ReasoningBlock,
  SourcesBlock,
  TaskPlanBlock,
  TerminalBlock,
  TestResultsBlock,
  aiElementsMentionSuggestions,
  createPromptInputMessage,
  toAISDKSendMessageInput,
  toOpenAIResponsesInput,
} from '../../../src';
import type {
  AttachmentItem,
  PromptInputPayload,
} from '../../../src';

const emptyLexical = {
  root: {
    children: [],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as PromptInputPayload['lexical'];

const emptyPortable = {
  version: 2,
  root: { id: 'root', type: 'root', children: [] },
} as PromptInputPayload['portable'];

function samplePayload(partial: Partial<PromptInputPayload>): PromptInputPayload {
  return {
    text: '',
    lexical: emptyLexical,
    portable: emptyPortable,
    parts: [],
    context: [],
    attachments: [],
    toolMode: 'chat',
    ...partial,
  };
}

class PreviewBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="docs-preview-error">
          <strong>Preview failed</strong>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function defineReactPreview(name: string, Demo: () => ReactNode, source: string) {
  return defineComponent({
    name,
    setup() {
      const host = ref<HTMLElement | null>(null);
      const activeTab = ref<'preview' | 'code'>('preview');
      let root: Root | null = null;

      onMounted(() => {
        if (!host.value) return;
        root = createRoot(host.value);
        root.render(
          <PreviewBoundary>
            <Demo />
          </PreviewBoundary>
        );
      });

      onBeforeUnmount(() => {
        root?.unmount();
        root = null;
      });

      return () =>
        h('div', { class: 'docs-react-preview' }, [
          h('div', { class: 'docs-preview-tabs', role: 'tablist' }, [
            h(
              'button',
              {
                'aria-selected': activeTab.value === 'preview',
                class: activeTab.value === 'preview' ? 'is-active' : '',
                role: 'tab',
                type: 'button',
                onClick: () => {
                  activeTab.value = 'preview';
                },
              },
              'Preview'
            ),
            h(
              'button',
              {
                'aria-selected': activeTab.value === 'code',
                class: activeTab.value === 'code' ? 'is-active' : '',
                role: 'tab',
                type: 'button',
                onClick: () => {
                  activeTab.value = 'code';
                },
              },
              'Code'
            ),
          ]),
          h(
            'div',
            {
              class: 'docs-preview-panel',
              role: 'tabpanel',
              style: { display: activeTab.value === 'preview' ? 'block' : 'none' },
            },
            [h('div', { class: 'docs-react-preview-host', ref: host })]
          ),
          h(
            'div',
            {
              class: 'docs-preview-panel docs-preview-code',
              role: 'tabpanel',
              style: { display: activeTab.value === 'code' ? 'block' : 'none' },
            },
            [h('pre', [h('code', source.trim())])]
          ),
        ]);
    },
  });
}

function ComposerDemo() {
  const [payload, setPayload] = useState<PromptInputPayload | null>(null);

  return (
    <div className="docs-preview-stack">
      <AIElementsComposer
        title="Agent workspace"
        description="Compose with mentions, context, models and structured payloads."
        context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
        attachments={[
          { id: 'brief', name: 'editor-brief.md', type: 'text/markdown' },
        ]}
        emptySubmitPolicy="allow"
        onChange={setPayload}
        onSubmit={setPayload}
      />
      <PayloadInspector payload={payload} />
    </div>
  );
}

function CatalogDemo() {
  return (
    <div className="docs-preview-stack">
      <AIElementsStats />
      <AIElementsGallery />
      <AIElementsCatalog />
      <AIElementsSystemMap />
      <AIElementsWorkflow />
    </div>
  );
}

function GalleryDemo() {
  return <AIElementsGallery />;
}

function HomeSystemDemo() {
  return (
    <div className="docs-preview-stack">
      <AIElementsStats />
      <AIElementsWorkflow />
      <AIElementsComposer
        title="Agent workspace"
        description="A complete surface for prompt intent, context, tools and runtime payloads."
        context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
        attachments={[
          { id: 'brief', name: 'system-brief.md', type: 'text/markdown' },
        ]}
        emptySubmitPolicy="allow"
      />
    </div>
  );
}

function MentionPickerDemo() {
  const [selected, setSelected] = useState(aiElementsMentionSuggestions[0]);

  return (
    <div className="docs-preview-grid">
      <MentionPicker
        items={aiElementsMentionSuggestions}
        onSelect={item => setSelected(item)}
      />
      <PayloadInspector
        payload={samplePayload({
          text: selected ? `Selected ${selected.label}` : '',
          parts: selected
            ? [
                {
                  id: selected.id,
                  kind: selected.kind === 'action' ? 'tool' : 'context',
                  label: selected.label,
                  meta: { ...selected.meta, mentionKind: selected.kind },
                },
              ]
            : [],
        })}
      />
    </div>
  );
}

function AttachmentTrayDemo() {
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    { id: 'brief', name: 'brief.md', type: 'text/markdown' },
    { id: 'screen', name: 'screenshot.png', type: 'image/png' },
    { id: 'trace', name: 'agent-trace.json', type: 'application/json' },
  ]);

  return (
    <AttachmentTray
      attachments={attachments}
      onRemove={id => setAttachments(items => items.filter(item => item.id !== id))}
    />
  );
}

function MediaInsertDemo() {
  const [files, setFiles] = useState<string[]>([]);
  const [image, setImage] = useState<unknown>(null);

  return (
    <div className="docs-preview-grid">
      <div className="docs-preview-stack">
        <FileUploadButton
          accept="image/*,.md,.txt,.pdf"
          label="Attach files"
          onFiles={items => setFiles(items.map(item => item.name))}
        />
        <FileDropzone
          label="Drop context files"
          acceptLabel="Images, markdown, text and documents"
          onFiles={items => setFiles(items.map(item => item.name))}
        />
        <ImageInsertPanel onInsert={setImage} />
      </div>
      <PayloadInspector
        payload={samplePayload({
          text: 'Media insert preview',
          parts: [],
          attachments: files.map(name => ({ id: name, name })),
          lexical: image ? ({ image } as PromptInputPayload['lexical']) : emptyLexical,
        })}
      />
    </div>
  );
}

function SourcesCitationsDemo() {
  return (
    <div className="docs-preview-stack">
      <SourcesBlock
        sources={[
          {
            id: 'brief',
            title: 'Product brief',
            description: 'Requirements and user goals for the composer.',
            url: '/docs/product-brief',
          },
          {
            id: 'api',
            title: 'API Reference',
            description: 'Typed props, payload shape and imperative handles.',
            url: '/api',
          },
        ]}
      />
      <p className="docs-preview-sentence">
        The generated answer cites product context <CitationChip label="[1]" sourceId="brief" /> and
        API contracts <CitationChip label="[2]" sourceId="api" />.
      </p>
    </div>
  );
}

function ReasoningDemo() {
  return (
    <ReasoningBlock
      steps={[
        'Read selected files and prompt context.',
        'Choose whether the task needs a direct answer or an agent run.',
        'Return visible summary steps without exposing hidden chain-of-thought.',
      ]}
    />
  );
}

function TaskPlanDemo() {
  return (
    <TaskPlanBlock
      tasks={[
        { id: 'read', title: 'Read selected files', status: 'done' },
        { id: 'implement', title: 'Implement component previews', status: 'doing' },
        { id: 'verify', title: 'Run docs and release checks', status: 'todo' },
        { id: 'ship', title: 'Publish updated docs', status: 'blocked' },
      ]}
    />
  );
}

function RuntimeOutputDemo() {
  return (
    <div className="docs-preview-stack">
      <TerminalBlock
        command="npm run release:check"
        output={'build ok\ne2e ok\ndocs ok\nwiki ok'}
        status="success"
      />
      <TestResultsBlock
        results={[
          {
            id: 'payload',
            name: 'submits structured payload',
            status: 'passed',
            duration: '1.1s',
          },
          {
            id: 'docs',
            name: 'docs build',
            status: 'passed',
            duration: '2.0s',
          },
          {
            id: 'visual',
            name: 'visual regression',
            status: 'skipped',
          },
        ]}
      />
    </div>
  );
}

function PayloadInspectorDemo() {
  return (
    <PayloadInspector
      payload={samplePayload({
        text: 'Summarize this repository and draft the next implementation step.',
        parts: [
          {
            id: 'file-editor',
            kind: 'context',
            label: 'src/lexical/LexicalTapableEditor.tsx',
            meta: { mentionKind: 'file' },
          },
        ],
        attachments: [
          { id: 'brief', name: 'editor-brief.md', type: 'text/markdown' },
        ],
        toolMode: 'agent',
        model: { id: 'reasoning', label: 'Reasoning', provider: 'AI Elements' },
      })}
    />
  );
}

function AgentConsoleDemo() {
  return (
    <AIElementsAgentConsole
      context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
      attachments={[{ id: 'brief', name: 'agent-brief.md', type: 'text/markdown' }]}
      emptySubmitPolicy="allow"
    />
  );
}

function ChatComposerRecipeDemo() {
  const [payload, setPayload] = useState<PromptInputPayload | null>(null);

  return (
    <div className="docs-preview-stack">
      <AIElementsComposer
        title="Ask anything"
        description="A compact chat composer with structured payload output."
        toolModes={[{ label: 'Chat', value: 'chat' }]}
        emptySubmitPolicy="allow"
        onChange={setPayload}
        onSubmit={setPayload}
      />
      <PayloadInspector payload={payload} />
    </div>
  );
}

function RagAnswerRecipeDemo() {
  return (
    <div className="docs-preview-grid">
      <SourcesBlock
        sources={[
          {
            id: 'brief',
            title: 'Product brief',
            description: 'The requested outcome, constraints and design goals.',
            url: '/brief',
          },
          {
            id: 'api',
            title: 'Runtime API',
            description: 'Payload and adapter contract for the AI runtime.',
            url: '/api',
          },
        ]}
      />
      <p className="docs-preview-sentence">
        The response should cite the product brief <CitationChip label="[1]" sourceId="brief" /> and
        the runtime API <CitationChip label="[2]" sourceId="api" /> before proposing changes.
      </p>
    </div>
  );
}

function RuntimeAdapterDemo() {
  const payload = samplePayload({
    text: 'Use the selected files and run an implementation agent.',
    parts: [
      {
        id: 'src',
        kind: 'context',
        label: 'src/',
        meta: { mentionKind: 'folder' },
      },
      {
        id: 'fix',
        kind: 'tool',
        label: 'Fix failing tests',
        meta: { tool: 'test-fixer' },
      },
    ],
    attachments: [
      {
        id: 'trace',
        name: 'agent-trace.json',
        type: 'application/json',
        url: '/agent-trace.json',
      },
    ],
    toolMode: 'agent',
    model: { id: 'reasoning', label: 'Reasoning', provider: 'AI Elements' },
  });
  const message = createPromptInputMessage(payload, {
    id: 'msg-1',
    metadata: { product: 'docs-preview' },
  });

  return (
    <div className="docs-preview-grid">
      <PayloadInspector payload={payload} />
      <div className="docs-preview-stack">
        <TerminalBlock
          command="toAISDKSendMessageInput(message)"
          output={JSON.stringify(toAISDKSendMessageInput(message), null, 2)}
          status="success"
        />
        <TerminalBlock
          command="toOpenAIResponsesInput(message)"
          output={JSON.stringify(toOpenAIResponsesInput(message), null, 2)}
          status="success"
        />
      </div>
    </div>
  );
}

function BlocksDemo() {
  return (
    <div className="docs-preview-grid">
      <FileTreeBlock
        items={[
          { id: 'src', name: 'src', kind: 'folder' },
          { id: 'elements', name: 'elements', kind: 'folder', depth: 1 },
          { id: 'composer', name: 'AIElementsComposer.tsx', kind: 'file', depth: 2 },
          { id: 'docs', name: 'docs', kind: 'folder' },
          { id: 'api', name: 'api.md', kind: 'file', depth: 1 },
        ]}
      />
      <TaskPlanDemo />
    </div>
  );
}

const catalogSource = `
<div className="docs-preview-stack">
  <AIElementsStats />
  <AIElementsGallery />
  <AIElementsCatalog />
  <AIElementsSystemMap />
  <AIElementsWorkflow />
</div>
`;

const gallerySource = `
<AIElementsGallery />
`;

const homeSystemSource = `
<div className="docs-preview-stack">
  <AIElementsStats />
  <AIElementsWorkflow />
  <AIElementsComposer
    title="Agent workspace"
    description="A complete surface for prompt intent, context, tools and runtime payloads."
    context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
    attachments={[{ id: 'brief', name: 'system-brief.md', type: 'text/markdown' }]}
    emptySubmitPolicy="allow"
  />
</div>
`;

const composerSource = `
const [payload, setPayload] = useState<PromptInputPayload | null>(null);

<div className="docs-preview-stack">
  <AIElementsComposer
    title="Agent workspace"
    description="Compose with mentions, context, models and structured payloads."
    context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
    attachments={[{ id: 'brief', name: 'editor-brief.md', type: 'text/markdown' }]}
    emptySubmitPolicy="allow"
    onChange={setPayload}
    onSubmit={setPayload}
  />
  <PayloadInspector payload={payload} />
</div>
`;

const mentionPickerSource = `
const [selected, setSelected] = useState(aiElementsMentionSuggestions[0]);

<div className="docs-preview-grid">
  <MentionPicker
    items={aiElementsMentionSuggestions}
    onSelect={item => setSelected(item)}
  />
  <PayloadInspector payload={payloadFromSelectedMention(selected)} />
</div>
`;

const attachmentTraySource = `
const [attachments, setAttachments] = useState([
  { id: 'brief', name: 'brief.md', type: 'text/markdown' },
  { id: 'screen', name: 'screenshot.png', type: 'image/png' },
]);

<AttachmentTray
  attachments={attachments}
  onRemove={id => setAttachments(items => items.filter(item => item.id !== id))}
/>
`;

const mediaInsertSource = `
const [files, setFiles] = useState<string[]>([]);
const [image, setImage] = useState(null);

<div className="docs-preview-grid">
  <div className="docs-preview-stack">
    <FileUploadButton
      accept="image/*,.md,.txt,.pdf"
      label="Attach files"
      onFiles={items => setFiles(items.map(item => item.name))}
    />
    <FileDropzone
      label="Drop context files"
      acceptLabel="Images, markdown, text and documents"
      onFiles={items => setFiles(items.map(item => item.name))}
    />
    <ImageInsertPanel onInsert={setImage} />
  </div>
  <PayloadInspector payload={payloadFromMedia(files, image)} />
</div>
`;

const sourcesCitationsSource = `
<div className="docs-preview-stack">
  <SourcesBlock
    sources={[
      {
        id: 'brief',
        title: 'Product brief',
        description: 'Requirements and user goals for the composer.',
        url: '/docs/product-brief',
      },
      {
        id: 'api',
        title: 'API Reference',
        description: 'Typed props, payload shape and imperative handles.',
        url: '/api',
      },
    ]}
  />
  <p>
    The generated answer cites product context <CitationChip label="[1]" sourceId="brief" />
    and API contracts <CitationChip label="[2]" sourceId="api" />.
  </p>
</div>
`;

const reasoningSource = `
<ReasoningBlock
  steps={[
    'Read selected files and prompt context.',
    'Choose whether the task needs a direct answer or an agent run.',
    'Return visible summary steps without exposing hidden chain-of-thought.',
  ]}
/>
`;

const taskPlanSource = `
<TaskPlanBlock
  tasks={[
    { id: 'read', title: 'Read selected files', status: 'done' },
    { id: 'implement', title: 'Implement component previews', status: 'doing' },
    { id: 'verify', title: 'Run docs and release checks', status: 'todo' },
    { id: 'ship', title: 'Publish updated docs', status: 'blocked' },
  ]}
/>
`;

const runtimeOutputSource = `
<div className="docs-preview-stack">
  <TerminalBlock
    command="npm run release:check"
    output={'build ok\\ne2e ok\\ndocs ok\\nwiki ok'}
    status="success"
  />
  <TestResultsBlock
    results={[
      { id: 'payload', name: 'submits structured payload', status: 'passed', duration: '1.1s' },
      { id: 'docs', name: 'docs build', status: 'passed', duration: '2.0s' },
      { id: 'visual', name: 'visual regression', status: 'skipped' },
    ]}
  />
</div>
`;

const payloadInspectorSource = `
<PayloadInspector
  payload={{
    text: 'Summarize this repository and draft the next implementation step.',
    parts: [
      {
        id: 'file-editor',
        kind: 'context',
        label: 'src/lexical/LexicalTapableEditor.tsx',
        meta: { mentionKind: 'file' },
      },
    ],
    attachments: [{ id: 'brief', name: 'editor-brief.md', type: 'text/markdown' }],
    toolMode: 'agent',
    model: { id: 'reasoning', label: 'Reasoning', provider: 'AI Elements' },
  }}
/>
`;

const agentConsoleSource = `
<AIElementsAgentConsole
  context={[{ id: 'repo', label: 'react-tapable-editor', type: 'repo' }]}
  attachments={[{ id: 'brief', name: 'agent-brief.md', type: 'text/markdown' }]}
  emptySubmitPolicy="allow"
/>
`;

const chatComposerRecipeSource = `
const [payload, setPayload] = useState<PromptInputPayload | null>(null);

<div className="docs-preview-stack">
  <AIElementsComposer
    title="Ask anything"
    description="A compact chat composer with structured payload output."
    toolModes={[{ label: 'Chat', value: 'chat' }]}
    emptySubmitPolicy="allow"
    onChange={setPayload}
    onSubmit={setPayload}
  />
  <PayloadInspector payload={payload} />
</div>
`;

const ragAnswerRecipeSource = `
<div className="docs-preview-grid">
  <SourcesBlock
    sources={[
      { id: 'brief', title: 'Product brief', url: '/brief' },
      { id: 'api', title: 'Runtime API', url: '/api' },
    ]}
  />
  <p>
    The response should cite the product brief <CitationChip label="[1]" sourceId="brief" />
    and the runtime API <CitationChip label="[2]" sourceId="api" />.
  </p>
</div>
`;

const runtimeAdapterSource = `
const message = createPromptInputMessage(payload, {
  id: 'msg-1',
  metadata: { product: 'docs-preview' },
});

toAISDKSendMessageInput(message);
toOpenAIResponsesInput(message);
`;

const blocksSource = `
<div className="docs-preview-grid">
  <FileTreeBlock
    items={[
      { id: 'src', name: 'src', kind: 'folder' },
      { id: 'elements', name: 'elements', kind: 'folder', depth: 1 },
      { id: 'composer', name: 'AIElementsComposer.tsx', kind: 'file', depth: 2 },
    ]}
  />
  <TaskPlanBlock
    tasks={[
      { id: 'read', title: 'Read selected files', status: 'done' },
      { id: 'implement', title: 'Implement component previews', status: 'doing' },
    ]}
  />
</div>
`;

export const ComponentCatalogPreview = defineReactPreview(
  'ComponentCatalogPreview',
  CatalogDemo,
  catalogSource
);
export const AIElementsGalleryPreview = defineReactPreview(
  'AIElementsGalleryPreview',
  GalleryDemo,
  gallerySource
);
export const HomeSystemPreview = defineReactPreview(
  'HomeSystemPreview',
  HomeSystemDemo,
  homeSystemSource
);
export const ComposerPreview = defineReactPreview(
  'ComposerPreview',
  ComposerDemo,
  composerSource
);
export const AgentConsolePreview = defineReactPreview(
  'AgentConsolePreview',
  AgentConsoleDemo,
  agentConsoleSource
);
export const ChatComposerRecipePreview = defineReactPreview(
  'ChatComposerRecipePreview',
  ChatComposerRecipeDemo,
  chatComposerRecipeSource
);
export const RagAnswerRecipePreview = defineReactPreview(
  'RagAnswerRecipePreview',
  RagAnswerRecipeDemo,
  ragAnswerRecipeSource
);
export const RuntimeAdapterPreview = defineReactPreview(
  'RuntimeAdapterPreview',
  RuntimeAdapterDemo,
  runtimeAdapterSource
);
export const MentionPickerPreview = defineReactPreview(
  'MentionPickerPreview',
  MentionPickerDemo,
  mentionPickerSource
);
export const AttachmentTrayPreview = defineReactPreview(
  'AttachmentTrayPreview',
  AttachmentTrayDemo,
  attachmentTraySource
);
export const MediaInsertPreview = defineReactPreview(
  'MediaInsertPreview',
  MediaInsertDemo,
  mediaInsertSource
);
export const SourcesCitationsPreview = defineReactPreview(
  'SourcesCitationsPreview',
  SourcesCitationsDemo,
  sourcesCitationsSource
);
export const ReasoningPreview = defineReactPreview(
  'ReasoningPreview',
  ReasoningDemo,
  reasoningSource
);
export const TaskPlanPreview = defineReactPreview(
  'TaskPlanPreview',
  TaskPlanDemo,
  taskPlanSource
);
export const RuntimeOutputPreview = defineReactPreview(
  'RuntimeOutputPreview',
  RuntimeOutputDemo,
  runtimeOutputSource
);
export const PayloadInspectorPreview = defineReactPreview(
  'PayloadInspectorPreview',
  PayloadInspectorDemo,
  payloadInspectorSource
);
export const BlocksPreview = defineReactPreview(
  'BlocksPreview',
  BlocksDemo,
  blocksSource
);
