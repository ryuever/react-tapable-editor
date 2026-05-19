import { EditorState } from 'lexical';
import { PortableEditorDocument } from './portable';
import { LexicalEditor } from 'lexical';
import {
  AIBlockAction,
  AIBlockLog,
  AIBlockPayload,
  UpdateAIBlockPayload,
} from './nodes/AIBlockNode';
import { AIBlockActionEvent } from './AIBlockActionContext';
import { AIChipPayload } from './nodes/AIChipNode';
import { ImagePayload, UpdateImagePayload } from './nodes/ImageNode';
import type { PromptInputMessage, PromptInputStatus } from '../prompt-input/types';

export type ToolMode = 'chat' | 'agent' | 'search' | 'code';
export type EmptySubmitPolicy = 'allow' | 'allow-structured' | 'block';
export type MentionSuggestionKind =
  | 'person'
  | 'file'
  | 'folder'
  | 'context'
  | 'action';

export interface ContextItem {
  id: string;
  label: string;
  type?: string;
  value?: unknown;
}

export interface MentionSuggestion {
  id: string;
  label: string;
  kind: MentionSuggestionKind;
  description?: string;
  value?: unknown;
  meta?: Record<string, unknown>;
}

export interface AttachmentItem {
  id: string;
  name: string;
  type?: string;
  url?: string;
  value?: unknown;
}

export interface ToolModeOption {
  label: string;
  value: ToolMode;
}

export interface ModelOption {
  id: string;
  label: string;
  provider?: string;
  meta?: Record<string, unknown>;
}

export interface PromptInputPart {
  id: string;
  kind:
    | 'context'
    | 'attachment'
    | 'tool'
    | 'artifact'
    | 'tool-call'
    | 'image';
  label: string;
  actions?: AIBlockAction[];
  status?: string;
  content?: string;
  invocationId?: string;
  logs?: AIBlockLog[];
  output?: string;
  runId?: string;
  src?: string;
  meta?: Record<string, unknown>;
}

export interface PromptInputPayload {
  text: string;
  lexical: ReturnType<EditorState['toJSON']>;
  portable: PortableEditorDocument;
  parts: PromptInputPart[];
  context: ContextItem[];
  attachments: AttachmentItem[];
  toolMode: ToolMode;
  model?: ModelOption;
}

export interface LexicalTapableEditorProps {
  autoFocus?: boolean;
  className?: string;
  context?: ContextItem[];
  mentionSuggestions?: MentionSuggestion[];
  attachments?: AttachmentItem[];
  defaultToolMode?: ToolMode;
  toolModes?: ToolModeOption[];
  defaultModelId?: string;
  editable?: boolean;
  placeholder?: string;
  models?: ModelOption[];
  promptHistory?: string[];
  status?: PromptInputStatus;
  submitLabel?: string;
  emptySubmitPolicy?: EmptySubmitPolicy;
  onAttachmentUpload?: (file: File) => AttachmentItem | Promise<AttachmentItem>;
  onChange?: (payload: PromptInputPayload) => void;
  onAIBlockAction?: (event: AIBlockActionEvent) => void;
  onEmptySubmitBlocked?: (payload: PromptInputPayload) => void;
  onModelChange?: (model: ModelOption | undefined) => void;
  onPromptInputSubmit?: (message: PromptInputMessage) => void;
  onSubmit?: (payload: PromptInputPayload) => void;
  onStop?: () => void;
  onToolModeChange?: (mode: ToolMode) => void;
}

export interface LexicalTapableEditorHandle {
  focus(): void;
  getEditor(): LexicalEditor | null;
  getPayload(): PromptInputPayload | null;
  insertAIBlock(payload: AIBlockPayload): void;
  insertAIChip(payload: AIChipPayload): void;
  insertImage(payload: ImagePayload): void;
  updateAIBlock(payload: UpdateAIBlockPayload): void;
  updateImage(payload: UpdateImagePayload): void;
}
