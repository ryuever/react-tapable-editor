import { JSX, useMemo, useState } from 'react';
import {
  $getNodeByKey,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useAIBlockActionHandler } from '../AIBlockActionContext';

export type AIBlockKind = 'artifact' | 'tool-call';
export type AIBlockAction = 'approve' | 'reject' | 'retry' | 'inspect';
export type AIBlockLogLevel = 'info' | 'warning' | 'error' | 'success';

export type AIBlockStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'success'
  | 'error'
  | 'approval-required';

export interface AIBlockLog {
  id?: string;
  level?: AIBlockLogLevel;
  message: string;
  timestamp?: string;
  data?: unknown;
}

export interface AIBlockPayload {
  id: string;
  kind: AIBlockKind;
  title: string;
  actions?: AIBlockAction[];
  status?: AIBlockStatus;
  content?: string;
  invocationId?: string;
  logs?: AIBlockLog[];
  meta?: Record<string, unknown>;
  output?: string;
  runId?: string;
}

export interface UpdateAIBlockPayload {
  id: string;
  actions?: AIBlockAction[];
  appendLog?: AIBlockLog;
  status?: AIBlockStatus;
  content?: string;
  invocationId?: string;
  logs?: AIBlockLog[];
  output?: string;
  runId?: string;
  title?: string;
  meta?: Record<string, unknown>;
}

export type SerializedAIBlockNode = Spread<
  {
    id: string;
    kind: AIBlockKind;
    title: string;
    actions?: AIBlockAction[];
    status: AIBlockStatus;
    content?: string;
    invocationId?: string;
    logs?: AIBlockLog[];
    meta?: Record<string, unknown>;
    output?: string;
    runId?: string;
  },
  SerializedLexicalNode
>;

function defaultActionsFor(
  kind: AIBlockKind,
  status: AIBlockStatus
): AIBlockAction[] {
  if (kind !== 'tool-call') return [];
  if (status === 'approval-required') return ['approve', 'reject', 'inspect'];
  if (status === 'error') return ['retry', 'inspect'];
  return ['inspect'];
}

function actionLabel(action: AIBlockAction) {
  if (action === 'approve') return 'Approve';
  if (action === 'reject') return 'Reject';
  if (action === 'retry') return 'Retry';
  return 'Inspect';
}

