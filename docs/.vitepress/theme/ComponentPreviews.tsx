import React, { Component, ReactNode, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  AIElementsCatalog,
  AIElementsComposer,
  AIElementsSystemMap,
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

function defineReactPreview(name: string, Demo: () => ReactNode) {
  return defineComponent({
    name,
    setup() {
      const host = ref<HTMLElement | null>(null);
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
          h('div', { class: 'docs-react-preview-host', ref: host }),
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
      <AIElementsCatalog />
      <AIElementsSystemMap />
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

export const ComponentCatalogPreview = defineReactPreview(
  'ComponentCatalogPreview',
  CatalogDemo
);
export const ComposerPreview = defineReactPreview('ComposerPreview', ComposerDemo);
export const MentionPickerPreview = defineReactPreview(
  'MentionPickerPreview',
  MentionPickerDemo
);
export const AttachmentTrayPreview = defineReactPreview(
  'AttachmentTrayPreview',
  AttachmentTrayDemo
);
export const MediaInsertPreview = defineReactPreview(
  'MediaInsertPreview',
  MediaInsertDemo
);
export const SourcesCitationsPreview = defineReactPreview(
  'SourcesCitationsPreview',
  SourcesCitationsDemo
);
export const ReasoningPreview = defineReactPreview('ReasoningPreview', ReasoningDemo);
export const TaskPlanPreview = defineReactPreview('TaskPlanPreview', TaskPlanDemo);
export const RuntimeOutputPreview = defineReactPreview(
  'RuntimeOutputPreview',
  RuntimeOutputDemo
);
export const PayloadInspectorPreview = defineReactPreview(
  'PayloadInspectorPreview',
  PayloadInspectorDemo
);
export const BlocksPreview = defineReactPreview('BlocksPreview', BlocksDemo);
