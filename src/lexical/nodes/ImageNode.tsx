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

export interface ImagePayload {
  id: string;
  src: string;
  alt?: string;
  alignment?: ImageAlignment;
  caption?: string;
  width?: number | string;
  height?: number | string;
  meta?: Record<string, unknown>;
}

export type ImageAlignment = 'left' | 'center' | 'right' | 'full';

export interface UpdateImagePayload {
  id: string;
  alt?: string;
  alignment?: ImageAlignment;
  caption?: string;
  width?: number | string;
  height?: number | string;
  meta?: Record<string, unknown>;
}

export type SerializedImageNode = Spread<
  {
    id: string;
    src: string;
    alt?: string;
    alignment: ImageAlignment;
    caption?: string;
    width?: number | string;
    height?: number | string;
    meta?: Record<string, unknown>;
  },
  SerializedLexicalNode
>;

function ImageView({
  alignment,
  alt,
  caption,
  height,
  id,
  meta,
  nodeKey,
  src,
  width,
}: {
  alignment: ImageAlignment;
  alt?: string;
  caption?: string;
  height?: number | string;
  id: string;
  meta: Record<string, unknown>;
  nodeKey: NodeKey;
  src: string;
  width?: number | string;
}) {
  const [editor] = useLexicalComposerContext();
  const [selected, setSelected] = useState(false);
  const serialized = useMemo(
    () => ({
      id,
      src,
      alt,
      alignment,
      caption,
      width,
      height,
      meta,
      type: 'image',
      version: 1,
    }),
    [alignment, alt, caption, height, id, meta, src, width]
  );

  const withNode = (callback: (node: ImageNode) => void) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) callback(node);
    });
  };

  const copyJSON = () => {
    const json = JSON.stringify(serialized, null, 2);
    void navigator.clipboard?.writeText(json);
  };

  const editTextField = (field: 'alt' | 'caption') => {
    const label = field === 'alt' ? 'Alt text' : 'Caption';
    const current = field === 'alt' ? alt : caption;
    const value = window.prompt(label, current || '');
    if (value === null) return;
    withNode(node => node.update({ [field]: value }));
  };

  const setWidth = () => {
    const value = window.prompt('Image width', String(width || '100%'));
    if (value === null) return;
    withNode(node => node.update({ width: value }));
  };

  return (
    <figure
      className={[
        'rte-image-node',
        `rte-image-node-${alignment}`,
        selected ? 'rte-block-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      tabIndex={0}
      onBlur={() => setSelected(false)}
      onClick={() => setSelected(true)}
      onFocus={() => setSelected(true)}
    >
      {selected && (
        <div
          className="rte-block-toolbar"
          aria-label="Image block tools"
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
                  $createImageNode({
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
      {selected && (
        <div
          className="rte-image-toolbar"
          aria-label="Image edit tools"
          onMouseDown={event => event.preventDefault()}
        >
          {(['left', 'center', 'right', 'full'] as ImageAlignment[]).map(
            nextAlignment => (
              <button
                className={
                  nextAlignment === alignment ? 'rte-toolbar-active' : ''
                }
                key={nextAlignment}
                type="button"
                onClick={() =>
                  withNode(node => node.update({ alignment: nextAlignment }))
                }
              >
                {nextAlignment}
              </button>
            )
          )}
          {['160px', '240px', '320px', '100%'].map(nextWidth => (
            <button
              className={nextWidth === width ? 'rte-toolbar-active' : ''}
              key={nextWidth}
              type="button"
              onClick={() => withNode(node => node.update({ width: nextWidth }))}
            >
              {nextWidth}
            </button>
          ))}
          <button type="button" onClick={setWidth}>
            Custom width
          </button>
          <button type="button" onClick={() => editTextField('caption')}>
            Caption
          </button>
          <button type="button" onClick={() => editTextField('alt')}>
            Alt
          </button>
        </div>
      )}
      <img
        alt={alt || ''}
        src={src}
        style={{
          height,
          width,
        }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __alignment: ImageAlignment;

  __alt: string;

  __caption: string;

  __height?: number | string;

  __id: string;

  __meta: Record<string, unknown>;

  __src: string;

  __width?: number | string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__id,
      node.__src,
      node.__alt,
      node.__alignment,
      node.__caption,
      node.__width,
      node.__height,
      node.__meta,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      id: serializedNode.id,
      src: serializedNode.src,
      alt: serializedNode.alt,
      alignment: serializedNode.alignment,
      caption: serializedNode.caption,
      width: serializedNode.width,
      height: serializedNode.height,
      meta: serializedNode.meta,
    });
  }

  constructor(
    id: string,
    src: string,
    alt = '',
    alignment: ImageAlignment = 'center',
    caption = '',
    width: number | string | undefined = '100%',
    height?: number | string,
    meta: Record<string, unknown> = {},
    key?: NodeKey
  ) {
    super(key);
    this.__id = id;
    this.__src = src;
    this.__alt = alt;
    this.__alignment = alignment;
    this.__caption = caption;
    this.__width = width;
    this.__height = height;
    this.__meta = meta;
  }

  exportJSON(): SerializedImageNode {
    return {
      id: this.__id,
      src: this.__src,
      alt: this.__alt,
      alignment: this.__alignment,
      caption: this.__caption,
      width: this.__width,
      height: this.__height,
      meta: this.__meta,
      type: 'image',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement('img');
    image.alt = this.__alt;
    image.src = this.__src;
    return { element: image };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('figure');
    element.className = 'rte-image-node-shell';
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <ImageView
        alignment={this.__alignment}
        alt={this.__alt}
        caption={this.__caption}
        height={this.__height}
        id={this.__id}
        meta={this.__meta}
        nodeKey={this.__key}
        src={this.__src}
        width={this.__width}
      />
    );
  }

  getTextContent(): string {
    return [this.__alt, this.__caption, this.__src].filter(Boolean).join('\n');
  }

  isInline(): boolean {
    return false;
  }

  update(payload: Omit<UpdateImagePayload, 'id'>): void {
    const writable = this.getWritable();
    if (payload.alt !== undefined) writable.__alt = payload.alt;
    if (payload.alignment !== undefined) writable.__alignment = payload.alignment;
    if (payload.caption !== undefined) writable.__caption = payload.caption;
    if (payload.width !== undefined) writable.__width = payload.width;
    if (payload.height !== undefined) writable.__height = payload.height;
    if (payload.meta !== undefined) {
      writable.__meta = {
        ...writable.__meta,
        ...payload.meta,
      };
    }
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  return new ImageNode(
    payload.id,
    payload.src,
    payload.alt || '',
    payload.alignment || 'center',
    payload.caption || '',
    payload.width || '100%',
    payload.height,
    payload.meta || {}
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
