import { useState } from 'react';
import {
  AttachmentItem,
  MentionSuggestion,
  MentionSuggestionKind,
  ModelOption,
  PromptInputPayload,
  ToolMode,
  ToolModeOption,
} from '../lexical/types';
import { ImageAlignment, ImagePayload } from '../lexical/nodes/ImageNode';

const mentionKindLabels: Record<MentionSuggestionKind, string> = {
  action: 'Actions',
  context: 'Context',
  file: 'Files',
  folder: 'Folders',
  person: 'People',
};

function groupMentions(items: MentionSuggestion[]) {
  return items.reduce<Record<MentionSuggestionKind, MentionSuggestion[]>>(
    (groups, item) => {
      groups[item.kind].push(item);
      return groups;
    },
    {
      action: [],
      context: [],
      file: [],
      folder: [],
      person: [],
    }
  );
}

export function MentionPicker({
  items,
  onSelect,
  title = 'Mention Picker',
}: {
  items: MentionSuggestion[];
  onSelect?: (item: MentionSuggestion) => void;
  title?: string;
}) {
  const groups = groupMentions(items);

  return (
    <section className="rte-element-panel" aria-label={title}>
      <header>
        <span>Primitive</span>
        <h3>{title}</h3>
      </header>
      {(
        ['person', 'file', 'folder', 'context', 'action'] as MentionSuggestionKind[]
      ).map(kind =>
        groups[kind].length > 0 ? (
          <div className="rte-element-list" key={kind}>
            <strong>{mentionKindLabels[kind]}</strong>
            {groups[kind].map(item => (
              <button key={item.id} type="button" onClick={() => onSelect?.(item)}>
                <span>{item.label}</span>
                {item.description && <small>{item.description}</small>}
              </button>
            ))}
          </div>
        ) : null
      )}
    </section>
  );
}

