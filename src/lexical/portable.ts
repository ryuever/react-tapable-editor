export {
  createLexicalJSONFromPortableDocument,
  createPortableDocumentFromEditorState,
  createPortableDocumentFromJSON,
  exportPortableDocumentToMarkdown,
  exportPortableDocumentToPlainText,
  migratePortableDocument,
} from '../schema/portable';

export type {
  LegacyPortableEditorDocument,
  LegacyPortableEditorNode,
  PortableAIBlockNode,
  PortableBaseNode,
  PortableChipNode,
  PortableCodeNode,
  PortableContainerNode,
  PortableEditorDocument,
  PortableEditorNode,
  PortableHeadingNode,
  PortableImageNode,
  PortableLinkNode,
  PortableListNode,
  PortableNodeType,
  PortableRootNode,
  PortableTextNode,
} from '../schema/portable';
