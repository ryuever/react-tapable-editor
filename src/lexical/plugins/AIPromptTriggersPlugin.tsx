import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
  type TextNode,
} from 'lexical';
import {
  MentionSuggestion,
  MentionSuggestionKind,
  SlashCommand,
  ToolMode,
} from '../types';
import { $createAIBlockNode } from '../nodes/AIBlockNode';
import { $createAIChipNode, AIChipPayload } from '../nodes/AIChipNode';
import { $createImageNode } from '../nodes/ImageNode';

type TriggerType = 'mention' | 'slash';

interface PromptQueryMatch {
  endOffset: number;
  query: string;
  replaceableString: string;
  startOffset: number;
  textNode: TextNode;
  type: TriggerType;
}

interface ActiveTrigger {
  query: string;
  type: TriggerType;
}

interface MentionOption {
  item: MentionSuggestion;
  key: string;
}

interface SlashOption {
  command: SlashCommand;
  key: string;
}

const mentionKindLabels: Record<MentionSuggestionKind, string> = {
  action: 'Actions',
  context: 'Context',
  file: 'Files',
  folder: 'Folders',
  person: 'People',
};

const mentionKindAliases: Record<MentionSuggestionKind, string[]> = {
  action: ['action', 'actions', 'command', 'commands'],
  context: ['context', 'contexts', 'selection'],
  file: ['file', 'files', 'doc', 'docs'],
  folder: ['folder', 'folders', 'directory', 'directories'],
  person: ['person', 'people', 'user', 'users', 'member', 'members'],
};

const mentionKindOrder: MentionSuggestionKind[] = [
  'person',
  'file',
  'folder',
  'context',
  'action',
];

function mentionIcon(kind: MentionSuggestionKind) {
  if (kind === 'person') return 'P';
  if (kind === 'file') return 'F';
  if (kind === 'folder') return 'D';
  if (kind === 'action') return 'A';
  return 'C';
}

function normalizeQuery(query: string | null) {
  return (query || '').trim().toLowerCase();
}

function matchesQuery(query: string, values: Array<unknown>) {
  if (!query) return true;

  return values
    .filter(value => value !== undefined && value !== null)
    .some(value => String(value).toLowerCase().includes(query));
}

function getTriggerMatch(
  type: TriggerType,
  text: string
): Omit<PromptQueryMatch, 'textNode'> | null {
  const trigger = type === 'mention' ? '@' : '/';
  const maxLength = type === 'mention' ? 64 : 48;
  const queryPattern = type === 'mention' ? '[^\\n\\r]*' : '\\S*';
  const triggerPattern = new RegExp(`(^|\\s|\\()(${trigger}(${queryPattern}))$`);
  const match = triggerPattern.exec(text);

  if (!match) return null;

  const leadingText = match[1];
  const query = match[3];
  if (query.length > maxLength) return null;

  const startOffset = match.index + leadingText.length;

  return {
    endOffset: text.length,
    query,
    replaceableString: match[2],
    startOffset,
    type,
  };
}

function $getSelectionTextNode(): { offset: number; textNode: TextNode } | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;

  const anchor = selection.anchor;
  const anchorNode = anchor.getNode();

  if (anchor.type === 'text' && $isTextNode(anchorNode)) {
    return { offset: anchor.offset, textNode: anchorNode };
  }

  if (anchor.type === 'element' && $isElementNode(anchorNode)) {
    const previousChild = anchorNode.getChildAtIndex(anchor.offset - 1);
    if ($isTextNode(previousChild)) {
      return {
        offset: previousChild.getTextContent().length,
        textNode: previousChild,
      };
    }
  }

  return null;
}

function $getPromptQueryMatch(): PromptQueryMatch | null {
  const textSelection = $getSelectionTextNode();
  if (!textSelection) return null;

  const { offset, textNode } = textSelection;
  const textBeforeCursor = textNode.getTextContent().slice(0, offset);
  const matches = (['mention', 'slash'] as TriggerType[])
    .map(type => getTriggerMatch(type, textBeforeCursor))
    .filter((match): match is Omit<PromptQueryMatch, 'textNode'> =>
      Boolean(match)
    )
    .sort((a, b) => b.startOffset - a.startOffset);

  const match = matches[0];
  if (!match) return null;

  return { ...match, textNode };
}