function AIBlockView({
  actions,
  content,
  id,
  invocationId,
  kind,
  logs,
  meta,
  nodeKey,
  output,
  runId,
  status,
  title,
}: {
  actions: AIBlockAction[];
  content?: string;
  id: string;
  invocationId?: string;
  kind: AIBlockKind;
  logs: AIBlockLog[];
  meta: Record<string, unknown>;
  nodeKey: NodeKey;
  output?: string;
  runId?: string;
  status: AIBlockStatus;
  title: string;
}) {
  const [editor] = useLexicalComposerContext();
  const onAction = useAIBlockActionHandler();
  const [selected, setSelected] = useState(false);
  const serialized = useMemo(
    () => ({
      id,
      kind,
      title,
      actions,
      status,
      content,
      invocationId,
      logs,
      meta,
      output,
      runId,
      type: 'ai-block',
      version: 1,
    }),
    [
      actions,
      content,
      id,
      invocationId,
      kind,
      logs,
      meta,
      output,
      runId,
      status,
      title,
    ]
  );

  const withNode = (callback: (node: AIBlockNode) => void) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isAIBlockNode(node)) callback(node);
    });
  };

  const copyJSON = () => {
    const json = JSON.stringify(serialized, null, 2);
    void navigator.clipboard?.writeText(json);
  };

  const emitAction = (action: AIBlockAction) => {
    onAction?.({
      id,
      action,
      kind,
      status,
      title,
      invocationId,
      runId,
      meta,
    });
  };

  return (
    <section
      className={[
        'rte-ai-block',
        `rte-ai-block-${kind}`,
        selected ? 'rte-block-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      tabIndex={0}
      onBlur={() => setSelected(false)}
      onClick={() => setSelected(true)}
      onFocus={() => setSelected(true)}
    >
      <header className="rte-ai-block-header">
        <div className="rte-ai-block-heading">
          <span className="rte-ai-block-title">{title}</span>
          {(runId || invocationId) && (
            <span className="rte-ai-block-identifiers">
              {[runId, invocationId].filter(Boolean).join(' / ')}
            </span>
          )}
        </div>
        <span className={`rte-ai-block-status rte-ai-block-status-${status}`}>
          {status}
        </span>
      </header>
      {selected && (
        <div
          className="rte-block-toolbar"
          aria-label={`${title} block tools`}
          onMouseDown={event => event.preventDefault()}
        >
          <button type="button" onClick={() => withNode(node => node.remove())}>
            Delete
          </button>
          <button
            type="button"
            onClick={() =>
              withNode(node => {
                node.insertAfter(
                  $createAIBlockNode({
                    ...serialized,
                    id: `${id}-copy-${Date.now()}`,
                  })
                );
              })
            }
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() =>
              withNode(node => {
                const previous = node.getPreviousSibling();
                if (previous) previous.insertBefore(node);
              })
            }
          >
            Move up
          </button>
          <button
            type="button"
            onClick={() =>
              withNode(node => {
                const next = node.getNextSibling();
                if (next) next.insertAfter(node);
              })
            }
          >
            Move down
          </button>
          <button type="button" onClick={copyJSON}>
            Copy JSON
          </button>
        </div>
      )}
      {actions.length > 0 && (
        <div className="rte-ai-block-actions">
          {actions.map(action => (
            <button
              aria-label={`${actionLabel(action)} ${title}`}
              className={`rte-ai-block-action rte-ai-block-action-${action}`}
              key={action}
              type="button"
              onMouseDown={event => {
                event.preventDefault();
                event.stopPropagation();
                emitAction(action);
              }}
            >
              {actionLabel(action)}
            </button>
          ))}
        </div>
      )}
      {content && <pre className="rte-ai-block-content">{content}</pre>}
      {output && (
        <pre className="rte-ai-block-output" aria-label={`${title} output`}>
          {output}
        </pre>
      )}
      {logs.length > 0 && (
        <ol className="rte-ai-block-logs" aria-label={`${title} logs`}>
          {logs.map((log, index) => (
            <li
              className={`rte-ai-block-log rte-ai-block-log-${
                log.level || 'info'
              }`}
              key={log.id || `${log.message}-${index}`}
            >
              {log.timestamp && (
                <time className="rte-ai-block-log-time">{log.timestamp}</time>
              )}
              <span>{log.message}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export class AIBlockNode extends DecoratorNode<JSX.Element> {
  __actions: AIBlockAction[];

  __content: string;

  __id: string;

  __invocationId?: string;

  __kind: AIBlockKind;

  __logs: AIBlockLog[];

  __meta: Record<string, unknown>;

  __output: string;

  __runId?: string;

  __status: AIBlockStatus;

  __title: string;

  static getType(): string {
    return 'ai-block';
  }

  static clone(node: AIBlockNode): AIBlockNode {
    return new AIBlockNode(
      node.__id,
      node.__kind,
      node.__title,
      node.__status,
      node.__content,
      node.__meta,
      node.__actions,
      node.__logs,
      node.__output,
      node.__runId,
      node.__invocationId,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedAIBlockNode): AIBlockNode {
    return $createAIBlockNode({
      id: serializedNode.id,
      kind: serializedNode.kind,
      title: serializedNode.title,
      status: serializedNode.status,
      actions: serializedNode.actions,
      content: serializedNode.content,
      invocationId: serializedNode.invocationId,
      logs: serializedNode.logs,
      meta: serializedNode.meta,
      output: serializedNode.output,
      runId: serializedNode.runId,
    });
  }

  constructor(
    id: string,
    kind: AIBlockKind,
    title: string,
    status: AIBlockStatus = 'idle',
    content = '',
    meta: Record<string, unknown> = {},
    actions?: AIBlockAction[],
    logs: AIBlockLog[] = [],
    output = '',
    runId?: string,
    invocationId?: string,
    key?: NodeKey
  ) {
    super(key);
    this.__id = id;
    this.__kind = kind;
    this.__title = title;
    this.__status = status;
    this.__content = content;
    this.__meta = meta;
    this.__actions = actions || defaultActionsFor(kind, status);
    this.__logs = logs;
    this.__output = output;
    this.__runId = runId;
    this.__invocationId = invocationId;
  }

  exportJSON(): SerializedAIBlockNode {
    return {
      id: this.__id,
      kind: this.__kind,
      title: this.__title,
      actions: this.__actions,
      status: this.__status,
      content: this.__content,
      invocationId: this.__invocationId,
      logs: this.__logs,
      meta: this.__meta,
      output: this.__output,
      runId: this.__runId,
      type: 'ai-block',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('section');
    element.dataset.aiBlockKind = this.__kind;
    element.dataset.aiBlockId = this.__id;
    element.textContent = this.getTextContent();
    return { element };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('section');
    element.className = 'rte-ai-block-shell';
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <AIBlockView
        actions={this.__actions}
        content={this.__content}
        id={this.__id}
        invocationId={this.__invocationId}
        kind={this.__kind}
        logs={this.__logs}
        meta={this.__meta}
        nodeKey={this.__key}
        output={this.__output}
        runId={this.__runId}
        status={this.__status}
        title={this.__title}
      />
    );
  }

  getTextContent(): string {
    return [this.__title, this.__status, this.__content, this.__output]
      .filter(Boolean)
      .join('\n');
  }

  isInline(): boolean {
    return false;
  }

  update(payload: Omit<UpdateAIBlockPayload, 'id'>): void {
    const writable = this.getWritable();
    if (payload.title !== undefined) writable.__title = payload.title;
    if (payload.status !== undefined) writable.__status = payload.status;
    if (payload.actions !== undefined) writable.__actions = payload.actions;
    if (payload.status !== undefined && payload.actions === undefined) {
      writable.__actions = defaultActionsFor(writable.__kind, payload.status);
    }
    if (payload.content !== undefined) writable.__content = payload.content;
    if (payload.invocationId !== undefined) {
      writable.__invocationId = payload.invocationId;
    }
    if (payload.logs !== undefined) writable.__logs = payload.logs;
    if (payload.appendLog !== undefined) {
      writable.__logs = writable.__logs.concat(payload.appendLog);
    }
    if (payload.output !== undefined) writable.__output = payload.output;
    if (payload.runId !== undefined) writable.__runId = payload.runId;
    if (payload.meta !== undefined) {
      writable.__meta = {
        ...writable.__meta,
        ...payload.meta,
      };
    }
  }
}

export function $createAIBlockNode(payload: AIBlockPayload): AIBlockNode {
  return new AIBlockNode(
    payload.id,
    payload.kind,
    payload.title,
    payload.status || 'idle',
    payload.content || '',
    payload.meta || {},
    payload.actions,
    payload.logs || [],
    payload.output || '',
    payload.runId,
    payload.invocationId
  );
}

export function $isAIBlockNode(
  node: LexicalNode | null | undefined
): node is AIBlockNode {
  return node instanceof AIBlockNode;
}
