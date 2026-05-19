import {
  MentionSuggestion,
  ModelOption,
  ToolModeOption,
} from '../lexical/types';

export const aiElementsToolModes: ToolModeOption[] = [
  { label: 'Chat', value: 'chat' },
  { label: 'Agent', value: 'agent' },
  { label: 'Search', value: 'search' },
  { label: 'Code', value: 'code' },
];

export const aiElementsModels: ModelOption[] = [
  { id: 'fast', label: 'Fast', provider: 'AI Elements' },
  { id: 'reasoning', label: 'Reasoning', provider: 'AI Elements' },
  { id: 'creative', label: 'Creative', provider: 'AI Elements' },
];

export const aiElementsPromptHistory = [
  'Summarize the current workspace and suggest the next action.',
  'Draft an implementation plan from the selected context.',
  'Review the selected files and identify risks.',
];

export const aiElementsMentionSuggestions: MentionSuggestion[] = [
  {
    id: 'person-product',
    kind: 'person',
    label: 'Maya Product',
    description: 'Product owner for roadmap and requirements',
    meta: { role: 'product' },
  },
  {
    id: 'person-engineering',
    kind: 'person',
    label: 'Chen Engineering',
    description: 'Engineering owner for implementation review',
    meta: { role: 'engineering' },
  },
  {
    id: 'person-design',
    kind: 'person',
    label: 'Iris Design',
    description: 'Design reviewer for interaction and UI system',
    meta: { role: 'design' },
  },
  {
    id: 'file-editor',
    kind: 'file',
    label: 'src/lexical/LexicalTapableEditor.tsx',
    description: 'Core editor shell and AI input controls',
  },
  {
    id: 'file-schema',
    kind: 'file',
    label: 'src/schema/portable.ts',
    description: 'Portable schema, migration, importer and exporters',
  },
  {
    id: 'file-demo',
    kind: 'file',
    label: 'src/demo/main.tsx',
    description: 'Playground and AI Elements showcase',
  },
  {
    id: 'folder-elements',
    kind: 'folder',
    label: 'src/elements',
    description: 'shadcn-inspired AI Elements preset components',
  },
  {
    id: 'folder-wiki',
    kind: 'folder',
    label: 'codebase-wiki/reference',
    description: 'Usage docs, API reference and capabilities',
  },
  {
    id: 'action-review',
    kind: 'action',
    label: 'Review context',
    description: 'Ask an agent to inspect selected people, files or folders',
  },
  {
    id: 'action-generate',
    kind: 'action',
    label: 'Generate artifact',
    description: 'Create a structured artifact block from the current prompt',
  },
  {
    id: 'action-implement',
    kind: 'action',
    label: 'Implement task',
    description: 'Start a tool-call block for an implementation agent',
  },
];
