import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  LexicalEditor,
} from 'lexical';
import {
  INSERT_AI_BLOCK_COMMAND,
  INSERT_AI_CHIP_COMMAND,
  INSERT_IMAGE_COMMAND,
  UPDATE_AI_BLOCK_COMMAND,
  UPDATE_IMAGE_COMMAND,
} from './commands';
import {
  AIBlockActionContext,
  setAIBlockActionHandler,
} from './AIBlockActionContext';
import { AIBlockNode } from './nodes/AIBlockNode';
import { AIChipNode } from './nodes/AIChipNode';
import { ImageNode } from './nodes/ImageNode';
import { createPromptPayload } from './payload';
import AICommandsPlugin from './plugins/AICommandsPlugin';
import RegisterEditorPlugin from './plugins/RegisterEditorPlugin';
import SubmitOnModEnterPlugin from './plugins/SubmitOnModEnterPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import theme from './theme';
import {
  EmptySubmitPolicy,
  LexicalTapableEditorHandle,
  LexicalTapableEditorProps,
  PromptInputPayload,
  ToolMode,
  ToolModeOption,
} from './types';
import './styles.css';

const defaultToolModes: ToolModeOption[] = [
  { label: 'Chat', value: 'chat' },
  { label: 'Agent', value: 'agent' },
  { label: 'Search', value: 'search' },
  { label: 'Code', value: 'code' },
];

const EmptyPlaceholder = ({ text }: { text: string }) => (
  <div className="rte-placeholder">{text}</div>
);

function onError(error: Error) {
  throw error;
}

function canSubmitPayload(
  policy: EmptySubmitPolicy,
  payload: PromptInputPayload
) {
  if (policy === 'allow') return true;

  const hasText = payload.text.trim().length > 0;
  if (policy === 'block') return hasText;

  return hasText || payload.parts.length > 0;
}

export const LexicalTapableEditor = forwardRef<
  LexicalTapableEditorHandle,
  LexicalTapableEditorProps