function $splitQueryText(match: PromptQueryMatch): TextNode {
  const textLength = match.textNode.getTextContent().length;

  if (match.startOffset === 0 && match.endOffset === textLength) {
    return match.textNode;
  }

  if (match.startOffset === 0) {
    const [targetNode] = match.textNode.splitText(match.endOffset);
    return targetNode;
  }

  if (match.endOffset === textLength) {
    const [, targetNode] = match.textNode.splitText(match.startOffset);
    return targetNode;
  }

  const [, targetNode] = match.textNode.splitText(
    match.startOffset,
    match.endOffset
  );
  return targetNode;
}

function replaceQueryWithChip(match: PromptQueryMatch, payload: AIChipPayload) {
  const queryNode = $splitQueryText(match);
  const chipNode = $createAIChipNode(payload);
  const spacerNode = $createTextNode(' ');
  const insertedChip = queryNode.replace(chipNode);

  insertedChip.insertAfter(spacerNode);
  spacerNode.selectEnd();
}

function replaceQueryWithText(match: PromptQueryMatch, text: string) {
  const queryNode = $splitQueryText(match);
  const insertedText = queryNode.replace($createTextNode(text));

  insertedText.selectEnd();
}

function removeQueryText(match: PromptQueryMatch) {
  const queryNode = $splitQueryText(match);
  const parent = queryNode.getParent();

  queryNode.remove(true);
  parent?.selectEnd();
}

function insertBlockAfterQuery(
  match: PromptQueryMatch,
  blockNode: ReturnType<typeof $createAIBlockNode> | ReturnType<typeof $createImageNode>
) {
  const queryNode = $splitQueryText(match);
  const topLevelElement = queryNode.getTopLevelElementOrThrow();
  const followUpParagraph = $createParagraphNode();

  queryNode.remove(true);
  topLevelElement.insertAfter(blockNode);
  blockNode.insertAfter(followUpParagraph);
  followUpParagraph.selectStart();

  if (!topLevelElement.getTextContent().trim()) {
    topLevelElement.remove();
  }
}

function runSlashCommand({
  command,
  currentToolMode,
  match,
  onToolModeChange,
}: {
  command: SlashCommand;
  currentToolMode: ToolMode;
  match: PromptQueryMatch;
  onToolModeChange?: (mode: ToolMode) => void;
}) {
  const targetToolMode = command.toolMode || currentToolMode;

  if (command.action === 'set-tool-mode') {
    removeQueryText(match);
    onToolModeChange?.(targetToolMode);
    return true;
  }

  if (command.action === 'insert-text') {
    replaceQueryWithText(match, command.value || command.label);
    return true;
  }

  if (command.action === 'insert-tool-chip') {
    replaceQueryWithChip(match, {
      id: `tool-${targetToolMode}`,
      kind: 'tool',
      label: targetToolMode,
      meta: { ...(command.meta || {}), mode: targetToolMode },
    });
    return true;
  }

  if (command.action === 'insert-artifact-block') {
    insertBlockAfterQuery(
      match,
      $createAIBlockNode({
        id: `artifact-${Date.now()}`,
        kind: 'artifact',
        title: command.label,
        status: 'idle',
        content: command.value || 'Structured AI output will appear here.',
        meta: { ...(command.meta || {}), source: 'slash-command' },
      })
    );
    return true;
  }

  if (command.action === 'insert-tool-call-block') {
    insertBlockAfterQuery(
      match,
      $createAIBlockNode({
        id: `tool-block-${targetToolMode}-${Date.now()}`,
        kind: 'tool-call',
        title: `${targetToolMode} tool call`,
        status: 'approval-required',
        content: command.value || `Ready to run ${targetToolMode}.`,
        meta: { ...(command.meta || {}), mode: targetToolMode },
      })
    );
    return true;
  }

  if (command.action === 'insert-image-block') {
    const src =
      command.value ||
      (typeof window === 'undefined' ? '' : window.prompt('Image URL') || '');
    if (!src) return false;

    insertBlockAfterQuery(
      match,
      $createImageNode({
        id: `image-${Date.now()}`,
        src,
        alignment: 'center',
        alt: command.label,
        caption: command.label,
        width: '100%',
      })
    );
    return true;
  }

  return false;
}

