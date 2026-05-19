import { JSX } from 'react';
import {
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

export type AIChipKind = 'context' | 'attachment' | 'tool';

export interface AIChipPayload {
  id: string;
  kind: AIChipKind;
  label: string;
  meta?: Record<string, unknown>;
}

export type SerializedAIChipNode = Spread<
  {
    id: string;
    kind: AIChipKind;
    label: string;
    meta?: Record<string, unknown>;
  },
  SerializedLexicalNode
>;

const kindLabel: Record<AIChipKind, string> = {
  context: '@',
  attachment: '#',
  tool: '/',
};

function AIChipView({ kind, label }: { kind: AIChipKind; label: string }) {
  return (
    <span className={`rte-ai-node rte-ai-node-${kind}`}>
      <span className="rte-ai-node-prefix">{kindLabel[kind]}</span>
      {label}
    </span>
  );
}

export class AIChipNode extends DecoratorNode<JSX.Element> {
  __id: string;

  __kind: AIChipKind;

  __label: string;

  __meta: Record<string, unknown>;

  static getType(): string {
    return 'ai-chip';
  }

  static clone(node: AIChipNode): AIChipNode {
    return new AIChipNode(
      node.__id,
      node.__kind,
      node.__label,
      node.__meta,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedAIChipNode): AIChipNode {
    return $createAIChipNode({
      id: serializedNode.id,
      kind: serializedNode.kind,
      label: serializedNode.label,
      meta: serializedNode.meta,
    });
  }

  constructor(
    id: string,
    kind: AIChipKind,
    label: string,
    meta: Record<string, unknown> = {},
    key?: NodeKey
  ) {
    super(key);
    this.__id = id;
    this.__kind = kind;
    this.__label = label;
    this.__meta = meta;
  }

  exportJSON(): SerializedAIChipNode {
    return {
      id: this.__id,
      kind: this.__kind,
      label: this.__label,
      meta: this.__meta,
      type: 'ai-chip',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.dataset.aiChipKind = this.__kind;
    element.dataset.aiChipId = this.__id;
    element.textContent = this.getTextContent();
    return { element };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('span');
    element.className = 'rte-ai-node-shell';
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <AIChipView kind={this.__kind} label={this.__label} />;
  }

  getTextContent(): string {
    return `${kindLabel[this.__kind]}${this.__label}`;
  }

  isInline(): boolean {
    return true;
  }

  isIsolated(): boolean {
    return true;
  }

  isKeyboardSelectable(): boolean {
    return true;
  }
}

export function $createAIChipNode(payload: AIChipPayload): AIChipNode {
  return new AIChipNode(
    payload.id,
    payload.kind,
    payload.label,
    payload.meta || {}
  );
}

export function $isAIChipNode(
  node: LexicalNode | null | undefined
): node is AIChipNode {
  return node instanceof AIChipNode;
}
