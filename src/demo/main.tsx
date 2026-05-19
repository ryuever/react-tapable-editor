import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import {
  AIBlockActionEvent,
  AIElementsCatalog,
  AIElementsComposer,
  AIElementsSystemMap,
  AttachmentTray,
  CitationChip,
  FileDropzone,
  FileTreeBlock,
  FileUploadButton,
  ImageInsertPanel,
  LexicalTapableEditorHandle,
  MentionPicker,
  ModelSelector,
  PayloadInspector,
  PromptInputPayload,
  PromptHistoryMenu,
  ReasoningBlock,
  SourcesBlock,
  TaskPlanBlock,
  TerminalBlock,
  TestResultsBlock,
  ToolMode,
  ToolModeTabs,
  aiElementsMentionSuggestions,
  aiElementsModels,
  aiElementsPromptHistory,
  aiElementsToolModes,
} from '../index';
import './styles.css';

const demoMentionSuggestions = [
  ...aiElementsMentionSuggestions,
  {
    id: 'context-selection',
    kind: 'context' as const,
    label: 'Current selection',
    description: 'Selected text or active workspace region',
  },
].filter(
  (item, index, suggestions) =>
    suggestions.findIndex(candidate => candidate.kind === item.kind) === index
);

function DemoApp() {
  const editorRef = useRef<LexicalTapableEditorHandle | null>(null);
  const [payload, setPayload] = useState<PromptInputPayload | null>(null);
  const [lastAction, setLastAction] = useState<AIBlockActionEvent | null>(null);
  const [lastToolId, setLastToolId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState([
    { id: 'diagram', name: 'architecture-map.png', type: 'image/png' },
    { id: 'notes', name: 'meeting-notes.md', type: 'text/markdown' },
  ]);
  const [primitiveModel, setPrimitiveModel] = useState(aiElementsModels[0]?.id);
  const [primitiveMode, setPrimitiveMode] = useState<ToolMode>('chat');

  const setEditorText = (text: string) => {
    editorRef.current?.getEditor()?.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(text));
      root.append(paragraph);
    });
  };

  const insertAgentRun = () => {
    const id = `agent-run-${Date.now()}`;
    setLastToolId(id);
    editorRef.current?.insertAIBlock({
      id,
      kind: 'tool-call',
      title: 'Agent run',
      status: 'pending',
      content: 'Waiting for approval.',
      runId: id,
      invocationId: `invoke-${id}`,
      logs: [{ level: 'info', message: 'Agent run inserted.' }],
      meta: { source: 'demo' },
    });
  };

  const insertDemoImage = () => {
    editorRef.current?.insertImage({
      id: 'demo-image',
      src: 'https://placehold.co/640x360/png',
      alt: 'Demo image',
      caption: 'Demo image',
      alignment: 'center',
      width: '320px',
    });
  };

  const updateDemoImage = () => {
    editorRef.current?.updateImage({
      id: 'demo-image',
      alignment: 'right',
      caption: 'Updated demo image',
      width: '240px',
    });
  };

  const markAgentRun = (status: 'running' | 'success' | 'error') => {
    if (!lastToolId) return;
    editorRef.current?.updateAIBlock({
      id: lastToolId,
      status,
      content:
        status === 'running'
          ? 'Agent is working...'
          : status === 'success'
            ? 'Agent completed successfully.'
            : 'Agent failed. Inspect logs.',
      output:
        status === 'success'
          ? JSON.stringify({ changedFiles: ['src/lexical'] }, null, 2)
          : undefined,
      appendLog: {
        level:
          status === 'success'
            ? 'success'
            : status === 'error'
              ? 'error'
              : 'info',
        message: `Agent marked ${status}.`,
      },
    });
  };

  const handleAIBlockAction = (event: AIBlockActionEvent) => {
    setLastAction(event);
    if (event.action === 'approve' || event.action === 'retry') {
      editorRef.current?.updateAIBlock({
        id: event.id,
        status: 'running',
        content: `${event.action} accepted. Agent is working...`,
        appendLog: { level: 'info', message: `${event.action} requested.` },
      });
    }
    if (event.action === 'reject') {
      editorRef.current?.updateAIBlock({
        id: event.id,
        status: 'error',
        content: 'Tool call rejected by user.',
        appendLog: { level: 'warning', message: 'Tool call rejected.' },
      });
    }
  };

  const loadChatComposer = () => {
    setEditorText('Summarize the migration plan and suggest the next step.');
    editorRef.current?.insertAIChip({
      id: 'repo',
      kind: 'context',
      label: 'react-tapable-editor',
      meta: { type: 'repo' },
    });
  };

  const loadAgentConsole = () => {
    setEditorText('Run an implementation agent for the selected backlog item.');
    insertAgentRun();
  };

  const loadArtifactEditor = () => {
    setEditorText('Review this generated spec and turn it into actionable tasks.');
    editorRef.current?.insertAIBlock({
      id: `artifact-spec-${Date.now()}`,
      kind: 'artifact',
      title: 'Generated product spec',
      status: 'success',
      content:
        '1. Provide a structured composer\n2. Preserve AI parts in payload\n3. Export portable schema',
      meta: { source: 'demo-artifact' },
    });
  };

  const loadImageWorkflow = () => {
    setEditorText('Use this screenshot as visual context for the next answer.');
    insertDemoImage();
  };

  const refreshPayload = () => {
    const currentPayload = editorRef.current?.getPayload();
    if (currentPayload) setPayload(currentPayload);
  };

  const attachPrimitiveFiles = (files: File[]) => {
    const nextFiles = files.map(file => ({
      id: `primitive-${file.name}-${file.lastModified}`,
      name: file.name,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
      value: { size: file.size },
    }));
    setMediaFiles(current => current.concat(nextFiles));
    nextFiles.forEach(file => {
      editorRef.current?.insertAIChip({
        id: file.id,
        kind: 'attachment',
        label: file.name,
        meta: { type: file.type, url: file.url },
      });
    });
  };

  return (
    <main className="demo-shell">
      <section className="demo-header">
        <h1>React Tapable Editor</h1>
        <p>AI-native playground for chat, agents, artifacts, media, and portable schema</p>
      </section>

      <section className="demo-use-cases" aria-label="Demo use cases">
        <article>
          <h2>Chat composer</h2>
          <p>Prompt text plus context chips and model selection.</p>
          <button type="button" onClick={loadChatComposer}>
            Load chat composer
          </button>
        </article>
        <article>
          <h2>Agent console</h2>
          <p>Tool-call blocks with approval, status, logs, output, and run ids.</p>
          <button type="button" onClick={loadAgentConsole}>
            Load agent console
          </button>
        </article>
        <article>
          <h2>Artifact editor</h2>
          <p>Structured AI output embedded as editable document blocks.</p>
          <button type="button" onClick={loadArtifactEditor}>
            Load artifact editor
          </button>
        </article>
        <article>
          <h2>Visual context</h2>
          <p>Image blocks with alignment, width, caption, and alt controls.</p>
          <button type="button" onClick={loadImageWorkflow}>
            Load image workflow
          </button>
        </article>
      </section>

      <AIElementsSystemMap />

      <AIElementsCatalog />

      <section className="demo-section-heading">
        <span>Component Market</span>
        <h2>Composable AI Elements</h2>
        <p>
          Each block below is exported from the package, styled with the same
          shadcn-minded system, and can be placed around or inside a Lexical AI
          workflow.
        </p>
      </section>

      <section className="rte-elements-gallery" aria-label="AI Elements primitives">
        <MentionPicker
          items={demoMentionSuggestions}
          onSelect={item => {
            editorRef.current?.insertAIChip({
              id: item.id,
              kind: 'context',
              label: item.label,
              meta: { mentionKind: item.kind },
            });
          }}
        />
        <AttachmentTray
          attachments={mediaFiles}
          onRemove={id => setMediaFiles(current => current.filter(file => file.id !== id))}
        />
        <section className="rte-element-panel" aria-label="File insert">
          <header>
            <span>Primitive</span>
            <h3>File Insert</h3>
          </header>
          <FileUploadButton onFiles={attachPrimitiveFiles} />
          <FileDropzone onFiles={attachPrimitiveFiles} />
        </section>
        <ImageInsertPanel
          onInsert={image => {
            editorRef.current?.insertImage(image);
            refreshPayload();
          }}
        />
        <section className="rte-element-panel" aria-label="Composer controls">
          <header>
            <span>Primitive</span>
            <h3>Composer Controls</h3>
          </header>
          <ModelSelector
            models={aiElementsModels}
            onChange={model => setPrimitiveModel(model?.id)}
            value={primitiveModel}
          />
          <ToolModeTabs
            modes={aiElementsToolModes}
            onChange={setPrimitiveMode}
            value={primitiveMode}
          />
        </section>
        <PromptHistoryMenu
          items={aiElementsPromptHistory}
          onSelect={setEditorText}
        />
        <SourcesBlock
          sources={[
            {
              id: 'lexical',
              title: 'Lexical editor state',
              description: 'Editor tree is the durable source for rich AI parts.',
              url: 'lexical.dev',
            },
            {
              id: 'portable',
              title: 'Portable schema v2',
              description: 'Stable interchange for chats, agents and docs.',
              url: 'codebase-wiki/reference/20260519-api-reference',
            },
          ]}
        />
        <section className="rte-element-panel" aria-label="Citation chips">
          <header>
            <span>Primitive</span>
            <h3>Citation Chips</h3>
          </header>
          <p className="rte-element-copy">
            Retrieval output can stay compact while preserving stable source ids.
          </p>
          <div className="rte-inline-chips">
            <CitationChip label="[1] Lexical state" sourceId="lexical" />
            <CitationChip label="[2] Portable schema" sourceId="portable" />
            <CitationChip label="[3] AI Elements" sourceId="ai-elements" />
          </div>
        </section>
        <ReasoningBlock
          steps={[
            'Read prompt and referenced context.',
            'Choose whether the answer is chat, artifact or agent work.',
            'Emit structured blocks and keep payload inspectable.',
          ]}
        />
        <TaskPlanBlock
          tasks={[
            { id: 'p1', status: 'done', title: 'Migrate core editor to Lexical' },
            { id: 'p2', status: 'doing', title: 'Ship AI Elements primitives' },
            { id: 'p3', status: 'todo', title: 'Bind blocks to runtime streams' },
          ]}
        />
        <FileTreeBlock
          items={[
            { id: 'src', kind: 'folder', name: 'src' },
            { id: 'elements', kind: 'folder', name: 'elements', depth: 1 },
            { id: 'primitives', kind: 'file', name: 'primitives.tsx', depth: 2 },
            { id: 'wiki', kind: 'folder', name: 'codebase-wiki', depth: 0 },
          ]}
        />
        <TerminalBlock
          command="npm run release:check"
          output={'build ok\ne2e ok\ndocs ok'}
          status="success"
        />
        <TestResultsBlock
          results={[
            { id: 'structured', name: 'structured payload', status: 'passed', duration: '1.2s' },
            { id: 'mentions', name: 'mention suggestions', status: 'passed', duration: '0.8s' },
            { id: 'docs', name: 'wiki build', status: 'passed', duration: '4.1s' },
          ]}
        />
        <PayloadInspector payload={payload} />
      </section>

      <AIElementsComposer
        ref={editorRef}
        autoFocus
        title="shadcn-style AI Composer"
        description="A reusable AI Elements preset with @ people/files/folders/actions, tools, models, prompt history and structured output."
        context={[
          { id: 'repo', label: 'react-tapable-editor', type: 'repo' },
          { id: 'roadmap', label: 'migration-roadmap', type: 'doc' },
        ]}
        attachments={[
          { id: 'brief', name: 'editor-brief.md', type: 'text/markdown' },
          { id: 'screenshot', name: 'layout.png', type: 'image/png' },
        ]}
        onAIBlockAction={handleAIBlockAction}
        onChange={setPayload}
        onModelChange={() => {
          const currentPayload = editorRef.current?.getPayload();
          if (currentPayload) setPayload(currentPayload);
        }}
        onSubmit={setPayload}
        placeholder="Compose a plan, ask an agent, or write a structured prompt..."
      />

      <section className="demo-actions">
        <button type="button" onClick={insertAgentRun}>
          Insert agent run
        </button>
        <button type="button" onClick={() => markAgentRun('running')}>
          Mark running
        </button>
        <button type="button" onClick={() => markAgentRun('success')}>
          Mark success
        </button>
        <button type="button" onClick={() => markAgentRun('error')}>
          Mark error
        </button>
        <button type="button" onClick={insertDemoImage}>
          Insert demo image
        </button>
        <button type="button" onClick={updateDemoImage}>
          Update demo image
        </button>
        <button type="button" onClick={refreshPayload}>
          Refresh payload
        </button>
      </section>

      <section className="demo-payload" data-testid="payload-preview">
        <h2>Payload Preview</h2>
        <pre data-testid="payload-json">{JSON.stringify(payload, null, 2)}</pre>
      </section>

      <section className="demo-payload" data-testid="last-action-preview">
        <h2>Last AI Block Action</h2>
        <pre data-testid="last-action-json">
          {JSON.stringify(lastAction, null, 2)}
        </pre>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<DemoApp />);