>(function LexicalTapableEditor(
  {
    autoFocus = false,
    className,
    context = [],
    attachments = [],
    defaultToolMode = 'chat',
    toolModes = defaultToolModes,
    defaultModelId,
    editable = true,
    emptySubmitPolicy = 'allow-structured',
    models = [],
    placeholder = 'Ask, draft, rewrite, or plan...',
    promptHistory = [],
    submitLabel = 'Send',
    onAttachmentUpload,
    onChange,
    onAIBlockAction,
    onEmptySubmitBlocked,
    onModelChange,
    onSubmit,
    onToolModeChange,
  },
  ref
) {
  const editorRef = useRef<LexicalEditor | null>(null);
  const latestEditorStateRef = useRef<EditorState | null>(null);
  const [currentPayload, setCurrentPayload] =
    useState<PromptInputPayload | null>(null);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [contextPickerOpen, setContextPickerOpen] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [uploadedAttachments, setUploadedAttachments] = useState<
    typeof attachments
  >([]);
  const [selectedModelId, setSelectedModelId] = useState(
    defaultModelId || models[0]?.id || ''
  );
  const [toolMode, setToolMode] = useState<ToolMode>(defaultToolMode);

  useEffect(() => {
    setAIBlockActionHandler(onAIBlockAction || null);
    return () => setAIBlockActionHandler(null);
  }, [onAIBlockAction]);

  const initialConfig = useMemo(
    () => ({
      namespace: 'react-tapable-editor',
      editable,
      theme,
      onError,
      nodes: [
        AutoLinkNode,
        AIBlockNode,
        AIChipNode,
        CodeHighlightNode,
        CodeNode,
        HeadingNode,
        ImageNode,
        LinkNode,
        ListItemNode,
        ListNode,
        QuoteNode,
      ],
    }),
    [editable]
  );

  const buildPayload = useCallback(
    (editorState: EditorState): PromptInputPayload =>
      createPromptPayload(
        editorState,
        context,
        attachments.concat(uploadedAttachments),
        toolMode,
        models.find(model => model.id === selectedModelId)
      ),
    [attachments, context, models, selectedModelId, toolMode, uploadedAttachments]
  );

  const handleChange = useCallback(
    (editorState: EditorState) => {
      latestEditorStateRef.current = editorState;
      const payload = buildPayload(editorState);
      setCurrentPayload(payload);
      onChange?.(payload);
    },
    [buildPayload, onChange]
  );

  const handleSubmit = useCallback(() => {
    const editorState =
      latestEditorStateRef.current || editorRef.current?.getEditorState();
    if (!editorState) return;
    const payload = buildPayload(editorState);
    if (!canSubmitPayload(emptySubmitPolicy, payload)) {
      onEmptySubmitBlocked?.(payload);
      return;
    }
    onSubmit?.(payload);
  }, [buildPayload, emptySubmitPolicy, onEmptySubmitBlocked, onSubmit]);

  const handleToolModeChange = useCallback(
    (nextMode: ToolMode) => {
      setToolMode(nextMode);
      onToolModeChange?.(nextMode);
    },
    [onToolModeChange]
  );

  const insertContext = useCallback((item: (typeof context)[number]) => {
    editorRef.current?.dispatchCommand(INSERT_AI_CHIP_COMMAND, {
      id: item.id,
      kind: 'context',
      label: item.label,
      meta: {
        type: item.type,
        value: item.value,
      },
    });
  }, []);

  const availableAttachments = attachments.concat(uploadedAttachments);

  const insertAttachment = useCallback(
    (item: (typeof availableAttachments)[number]) => {
      editorRef.current?.dispatchCommand(INSERT_AI_CHIP_COMMAND, {
        id: item.id,
        kind: 'attachment',
        label: item.name,
        meta: {
          type: item.type,
          url: item.url,
          value: item.value,
        },
      });
    },
    []
  );

  const insertPlainText = useCallback((text: string) => {
    editorRef.current?.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(text));
      root.append(paragraph);
    });
  }, []);

  const movePromptHistory = useCallback(
    (direction: -1 | 1) => {
      if (promptHistory.length === 0) return;
      const nextIndex =
        historyIndex < 0
          ? direction < 0
            ? promptHistory.length - 1
            : 0
          : Math.min(
              promptHistory.length - 1,
              Math.max(0, historyIndex + direction)
            );
      setHistoryIndex(nextIndex);
      insertPlainText(promptHistory[nextIndex]);
    },
    [historyIndex, insertPlainText, promptHistory]
  );

  const handleAttachmentFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const nextAttachments: typeof attachments = [];

      for (const file of Array.from(files)) {
        const uploaded = onAttachmentUpload
          ? await onAttachmentUpload(file)
          : {
              id: `upload-${file.name}-${file.lastModified}`,
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file),
              value: {
                size: file.size,
              },
            };
        nextAttachments.push(uploaded);
        insertAttachment(uploaded);
      }

      setUploadedAttachments(current => current.concat(nextAttachments));
    },
    [insertAttachment, onAttachmentUpload]
  );

  const selectModel = useCallback(
    (modelId: string) => {
      setSelectedModelId(modelId);
      onModelChange?.(models.find(model => model.id === modelId));
    },
    [models, onModelChange]
  );

  const insertToolCall = useCallback(() => {
    editorRef.current?.dispatchCommand(INSERT_AI_CHIP_COMMAND, {
      id: `tool-${toolMode}`,
      kind: 'tool',
      label: toolMode,
      meta: { mode: toolMode },
    });
  }, [toolMode]);

  const insertToolBlock = useCallback(() => {
    editorRef.current?.dispatchCommand(INSERT_AI_BLOCK_COMMAND, {
      id: `tool-block-${toolMode}-${Date.now()}`,
      kind: 'tool-call',
      title: `${toolMode} tool call`,
      status: 'approval-required',
      content: `Ready to run ${toolMode}.`,
      meta: { mode: toolMode },
    });
  }, [toolMode]);

  const insertArtifactBlock = useCallback(() => {
    editorRef.current?.dispatchCommand(INSERT_AI_BLOCK_COMMAND, {
      id: `artifact-${Date.now()}`,
      kind: 'artifact',
      title: 'Artifact',
      status: 'idle',
      content: 'Structured AI output will appear here.',
      meta: { source: 'editor' },
    });
  }, []);

  const insertImageBlock = useCallback(() => {
    const src = window.prompt('Image URL');
    if (!src) return;
    const width = window.prompt('Image width', '100%') || '100%';
    const alignment = window.prompt('Alignment: left, center, right, full', 'center');

    editorRef.current?.dispatchCommand(INSERT_IMAGE_COMMAND, {
      id: `image-${Date.now()}`,
      src,
      alignment:
        alignment === 'left' ||
        alignment === 'right' ||
        alignment === 'full' ||
        alignment === 'center'
          ? alignment
          : 'center',
      alt: 'Image',
      caption: 'Image',
      width,
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        editorRef.current?.focus();
      },

      getEditor() {
        return editorRef.current;
      },

      getPayload() {
        const editorState =
          latestEditorStateRef.current || editorRef.current?.getEditorState();
        if (!editorState) return null;
        return buildPayload(editorState);
      },

      insertAIBlock(payload) {
        editorRef.current?.dispatchCommand(INSERT_AI_BLOCK_COMMAND, payload);
      },

      insertAIChip(payload) {
        editorRef.current?.dispatchCommand(INSERT_AI_CHIP_COMMAND, payload);
      },

      insertImage(payload) {
        editorRef.current?.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
      },

      updateAIBlock(payload) {
        editorRef.current?.dispatchCommand(UPDATE_AI_BLOCK_COMMAND, payload);
      },

      updateImage(payload) {
        editorRef.current?.dispatchCommand(UPDATE_IMAGE_COMMAND, payload);
      },
    }),
    [buildPayload, ref]
  );

  const isSubmitDisabled =
    !currentPayload || !canSubmitPayload(emptySubmitPolicy, currentPayload);

  return (
    <AIBlockActionContext.Provider value={onAIBlockAction || null}>
      <LexicalComposer initialConfig={initialConfig}>
        <section className={['rte-root', className].filter(Boolean).join(' ')}>
        <ToolbarPlugin />

        <div className="rte-ai-strip">
          <div className="rte-tool-modes" aria-label="AI mode">
            {toolModes.map(mode => (
              <button
                className={
                  mode.value === toolMode
                    ? 'rte-tool-mode rte-tool-mode-active'
                    : 'rte-tool-mode'
                }
                key={mode.value}
                type="button"
                onClick={() => handleToolModeChange(mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="rte-input-tools" aria-label="AI input tools">
            <button
              className="rte-chip rte-chip-tool"
              type="button"
              onClick={() => setCommandMenuOpen(open => !open)}
            >
              /
            </button>
            <button
              className="rte-chip"
              type="button"
              onClick={() => setContextPickerOpen(open => !open)}
            >
              @
            </button>
            <label className="rte-chip rte-chip-attachment">
              +
              <input
                multiple
                type="file"
                onChange={event => {
                  void handleAttachmentFiles(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
            {promptHistory.length > 0 && (
              <>
                <button
                  className="rte-chip"
                  type="button"
                  onClick={() => movePromptHistory(-1)}
                >
                  History prev
                </button>
                <button
                  className="rte-chip"
                  type="button"
                  onClick={() => movePromptHistory(1)}
                >
                  History next
                </button>
              </>
            )}
            {models.length > 0 && (
              <select
                aria-label="AI model"
                className="rte-model-select"
                value={selectedModelId}
                onChange={event => selectModel(event.target.value)}
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.provider ? `${model.provider} / ` : ''}
                    {model.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {commandMenuOpen && (
            <div className="rte-command-menu" aria-label="Slash menu">
              <button type="button" onClick={insertToolCall}>
                Insert /{toolMode} tool chip
              </button>
              <button type="button" onClick={insertArtifactBlock}>
                Insert artifact block
              </button>
              <button type="button" onClick={insertToolBlock}>
                Insert tool-call block
              </button>
              <button type="button" onClick={insertImageBlock}>
                Insert image block
              </button>
            </div>
          )}

          {contextPickerOpen && context.length > 0 && (
            <div className="rte-chip-row" aria-label="Context">
              {context.map(item => (
                <button
                  className="rte-chip"
                  key={item.id}
                  type="button"
                  onClick={() => insertContext(item)}
                >
                  @{item.label}
                </button>
              ))}
            </div>
          )}

          {availableAttachments.length > 0 && (
            <div className="rte-chip-row" aria-label="Attachments">
              {availableAttachments.map(item => (
                <button
                  className="rte-chip rte-chip-attachment"
                  key={item.id}
                  type="button"
                  onClick={() => insertAttachment(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

        </div>

        <div className="rte-editor-shell">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label="AI editor input"
                className="rte-content-editable"
              />
            }
            placeholder={<EmptyPlaceholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <AICommandsPlugin />
          <OnChangePlugin onChange={handleChange} />
          <RegisterEditorPlugin
            onReady={editor => {
              editorRef.current = editor;
              const editorState = editor.getEditorState();
              latestEditorStateRef.current = editorState;
              setCurrentPayload(buildPayload(editorState));
            }}
          />
          <SubmitOnModEnterPlugin onSubmit={handleSubmit} />
          {autoFocus && <AutoFocusPlugin />}
        </div>

        <div className="rte-footer">
          <span className="rte-footer-hint">Cmd/Ctrl + Enter</span>
          <button
            className="rte-submit"
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {submitLabel}
          </button>
        </div>
        </section>
      </LexicalComposer>
    </AIBlockActionContext.Provider>
  );
});

export default LexicalTapableEditor;
