import { EditorState } from 'lexical';

export type PortableNodeType =
  | 'root'
  | 'paragraph'
  | 'heading'
  | 'quote'
  | 'code'
  | 'list'
  | 'list-item'
  | 'link'
  | 'text'
  | 'context'
  | 'attachment'
  | 'tool'
  | 'artifact'
  | 'tool-call'
  | 'image'
  | 'unknown';

export interface PortableBaseNode {
  id: string;
  type: PortableNodeType;
}

export interface PortableRootNode extends PortableBaseNode {
  type: 'root';
  children: PortableEditorNode[];
}

export interface PortableContainerNode extends PortableBaseNode {
  type: 'paragraph' | 'quote' | 'list-item' | 'unknown';
  children?: PortableEditorNode[];
}

export interface PortableHeadingNode extends PortableBaseNode {
  type: 'heading';
  tag?: string;
  children?: PortableEditorNode[];
}

export interface PortableCodeNode extends PortableBaseNode {
  type: 'code';
  language?: string;
  text?: string;
  children?: PortableEditorNode[];
}

export interface PortableListNode extends PortableBaseNode {
  type: 'list';
  listType?: string;
  children?: PortableEditorNode[];
}

export interface PortableLinkNode extends PortableBaseNode {
  type: 'link';
  url?: string;
  target?: string | null;
  rel?: string | null;
  children?: PortableEditorNode[];
}

export interface PortableTextNode extends PortableBaseNode {
  type: 'text';
  text: string;
  marks: string[];
}

export interface PortableChipNode extends PortableBaseNode {
  type: 'context' | 'attachment' | 'tool';
  kind: 'context' | 'attachment' | 'tool';
  label: string;
  meta?: Record<string, unknown>;
}

export interface PortableAIBlockNode extends PortableBaseNode {
  type: 'artifact' | 'tool-call';
  kind: 'artifact' | 'tool-call';
  title: string;
  actions?: string[];
  status?: string;
  content?: string;
  invocationId?: string;
  logs?: unknown[];
  meta?: Record<string, unknown>;
  output?: string;
  runId?: string;
}

export interface PortableImageNode extends PortableBaseNode {
  type: 'image';
  src: string;
  alt?: string;
  alignment?: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  meta?: Record<string, unknown>;
}

export type PortableEditorNode =
  | PortableRootNode
  | PortableContainerNode
  | PortableHeadingNode
  | PortableCodeNode
  | PortableListNode
  | PortableLinkNode
  | PortableTextNode
  | PortableChipNode
  | PortableAIBlockNode
  | PortableImageNode;

export interface PortableEditorDocument {
  version: 2;
  root: PortableRootNode;
}

export interface LegacyPortableEditorNode {
  id: string;
  type: PortableNodeType;
  text?: string;
  marks?: string[];
  props?: Record<string, unknown>;
  children?: LegacyPortableEditorNode[];
}

export interface LegacyPortableEditorDocument {
  version: 1;
  root: LegacyPortableEditorNode;
}

type SerializedNode = {
  children?: SerializedNode[];
  detail?: number;
  direction?: string | null;
  format?: number | string;
  id?: string;
  indent?: number;
  kind?: string;
  label?: string;
  listType?: string;
  mode?: string;
  rel?: string | null;
  src?: string;
  status?: string;
  style?: string;
  tag?: string;
  target?: string | null;
  text?: string;
  title?: string;
  type?: string;
  url?: string;
  version?: number;
  [key: string]: unknown;
};

const textMarks = (format: unknown): string[] => {
  if (typeof format !== 'number') return [];

  const marks: string[] = [];
  if (format & 1) marks.push('bold');
  if (format & 2) marks.push('italic');
  if (format & 4) marks.push('strikethrough');
  if (format & 8) marks.push('underline');
  if (format & 16) marks.push('code');
  return marks;
};

const textFormat = (marks: string[] = []): number =>
  marks.reduce((format, mark) => {
    if (mark === 'bold') return format | 1;
    if (mark === 'italic') return format | 2;
    if (mark === 'strikethrough') return format | 4;
    if (mark === 'underline') return format | 8;
    if (mark === 'code') return format | 16;
    return format;
  }, 0);

