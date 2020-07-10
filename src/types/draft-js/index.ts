import { ContentBlock, CharacterMetadata, DraftBlockType, DraftInlineStyle } from 'draft-js';
// import * as Immutable from 'immutable';
import Immutable from 'immutable'

// const Record = Immutable.Record.Class

export interface DraftDecoratorType {
  /**
   * Given a `ContentBlock`, return an immutable List of decorator keys.
   */
  getDecorations(
    block: ContentBlock,
    contentState: ContentState
  ): Immutable.List<string>;

  /**
   * Given a decorator key, return the component to use when rendering
   * this decorated range.
   */
  getComponentForKey(key: string): Function;

  /**
   * Given a decorator key, optionally return the props to use when rendering
   * this decorated range.
   */
  getPropsForKey(key: string): any;
}

// export class ContentBlockNode extends ContentBlock {
//   parent: string | null;
//   characterList: Immutable.List<CharacterMetadata>;
//   data: { [key: string]: any };
//   depth: number
//   key: string;
//   text: string;
//   type: string;
//   children: Immutable.List<string>;
//   prevSibling: ContentBlockNode | null;
//   nextSibling: ContentBlockNode | null;
//   getChildKeys(): Immutable.List<string>;
//   getParentKey(): string;
//   getPrevSiblingKey(): string | null;
//   getNextSiblingKey(): string | null;
// }

export type BlockNodeMap = Immutable.OrderedMap<string, ContentBlockNode>

// const instance = Immutable.Record({
//   parent: null,
//   characterList: Immutable.List(),
//   data: Immutable.Map(),
//   depth: 0,
//   key: '',
//   text: '',
//   type: 'unstyled',
//   children: Immutable.List(),
//   prevSibling: null,
//   nextSibling: null,
// })

export interface ContentBlockNode extends Immutable.Record<{
  parent: null,
  characterList: Immutable.List<CharacterMetadata>;
  data: { [key: string]: any };
  depth: number;
  key: string;
  text: string;
  type: string;
  children: Immutable.List<string>,
  prevSibling: null,
  nextSibling: null,
}> {
  getChildKeys(): Immutable.List<string>;
  getParentKey(): string;
  getPrevSiblingKey(): string | null;
  getNextSiblingKey(): string | null;

  getKey(): string;

  getType(): DraftBlockType;

  getText(): string;
  getCharacterList(): Immutable.List<CharacterMetadata>;
  getLength(): number;
  getDepth(): number;
  getData(): Immutable.Map<any, any>;
  getInlineStyleAt(offset: number): DraftInlineStyle;
  getEntityAt(offset: number): string;

  /**
   * Execute a callback for every contiguous range of styles within the block.
   */
  findStyleRanges(
      filterFn: (value: CharacterMetadata) => boolean,
      callback: (start: number, end: number) => void,
  ): void;

  /**
   * Execute a callback for every contiguous range of entities within the block.
   */
  findEntityRanges(
      filterFn: (value: CharacterMetadata) => boolean,
      callback: (start: number, end: number) => void,
  ): void;
}

// export class ContentState extends Immutable.Record.Class {
//   static createFromBlockArray(blocks: Array<ContentBlock>, entityMap?: any): ContentState;
//   static createFromText(text: string, delimiter?: string): ContentState;

//   createEntity(type: DraftEntityType, mutability: DraftEntityMutability, data?: Object): ContentState;
//   getEntity(key: string): EntityInstance;
//   getEntityMap(): any;
//   getLastCreatedEntityKey(): string;
//   mergeEntityData(key: string, toMerge: { [key: string]: any }): ContentState;
//   replaceEntityData(key: string, toMerge: { [key: string]: any }): ContentState;
//   addEntity(instance: DraftEntityInstance): ContentState;

//   getBlockMap(): BlockMap;
//   getSelectionBefore(): SelectionState;
//   getSelectionAfter(): SelectionState;
//   getBlockForKey(key: string): ContentBlock;

//   getKeyBefore(key: string): string;
//   getKeyAfter(key: string): string;
//   getBlockAfter(key: string): ContentBlock;
//   getBlockBefore(key: string): ContentBlock;

//   getBlocksAsArray(): Array<ContentBlock>;
//   getFirstBlock(): ContentBlock;
//   getLastBlock(): ContentBlock;
//   getPlainText(delimiter?: string): string;
//   hasText(): boolean;
// }