export default function AIPromptTriggersPlugin({
  mentionSuggestions,
  onToolModeChange,
  slashCommands,
  toolMode,
}: {
  mentionSuggestions: MentionSuggestion[];
  onToolModeChange?: (mode: ToolMode) => void;
  slashCommands: SlashCommand[];
  toolMode: ToolMode;
}) {
  const [editor] = useLexicalComposerContext();
  const [activeTrigger, setActiveTrigger] = useState<ActiveTrigger | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(
    () =>
      editor.registerUpdateListener(({ editorState }) => {
        let nextTrigger: ActiveTrigger | null = null;

        editorState.read(() => {
          const match = $getPromptQueryMatch();
          if (match) {
            nextTrigger = { query: match.query, type: match.type };
          }
        });

        setActiveTrigger(current => {
          if (
            current?.type === nextTrigger?.type &&
            current?.query === nextTrigger?.query
          ) {
            return current;
          }

          return nextTrigger;
        });
      }),
    [editor]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [activeTrigger?.query, activeTrigger?.type]);

  const mentionOptions = useMemo(() => {
    const query = normalizeQuery(
      activeTrigger?.type === 'mention' ? activeTrigger.query : null
    );

    return mentionSuggestions
      .filter(item =>
        matchesQuery(query, [
          item.id,
          item.kind,
          item.label,
          item.description,
          ...mentionKindAliases[item.kind],
        ])
      )
      .sort(
        (a, b) =>
          mentionKindOrder.indexOf(a.kind) - mentionKindOrder.indexOf(b.kind)
      )
      .slice(0, 12)
      .map(item => ({ item, key: `mention-${item.kind}-${item.id}` }));
  }, [activeTrigger, mentionSuggestions]);

  const slashOptions = useMemo(() => {
    const query = normalizeQuery(
      activeTrigger?.type === 'slash' ? activeTrigger.query : null
    );

    return slashCommands
      .filter(command =>
        matchesQuery(query, [
          command.id,
          command.label,
          command.description,
          command.action,
          command.toolMode,
          ...(command.keywords || []),
        ])
      )
      .slice(0, 10)
      .map(command => ({ command, key: `slash-${command.id}` }));
  }, [activeTrigger, slashCommands]);

  const activeOptions =
    activeTrigger?.type === 'mention' ? mentionOptions : slashOptions;

  const closeMenu = useCallback(() => {
    setActiveTrigger(null);
  }, []);

  const selectMentionOption = useCallback(
    (option: MentionOption) => {
      editor.update(() => {
        const match = $getPromptQueryMatch();
        if (!match || match.type !== 'mention') return;

        const item = option.item;
        replaceQueryWithChip(match, {
          id: item.id,
          kind: 'context',
          label: item.label,
          meta: {
            ...(item.meta || {}),
            mentionKind: item.kind,
            value: item.value,
          },
        });
      });
      closeMenu();
    },
    [closeMenu, editor]
  );

  const selectSlashOption = useCallback(
    (option: SlashOption) => {
      let handled = false;

      editor.update(() => {
        const match = $getPromptQueryMatch();
        if (!match || match.type !== 'slash') return;

        handled = runSlashCommand({
          command: option.command,
          currentToolMode: toolMode,
          match,
          onToolModeChange,
        });
      });

      if (handled) closeMenu();
    },
    [closeMenu, editor, onToolModeChange, toolMode]
  );

  const selectActiveOption = useCallback(() => {
    const option = activeOptions[selectedIndex];
    if (!activeTrigger || !option) return false;

    if (activeTrigger.type === 'mention') {
      selectMentionOption(option as MentionOption);
      return true;
    }

    selectSlashOption(option as SlashOption);
    return true;
  }, [
    activeOptions,
    activeTrigger,
    selectMentionOption,
    selectSlashOption,
    selectedIndex,
  ]);

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand<KeyboardEvent>(
          KEY_ARROW_DOWN_COMMAND,
          event => {
            if (!activeTrigger || activeOptions.length === 0) return false;
            event.preventDefault();
            setSelectedIndex(index => (index + 1) % activeOptions.length);
            return true;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand<KeyboardEvent>(
          KEY_ARROW_UP_COMMAND,
          event => {
            if (!activeTrigger || activeOptions.length === 0) return false;
            event.preventDefault();
            setSelectedIndex(
              index => (index - 1 + activeOptions.length) % activeOptions.length
            );
            return true;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand<KeyboardEvent>(
          KEY_ENTER_COMMAND,
          event => {
            if (!activeTrigger || activeOptions.length === 0) return false;
            event.preventDefault();
            return selectActiveOption();
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand<KeyboardEvent>(
          KEY_TAB_COMMAND,
          event => {
            if (!activeTrigger || activeOptions.length === 0) return false;
            event.preventDefault();
            return selectActiveOption();
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand<KeyboardEvent>(
          KEY_ESCAPE_COMMAND,
          event => {
            if (!activeTrigger) return false;
            event.preventDefault();
            closeMenu();
            return true;
          },
          COMMAND_PRIORITY_LOW
        )
      ),
    [
      activeOptions.length,
      activeTrigger,
      closeMenu,
      editor,
      selectActiveOption,
    ]
  );

  if (!activeTrigger) return null;

  if (activeTrigger.type === 'mention') {
    return (
      <div
        aria-label="Mention suggestions"
        className="rte-typeahead-menu rte-mention-panel rte-typeahead-floating"
        role="listbox"
      >
        {mentionKindOrder.map(kind => {
          const options = mentionOptions.filter(option => option.item.kind === kind);
          if (options.length === 0) return null;

          return (
            <section className="rte-typeahead-section" key={kind}>
              <h3>{mentionKindLabels[kind]}</h3>
              <div className="rte-mention-list">
                {options.map(option => {
                  const index = mentionOptions.indexOf(option);
                  const isSelected = selectedIndex === index;

                  return (
                    <button
                      aria-selected={isSelected}
                      className="rte-mention-item"
                      data-selected={isSelected}
                      key={option.key}
                      role="option"
                      type="button"
                      onClick={() => selectMentionOption(option)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span
                        className={`rte-mention-icon rte-mention-icon-${kind}`}
                      >
                        {mentionIcon(kind)}
                      </span>
                      <span>
                        <strong>{option.item.label}</strong>
                        {option.item.description && (
                          <small>{option.item.description}</small>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {mentionOptions.length === 0 && (
          <div className="rte-typeahead-empty">No matching references</div>
        )}
      </div>
    );
  }

  return (
    <div
      aria-label="Slash commands"
      className="rte-typeahead-menu rte-command-menu rte-typeahead-floating"
      role="listbox"
    >
      {slashOptions.map((option, index) => {
        const isSelected = selectedIndex === index;

        return (
          <button
            aria-selected={isSelected}
            className="rte-command-option"
            data-selected={isSelected}
            key={option.key}
            role="option"
            type="button"
            onClick={() => selectSlashOption(option)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <span className="rte-command-token">/</span>
            <span>
              <strong>{option.command.label}</strong>
              {option.command.description && (
                <small>{option.command.description}</small>
              )}
            </span>
          </button>
        );
      })}
      {slashOptions.length === 0 && (
        <div className="rte-typeahead-empty">No matching commands</div>
      )}
    </div>
  );
}