const portableTypeFor = (node: SerializedNode): PortableNodeType => {
  if (node.type === 'root') return 'root';
  if (node.type === 'paragraph') return 'paragraph';
  if (node.type === 'heading') return 'heading';
  if (node.type === 'quote') return 'quote';
  if (node.type === 'code') return 'code';
  if (node.type === 'list') return 'list';
  if (node.type === 'listitem') return 'list-item';
  if (node.type === 'link' || node.type === 'autolink') return 'link';
  if (node.type === 'text') return 'text';
  if (node.type === 'image') return 'image';
  if (node.type === 'ai-chip') {
    if (node.kind === 'context') return 'context';
    if (node.kind === 'attachment') return 'attachment';
    if (node.kind === 'tool') return 'tool';
  }
  if (node.type === 'ai-block') {
    if (node.kind === 'artifact') return 'artifact';
    if (node.kind === 'tool-call') return 'tool-call';
  }
  return 'unknown';
};

function createNodeId(node: SerializedNode, indexPath: string): string {
  if (node.id) return String(node.id);
  return `${node.type || 'node'}-${indexPath}`;
}

function toPortableNode(
  node: SerializedNode,
  indexPath: string
): PortableEditorNode {
  const type = portableTypeFor(node);
  const id = createNodeId(node, indexPath);
  const children = (node.children || []).map((child, index) =>
    toPortableNode(child, `${indexPath}-${index}`)
  );

  if (type === 'root') return { id, type, children };
  if (type === 'text') {
    return { id, type, text: node.text || '', marks: textMarks(node.format) };
  }
  if (type === 'heading') {
    return { id, type, tag: node.tag, children };
  }
  if (type === 'code') {
    return {
      id,
      type,
      language: typeof node.language === 'string' ? node.language : undefined,
      text: node.text,
      children,
    };
  }
  if (type === 'list') return { id, type, listType: node.listType, children };
  if (type === 'link') {
    return {
      id,
      type,
      url: node.url,
      target: node.target,
      rel: node.rel,
      children,
    };
  }
  if (type === 'context' || type === 'attachment' || type === 'tool') {
    return {
      id,
      type,
      kind: type,
      label: node.label || id,
      meta: node.meta as Record<string, unknown> | undefined,
    };
  }
  if (type === 'artifact' || type === 'tool-call') {
    return {
      id,
      type,
      kind: type,
      title: node.title || type,
      actions: node.actions as string[] | undefined,
      status: node.status,
      content: node.content as string | undefined,
      invocationId: node.invocationId as string | undefined,
      logs: node.logs as unknown[] | undefined,
      meta: node.meta as Record<string, unknown> | undefined,
      output: node.output as string | undefined,
      runId: node.runId as string | undefined,
    };
  }
  if (type === 'image') {
    return {
      id,
      type,
      src: node.src || '',
      alt: node.alt as string | undefined,
      alignment: node.alignment as string | undefined,
      caption: node.caption as string | undefined,
      width: node.width as number | string | undefined,
      height: node.height as number | string | undefined,
      meta: node.meta as Record<string, unknown> | undefined,
    };
  }

  return { id, type, children };
}

export function createPortableDocumentFromJSON(json: {
  root: SerializedNode;
}): PortableEditorDocument {
  return {
    version: 2,
    root: toPortableNode(json.root, 'root') as PortableRootNode,
  };
}

export function createPortableDocumentFromEditorState(
  editorState: EditorState
): PortableEditorDocument {
  return createPortableDocumentFromJSON(
    editorState.toJSON() as { root: SerializedNode }
  );
}

