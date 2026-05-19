import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import LexicalTapableEditor, {
  AIBlockActionEvent,
  LexicalTapableEditorHandle,
  PromptInputPayload,
} from '../index';
import './styles.css';

function DemoApp() {
  const editorRef = useRef<LexicalTapableEditorHandle | null>(null);
  const [payload, setPayload] = useState<PromptInputPayload | null>(null);
  const [lastAction, setLastAction] = useState<AIBlockActionEvent | null>(null);
  const [lastToolId, setLastToolId] = useState<string | null>(null);

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

      <LexicalTapableEditor
        ref={editorRef}
        autoFocus
        context={[
          { id: 'repo', label: 'react-tapable-editor', type: 'repo' },
          { id: 'roadmap', label: 'migration-roadmap', type: 'doc' },
        ]}
        attachments={[
          { id: 'brief', name: 'editor-brief.md', type: 'text/markdown' },
          { id: 'screenshot', name: 'layout.png', type: 'image/png' },
        ]}
        models={[
          { id: 'fast', label: 'Fast agent', provider: 'demo' },
          { id: 'reasoning', label: 'Reasoning agent', provider: 'demo' },
        ]}
        onAIBlockAction={handleAIBlockAction}
        onChange={setPayload}
        onModelChange={() => {
          const currentPayload = editorRef.current?.getPayload();
          if (currentPayload) setPayload(currentPayload);
        }}
        onSubmit={setPayload}
        placeholder="Compose a plan, ask an agent, or write a structured prompt..."
        promptHistory={[
          'Summarize this editor migration.',
          'Plan the next agent workflow.',
        ]}
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