export function AttachmentTray({
  attachments,
  onRemove,
}: {
  attachments: AttachmentItem[];
  onRemove?: (id: string) => void;
}) {
  return (
    <section className="rte-element-panel" aria-label="Attachment tray">
      <header>
        <span>Primitive</span>
        <h3>Attachment Tray</h3>
      </header>
      <div className="rte-attachment-tray">
        {attachments.map(item => (
          <article key={item.id}>
            <div>
              <strong>{item.name}</strong>
              {item.type && <small>{item.type}</small>}
            </div>
            {onRemove && (
              <button type="button" onClick={() => onRemove(item.id)}>
                Remove
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function FileUploadButton({
  accept,
  disabled,
  label = 'Attach files',
  multiple = true,
  onFiles,
}: {
  accept?: string;
  disabled?: boolean;
  label?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
}) {
  return (
    <label className="rte-file-upload-button" aria-disabled={disabled}>
      <span>{label}</span>
      <input
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        type="file"
        onChange={event => {
          onFiles?.(Array.from(event.target.files || []));
          event.target.value = '';
        }}
      />
    </label>
  );
}

export function FileDropzone({
  acceptLabel = 'Files, images, markdown, documents',
  disabled,
  label = 'Drop files here',
  onFiles,
}: {
  acceptLabel?: string;
  disabled?: boolean;
  label?: string;
  onFiles?: (files: File[]) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <section
      aria-disabled={disabled}
      aria-label="File dropzone"
      className="rte-file-dropzone"
      data-dragging={dragging}
      onDragEnter={event => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={event => {
        event.preventDefault();
      }}
      onDragLeave={event => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={event => {
        event.preventDefault();
        setDragging(false);
        if (disabled) return;
        onFiles?.(Array.from(event.dataTransfer.files || []));
      }}
    >
      <strong>{label}</strong>
      <small>{acceptLabel}</small>
    </section>
  );
}

export function ImageInsertPanel({
  defaultAlignment = 'center',
  defaultWidth = '100%',
  idPrefix = 'image',
  onInsert,
}: {
  defaultAlignment?: ImageAlignment;
  defaultWidth?: string;
  idPrefix?: string;
  onInsert?: (payload: ImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [width, setWidth] = useState(defaultWidth);
  const [alignment, setAlignment] = useState<ImageAlignment>(defaultAlignment);

  return (
    <section className="rte-element-panel rte-image-insert-panel" aria-label="Image insert">
      <header>
        <span>Primitive</span>
        <h3>Image Insert</h3>
      </header>
      <label>
        <span>Image URL</span>
        <input
          placeholder="https://..."
          value={src}
          onChange={event => setSrc(event.target.value)}
        />
      </label>
      <div className="rte-image-insert-grid">
        <label>
          <span>Alt</span>
          <input
            placeholder="Describe the image"
            value={alt}
            onChange={event => setAlt(event.target.value)}
          />
        </label>
        <label>
          <span>Width</span>
          <input value={width} onChange={event => setWidth(event.target.value)} />
        </label>
      </div>
      <label>
        <span>Caption</span>
        <input
          placeholder="Optional caption"
          value={caption}
          onChange={event => setCaption(event.target.value)}
        />
      </label>
      <div className="rte-image-insert-grid">
        <label>
          <span>Alignment</span>
          <select
            value={alignment}
            onChange={event => setAlignment(event.target.value as ImageAlignment)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="full">Full</option>
          </select>
        </label>
        <button
          type="button"
          disabled={!src.trim()}
          onClick={() => {
            const payload: ImagePayload = {
              id: `${idPrefix}-${Date.now()}`,
              src: src.trim(),
              alt: alt.trim() || 'Image',
              caption: caption.trim() || undefined,
              width: width.trim() || '100%',
              alignment,
            };
            onInsert?.(payload);
          }}
        >
          Insert image
        </button>
      </div>
    </section>
  );
}

export function ModelSelector({
  models,
  value,
  onChange,
}: {
  models: ModelOption[];
  value?: string;
  onChange?: (model: ModelOption | undefined) => void;
}) {
  return (
    <label className="rte-element-field">
      <span>Model</span>
      <select
        value={value || models[0]?.id || ''}
        onChange={event => onChange?.(models.find(model => model.id === event.target.value))}
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.provider ? `${model.provider} / ` : ''}
            {model.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToolModeTabs({
  modes,
  value,
  onChange,
}: {
  modes: ToolModeOption[];
  value: ToolMode;
  onChange?: (mode: ToolMode) => void;
}) {
  return (
    <div className="rte-element-tabs" aria-label="Tool mode tabs">
      {modes.map(mode => (
        <button
          aria-pressed={mode.value === value}
          key={mode.value}
          type="button"
          onClick={() => onChange?.(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

export function PromptHistoryMenu({
  items,
  onSelect,
}: {
  items: string[];
  onSelect?: (prompt: string) => void;
}) {
  return (
    <section className="rte-element-panel" aria-label="Prompt history">
      <header>
        <span>Primitive</span>
        <h3>Prompt History</h3>
      </header>
      <div className="rte-element-list">
        {items.map(item => (
          <button key={item} type="button" onClick={() => onSelect?.(item)}>
            <span>{item}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function PayloadInspector({
  payload,
}: {
  payload: PromptInputPayload | null;
}) {
  return (
    <section className="rte-element-panel rte-payload-inspector" aria-label="Payload inspector">
      <header>
        <span>Debug</span>
        <h3>Payload Inspector</h3>
      </header>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
    </section>
  );
}

export interface SourceItem {
  id: string;
  title: string;
  url?: string;
  description?: string;
}

export function SourcesBlock({ sources }: { sources: SourceItem[] }) {
  return (
    <section className="rte-element-panel" aria-label="Sources">
      <header>
        <span>Block</span>
        <h3>Sources</h3>
      </header>
      <div className="rte-source-list">
        {sources.map(source => (
          <article key={source.id}>
            <strong>{source.title}</strong>
            {source.description && <p>{source.description}</p>}
            {source.url && <small>{source.url}</small>}
          </article>
        ))}
      </div>
    </section>
  );
}

export function CitationChip({
  label,
  sourceId,
}: {
  label: string;
  sourceId?: string;
}) {
  return (
    <span className="rte-citation-chip" title={sourceId}>
      {label}
    </span>
  );
}

export function ReasoningBlock({
  steps,
  title = 'Reasoning',
}: {
  steps: string[];
  title?: string;
}) {
  return (
    <section className="rte-element-panel" aria-label={title}>
      <header>
        <span>Block</span>
        <h3>{title}</h3>
      </header>
      <ol className="rte-reasoning-list">
        {steps.map((step, index) => (
          <li key={`${step}-${index}`}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

export interface TaskPlanItem {
  id: string;
  title: string;
  status?: 'todo' | 'doing' | 'done' | 'blocked';
}

export function TaskPlanBlock({ tasks }: { tasks: TaskPlanItem[] }) {
  return (
    <section className="rte-element-panel" aria-label="Task plan">
      <header>
        <span>Block</span>
        <h3>Task Plan</h3>
      </header>
      <div className="rte-task-plan">
        {tasks.map(task => (
          <article key={task.id}>
            <span data-status={task.status || 'todo'}>{task.status || 'todo'}</span>
            <strong>{task.title}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export interface FileTreeItem {
  id: string;
  name: string;
  kind: 'file' | 'folder';
  depth?: number;
}

export function FileTreeBlock({ items }: { items: FileTreeItem[] }) {
  return (
    <section className="rte-element-panel" aria-label="File tree">
      <header>
        <span>Block</span>
        <h3>File Tree</h3>
      </header>
      <div className="rte-file-tree">
        {items.map(item => (
          <div key={item.id} style={{ paddingLeft: `${(item.depth || 0) * 14}px` }}>
            <span>{item.kind === 'folder' ? 'dir' : 'file'}</span>
            <strong>{item.name}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TerminalBlock({
  command,
  output,
  status = 'idle',
}: {
  command: string;
  output?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
}) {
  return (
    <section className="rte-element-panel rte-terminal-block" aria-label="Terminal">
      <header>
        <span>{status}</span>
        <h3>{command}</h3>
      </header>
      {output && <pre>{output}</pre>}
    </section>
  );
}

export interface TestResultItem {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration?: string;
}

export function TestResultsBlock({ results }: { results: TestResultItem[] }) {
  return (
    <section className="rte-element-panel" aria-label="Test results">
      <header>
        <span>Block</span>
        <h3>Test Results</h3>
      </header>
      <div className="rte-test-results">
        {results.map(result => (
          <article key={result.id}>
            <span data-status={result.status}>{result.status}</span>
            <strong>{result.name}</strong>
            {result.duration && <small>{result.duration}</small>}
          </article>
        ))}
      </div>
    </section>
  );
}