export function migratePortableDocument(
  document: PortableEditorDocument | LegacyPortableEditorDocument
): PortableEditorDocument {
  if (document.version === 2) return document;

  const migrateNode = (
    node: LegacyPortableEditorNode
  ): PortableEditorNode => {
    const props = node.props || {};
    const children = node.children?.map(migrateNode) || [];

    if (node.type === 'root') return { id: node.id, type: 'root', children };
    if (node.type === 'text') {
      return {
        id: node.id,
        type: 'text',
        text: node.text || '',
        marks: node.marks || [],
      };
    }
    if (node.type === 'heading') {
      return {
        id: node.id,
        type: 'heading',
        tag: props.tag as string | undefined,
        children,
      };
    }
    if (node.type === 'code') {
      return {
        id: node.id,
        type: 'code',
        language: props.language as string | undefined,
        text: node.text,
        children,
      };
    }
    if (node.type === 'list') {
      return {
        id: node.id,
        type: 'list',
        listType: props.listType as string | undefined,
        children,
      };
    }
    if (node.type === 'link') {
      return {
        id: node.id,
        type: 'link',
        url: props.url as string | undefined,
        target: props.target as string | null | undefined,
        rel: props.rel as string | null | undefined,
        children,
      };
    }
    if (
      node.type === 'context' ||
      node.type === 'attachment' ||
      node.type === 'tool'
    ) {
      return {
        id: node.id,
        type: node.type,
        kind: node.type,
        label: (props.label as string | undefined) || node.id,
        meta: props.meta as Record<string, unknown> | undefined,
      };
    }
    if (node.type === 'artifact' || node.type === 'tool-call') {
      return {
        id: node.id,
        type: node.type,
        kind: node.type,
        title: (props.title as string | undefined) || node.type,
        actions: props.actions as string[] | undefined,
        status: props.status as string | undefined,
        content: props.content as string | undefined,
        invocationId: props.invocationId as string | undefined,
        logs: props.logs as unknown[] | undefined,
        meta: props.meta as Record<string, unknown> | undefined,
        output: props.output as string | undefined,
        runId: props.runId as string | undefined,
      };
    }
    if (node.type === 'image') {
      return {
        id: node.id,
        type: 'image',
        src: (props.src as string | undefined) || '',
        alt: props.alt as string | undefined,
        alignment: props.alignment as string | undefined,
        caption: props.caption as string | undefined,
        width: props.width as number | string | undefined,
        height: props.height as number | string | undefined,
        meta: props.meta as Record<string, unknown> | undefined,
      };
    }

    return { id: node.id, type: 'unknown', children };
  };

  return {
    version: 2,
    root: migrateNode(document.root) as PortableRootNode,
  };
}

function toLexicalNode(node: PortableEditorNode): SerializedNode {
  if (node.type === 'root') {
    return {
      type: 'root',
      version: 1,
      children: node.children.map(toLexicalNode),
      direction: null,
      format: '',
      indent: 0,
    };
  }
  if (node.type === 'paragraph' || node.type === 'unknown') {
    return {
      type: 'paragraph',
      version: 1,
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
    };
  }
  if (node.type === 'heading') {
    return {
      type: 'heading',
      version: 1,
      tag: node.tag || 'h2',
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
    };
  }
  if (node.type === 'quote') {
    return {
      type: 'quote',
      version: 1,
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
    };
  }
  if (node.type === 'code') {
    return {
      type: 'code',
      version: 1,
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
    };
  }
  if (node.type === 'list') {
    return {
      type: 'list',
      version: 1,
      listType: node.listType || 'bullet',
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
      start: 1,
      tag: node.listType === 'number' ? 'ol' : 'ul',
    };
  }
  if (node.type === 'list-item') {
    return {
      type: 'listitem',
      version: 1,
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
      value: 1,
    };
  }
  if (node.type === 'link') {
    return {
      type: 'link',
      version: 1,
      url: node.url || '',
      target: node.target || null,
      rel: node.rel || null,
      children: node.children?.map(toLexicalNode) || [],
      direction: null,
      format: '',
      indent: 0,
    };
  }
  if (node.type === 'text') {
    return {
      type: 'text',
      version: 1,
      text: node.text,
      detail: 0,
      format: textFormat(node.marks),
      mode: 'normal',
      style: '',
    };
  }
  if (
    node.type === 'context' ||
    node.type === 'attachment' ||
    node.type === 'tool'
  ) {
    return {
      type: 'ai-chip',
      version: 1,
      id: node.id,
      kind: node.kind,
      label: node.label,
      meta: node.meta,
    };
  }
  if (node.type === 'artifact' || node.type === 'tool-call') {
    return {
      type: 'ai-block',
      version: 1,
      id: node.id,
      kind: node.kind,
      title: node.title,
      actions: node.actions,
      status: node.status,
      content: node.content,
      invocationId: node.invocationId,
      logs: node.logs,
      meta: node.meta,
      output: node.output,
      runId: node.runId,
    };
  }

  if (node.type === 'image') {
    return {
      type: 'image',
      version: 1,
      id: node.id,
      src: node.src,
      alt: node.alt,
      alignment: node.alignment || 'center',
      caption: node.caption,
      width: node.width,
      height: node.height,
      meta: node.meta,
    };
  }

  return {
    type: 'image',
    version: 1,
    id: node.id,
    src: '',
    alignment: 'center',
  };
}

