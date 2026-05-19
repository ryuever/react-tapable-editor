import { EditorState } from 'lexical';
import {
  AttachmentItem,
  ContextItem,
  ModelOption,
  PromptInputPart,
  PromptInputPayload,
  ToolMode,
} from './types';
import { createPortableDocumentFromJSON } from './portable';

type SerializedNode = {
  children?: SerializedNode[];
  id?: string;
  kind?: PromptInputPart['kind'];
  label?: string;
  title?: string;
  status?: string;
  content?: string;
  src?: string;
  alt?: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  alignment?: string;
  actions?: PromptInputPart['actions'];
  invocationId?: string;
  logs?: PromptInputPart['logs'];
  output?: string;
  runId?: string;
  text?: string;
  meta?: Record<string, unknown>;
  type?: string;
};

const structuralNodeTypes = new Set(['ai-chip', 'ai-block', 'image']);

function normalizeUserText(text: string) {
  return text.trim().length > 0 ? text : '';
}

function collectUserText(node: SerializedNode): string {
  if (node.type && structuralNodeTypes.has(node.type)) return '';
  if (node.type === 'text') return node.text || '';

  const childText = (node.children || []).map(collectUserText);
  if (node.type === 'root') {
    return normalizeUserText(childText.filter(Boolean).join('\n'));
  }

  return childText.join('');
}

function collectPromptParts(node: SerializedNode): PromptInputPart[] {
  const ownChipParts =
    node.type === 'ai-chip' && node.id && node.kind && node.label
      ? [
          {
            id: node.id,
            kind: node.kind,
            label: node.label,
            meta: node.meta,
          },
        ]
      : [];
  const ownBlockParts =
    node.type === 'ai-block' && node.id && node.kind && node.title
      ? [
          {
            id: node.id,
            kind: node.kind,
            label: node.title,
            actions: node.actions,
            status: node.status,
            content: node.content,
            invocationId: node.invocationId,
            logs: node.logs,
            meta: node.meta,
            output: node.output,
            runId: node.runId,
          },
        ]
      : [];
  const ownImageParts =
    node.type === 'image' && node.id && node.src
      ? [
          {
            id: node.id,
            kind: 'image' as const,
            label: node.caption || node.alt || node.src,
            src: node.src,
            content: node.caption,
            meta: {
              ...(node.meta || {}),
              alignment: node.alignment,
              height: node.height,
              width: node.width,
            },
          },
        ]
      : [];

  return (node.children || []).reduce<PromptInputPart[]>(
    (parts, child) => parts.concat(collectPromptParts(child)),
    ownChipParts.concat(ownBlockParts).concat(ownImageParts)
  );
}

export function createPromptPayload(
  editorState: EditorState,
  context: ContextItem[],
  attachments: AttachmentItem[],
  toolMode: ToolMode,
  model?: ModelOption
): PromptInputPayload {
  const lexical = editorState.toJSON();
  const root = lexical.root as SerializedNode;

  return {
    text: collectUserText(root),
    lexical,
    portable: createPortableDocumentFromJSON({
      root,
    }),
    parts: collectPromptParts(root),
    context,
    attachments,
    toolMode,
    model,
  };
}
