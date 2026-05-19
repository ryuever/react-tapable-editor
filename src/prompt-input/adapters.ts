import type { AttachmentItem, PromptInputPayload } from '../lexical/types';
import type {
  PromptInputAttachment,
  PromptInputMessage,
  PromptInputMessageOptions,
  ReferencedSourceItem,
} from './types';

export interface AISDKFileLike {
  name: string;
  type?: string;
  url?: string;
}

export interface AISDKSendMessageInput {
  files?: AISDKFileLike[];
  metadata?: Record<string, unknown>;
  text: string;
}

export type OpenAIResponsesInputContent =
  | { type: 'input_text'; text: string }
  | { type: 'input_image'; image_url: string }
  | { type: 'input_file'; file_url?: string; filename: string };

export interface OpenAIResponsesInputMessage {
  content: OpenAIResponsesInputContent[];
  role: 'user';
}

export interface OpenAIResponsesInput {
  input: OpenAIResponsesInputMessage[];
  metadata?: Record<string, unknown>;
  model?: string;
}

function normalizeAttachment(item: AttachmentItem): PromptInputAttachment {
  const value =
    item.value && typeof item.value === 'object'
      ? (item.value as Record<string, unknown>)
      : {};
  const size = typeof value.size === 'number' ? value.size : undefined;

  return {
    ...item,
    size,
    status: 'ready',
  };
}

function referencedSourcesFromPayload(
  payload: PromptInputPayload
): ReferencedSourceItem[] {
  return payload.parts
    .filter(part => part.kind === 'context')
    .map(part => ({
      id: part.id,
      label: part.label,
      type:
        typeof part.meta?.type === 'string'
          ? part.meta.type
          : typeof part.meta?.mentionKind === 'string'
            ? part.meta.mentionKind
            : undefined,
      url: typeof part.meta?.url === 'string' ? part.meta.url : undefined,
      meta: part.meta,
    }));
}

export function createPromptInputMessage(
  payload: PromptInputPayload,
  options: PromptInputMessageOptions = {}
): PromptInputMessage {
  return {
    id: options.id,
    attachments: payload.attachments.map(normalizeAttachment),
    context: payload.context,
    createdAt: options.createdAt,
    metadata: options.metadata,
    model: payload.model,
    parts: payload.parts,
    portable: payload.portable,
    referencedSources:
      options.referencedSources || referencedSourcesFromPayload(payload),
    text: payload.text,
    toolMode: payload.toolMode,
  };
}

export function toAISDKSendMessageInput(
  message: PromptInputMessage
): AISDKSendMessageInput {
  const files = message.attachments.map(attachment => ({
    name: attachment.name,
    type: attachment.type,
    url: attachment.url,
  }));

  return {
    files: files.length > 0 ? files : undefined,
    metadata: {
      ...(message.metadata || {}),
      context: message.context,
      model: message.model,
      parts: message.parts,
      referencedSources: message.referencedSources,
      toolMode: message.toolMode,
    },
    text: message.text,
  };
}

export function toOpenAIResponsesInput(
  message: PromptInputMessage
): OpenAIResponsesInput {
  const content: OpenAIResponsesInputContent[] = [];

  if (message.text.trim()) {
    content.push({ type: 'input_text', text: message.text });
  }

  message.attachments.forEach(attachment => {
    if (attachment.type?.startsWith('image/') && attachment.url) {
      content.push({ type: 'input_image', image_url: attachment.url });
      return;
    }

    content.push({
      type: 'input_file',
      file_url: attachment.url,
      filename: attachment.name,
    });
  });

  message.parts.forEach(part => {
    if (part.kind === 'image' && part.src) {
      content.push({ type: 'input_image', image_url: part.src });
    }
  });

  return {
    input: [{ role: 'user', content }],
    metadata: {
      ...(message.metadata || {}),
      context: message.context,
      model: message.model,
      parts: message.parts,
      referencedSources: message.referencedSources,
      toolMode: message.toolMode,
    },
    model: message.model?.id,
  };
}