export function createLexicalJSONFromPortableDocument(
  document: PortableEditorDocument | LegacyPortableEditorDocument
) {
  return {
    root: toLexicalNode(migratePortableDocument(document).root),
  };
}

function childrenToMarkdown(children: PortableEditorNode[] = []): string {
  return children.map(nodeToMarkdown).join('');
}

function nodeToMarkdown(node: PortableEditorNode): string {
  if (node.type === 'root') return node.children.map(nodeToMarkdown).join('\n\n');
  if (node.type === 'paragraph') return childrenToMarkdown(node.children);
  if (node.type === 'heading') {
    const level = Number((node.tag || 'h2').replace('h', '')) || 2;
    return `${'#'.repeat(level)} ${childrenToMarkdown(node.children)}`;
  }
  if (node.type === 'quote') {
    return childrenToMarkdown(node.children)
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n');
  }
  if (node.type === 'code') return `\`\`\`\n${childrenToMarkdown(node.children)}\n\`\`\``;
  if (node.type === 'list') {
    const ordered = node.listType === 'number';
    return (node.children || [])
      .map((child, index) => `${ordered ? `${index + 1}.` : '-'} ${nodeToMarkdown(child)}`)
      .join('\n');
  }
  if (node.type === 'list-item') return childrenToMarkdown(node.children);
  if (node.type === 'link') {
    return `[${childrenToMarkdown(node.children)}](${node.url || ''})`;
  }
  if (node.type === 'text') return node.text;
  if (node.type === 'context') return `@${node.label}`;
  if (node.type === 'attachment') return `[${node.label}]`;
  if (node.type === 'tool') return `/${node.label}`;
  if (node.type === 'artifact' || node.type === 'tool-call') {
    return [
      `::${node.type}{id="${node.id}" status="${node.status || ''}"}`,
      node.content,
      node.output,
      '::',
    ]
      .filter(Boolean)
      .join('\n');
  }
  if (node.type === 'image') {
    return `![${node.alt || node.caption || ''}](${node.src})`;
  }
  return '';
}

export function exportPortableDocumentToMarkdown(
  document: PortableEditorDocument | LegacyPortableEditorDocument
): string {
  return nodeToMarkdown(migratePortableDocument(document).root);
}

export function exportPortableDocumentToPlainText(
  document: PortableEditorDocument | LegacyPortableEditorDocument
): string {
  const collect = (node: PortableEditorNode): string => {
    if (node.type === 'text') return node.text;
    if (node.type === 'context') return `@${node.label}`;
    if (node.type === 'attachment') return node.label;
    if (node.type === 'tool') return `/${node.label}`;
    if (node.type === 'artifact' || node.type === 'tool-call') {
      return [node.title, node.status, node.content, node.output]
        .filter(Boolean)
        .join('\n');
    }
    if (node.type === 'image') return [node.alt, node.caption, node.src].filter(Boolean).join('\n');
    return ('children' in node ? node.children || [] : []).map(collect).join('\n');
  };

  return collect(migratePortableDocument(document).root).trim();
}
