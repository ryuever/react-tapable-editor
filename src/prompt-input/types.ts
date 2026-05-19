import type {
  AttachmentItem,
  ContextItem,
  ModelOption,
  PromptInputPart,
  PromptInputPayload,
  ToolMode,
} from '../lexical/types';
import type { PortableEditorDocument } from '../schema/portable';
import type { ReactNode } from 'react';

export type PromptInputStatus =
  | 'idle'
  | 'ready'
  | 'submitted'
  | 'streaming'
  | 'error';

export type PromptInputAttachmentStatus =
  | 'idle'
  | 'uploading'
  | 'ready'
  | 'error';

export interface PromptInputAttachment extends AttachmentItem {
  error?: string;
  size?: number;
  status?: PromptInputAttachmentStatus;
}

export interface ReferencedSourceItem {
  id: string;
  label: string;
  type?: string;
  url?: string;
  meta?: Record<string, unknown>;
}

export interface PromptInputMessage {
  id?: string;
  attachments: PromptInputAttachment[];
  context: ContextItem[];
  createdAt?: string;
  metadata?: Record<string, unknown>;
  model?: ModelOption;
  parts: PromptInputPart[];
  portable: PortableEditorDocument;
  referencedSources: ReferencedSourceItem[];
  text: string;
  toolMode: ToolMode;
}

export interface PromptInputMessageOptions {
  id?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
  referencedSources?: ReferencedSourceItem[];
}

export interface PromptInputControllerState {
  attachments: PromptInputAttachment[];
  error: Error | null;
  lastSubmittedMessage: PromptInputMessage | null;
  message: PromptInputMessage | null;
  status: PromptInputStatus;
  text: string;
}

export interface PromptInputController {
  addAttachments(attachments: PromptInputAttachment[]): void;
  clear(): void;
  removeAttachment(id: string): void;
  setAttachments(attachments: PromptInputAttachment[]): void;
  setError(error: Error | null): void;
  setPayload(payload: PromptInputPayload | null): void;
  setStatus(status: PromptInputStatus): void;
  setText(text: string): void;
  submitPayload(
    payload: PromptInputPayload,
    options?: PromptInputMessageOptions
  ): PromptInputMessage;
}

export interface PromptInputProviderProps {
  children: ReactNode;
  initialAttachments?: PromptInputAttachment[];
  initialStatus?: PromptInputStatus;
  initialText?: string;
  onSubmit?: (message: PromptInputMessage) => void;
}
