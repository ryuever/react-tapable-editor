export type AIElementCategory =
  | 'Surface'
  | 'Primitive'
  | 'Block'
  | 'Runtime'
  | 'Debug';

export type AIElementMaturity = 'ready' | 'preview' | 'planned';

export interface AIElementCatalogItem {
  category?: AIElementCategory;
  id: string;
  title: string;
  description: string;
  tags?: string[];
  importName?: string;
  docsPath?: string;
  sourcePath?: string;
  maturity?: AIElementMaturity;
}

export interface AIElementSystemLayer {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface AIElementPrinciple {
  id: string;
  title: string;
  description: string;
}

export interface AIElementStat {
  label: string;
  value: string;
  detail: string;
}

export interface AIElementWorkflowStep {
  id: string;
  title: string;
  description: string;
  code?: string;
}

export const aiElementsRegistry: AIElementCatalogItem[] = [
  {
    id: 'composer',
    category: 'Surface',
    title: 'AI Composer',
    description: 'Prompt input with mentions, models, tools and structured payloads.',
    tags: ['input', 'mentions', 'payload'],
    importName: 'AIElementsComposer',
    docsPath: '/components/composer',
    sourcePath: 'src/elements/AIElementsComposer.tsx',
    maturity: 'ready',
  },
  {
    id: 'agent-console',
    category: 'Surface',
    title: 'Agent Console',
    description: 'Tool-call lifecycle surface with approvals, logs and outputs.',
    tags: ['agent', 'tools', 'runtime'],
    importName: 'AIElementsAgentConsole',
    docsPath: '/recipes#coding-agent-console',
    sourcePath: 'src/elements/AIElementsAgentConsole.tsx',
    maturity: 'ready',
  },
  {
    id: 'artifact-workspace',
    category: 'Surface',
    title: 'Artifact Workspace',
    description: 'A document-adjacent space for generated blocks and editable output.',
    tags: ['artifact', 'workspace', 'schema'],
    importName: 'LexicalTapableEditor',
    docsPath: '/blocks',
    sourcePath: 'src/lexical/nodes/AIBlockNode.tsx',
    maturity: 'preview',
  },
  {
    id: 'mention-picker',
    category: 'Primitive',
    title: 'Mention Picker',
    description: 'People, files, folders, context and actions as typed references.',
    tags: ['@', 'references', 'context'],
    importName: 'MentionPicker',
    docsPath: '/components/mention-picker',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'attachment-tray',
    category: 'Primitive',
    title: 'Attachment Tray',
    description: 'Attached files, images and resources with product-controlled removal.',
    tags: ['files', 'images', 'context'],
    importName: 'AttachmentTray',
    docsPath: '/components/attachment-tray',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'media-insert',
    category: 'Primitive',
    title: 'Media Insert',
    description: 'File upload, dropzone and URL image insertion for visual context.',
    tags: ['upload', 'dropzone', 'image'],
    importName: 'ImageInsertPanel',
    docsPath: '/components/media-insert',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'sources',
    category: 'Block',
    title: 'Sources and Citations',
    description: 'Retrieval sources and inline citation chips for grounded answers.',
    tags: ['sources', 'rag', 'citations'],
    importName: 'SourcesBlock',
    docsPath: '/components/sources-citations',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'reasoning',
    category: 'Block',
    title: 'Reasoning Block',
    description: 'Readable summary steps for model reasoning, plans or traces.',
    tags: ['reasoning', 'trace', 'summary'],
    importName: 'ReasoningBlock',
    docsPath: '/components/reasoning',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'task-plan',
    category: 'Block',
    title: 'Task Plan',
    description: 'Todos, active work, blocked items and completed agent steps.',
    tags: ['plan', 'agent', 'status'],
    importName: 'TaskPlanBlock',
    docsPath: '/components/task-plan',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'file-tree',
    category: 'Block',
    title: 'File Tree',
    description: 'Workspace context rendered as a compact tree block.',
    tags: ['workspace', 'files', 'context'],
    importName: 'FileTreeBlock',
    docsPath: '/blocks',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'runtime-output',
    category: 'Runtime',
    title: 'Terminal and Test Results',
    description: 'Commands, logs and verification output as first-class UI blocks.',
    tags: ['terminal', 'tests', 'verification'],
    importName: 'TerminalBlock',
    docsPath: '/components/runtime-output',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
  {
    id: 'payload-inspector',
    category: 'Debug',
    title: 'Payload Inspector',
    description: 'Inspect text, parts, Lexical JSON and portable schema v2.',
    tags: ['payload', 'schema', 'debug'],
    importName: 'PayloadInspector',
    docsPath: '/components/payload-inspector',
    sourcePath: 'src/elements/primitives.tsx',
    maturity: 'ready',
  },
];

export const aiElementsSystemLayers: AIElementSystemLayer[] = [
  {
    id: 'surfaces',
    title: 'Surfaces',
    description: 'Product-level entry points that teams can ship directly.',
    items: ['Composer', 'Agent Console', 'Artifact Workspace'],
  },
  {
    id: 'primitives',
    title: 'Primitives',
    description: 'Small controls that can be copied, replaced or rearranged.',
    items: [
      'Mention Picker',
      'Model Select',
      'Tool Mode',
      'Prompt History',
      'Attachments',
      'Media Insert',
    ],
  },
  {
    id: 'blocks',
    title: 'Blocks',
    description: 'Structured AI UI units for generated output and runtime state.',
    items: ['Tool Call', 'Artifact', 'Sources', 'Reasoning', 'Task Plan'],
  },
  {
    id: 'runtime',
    title: 'Runtime Bridge',
    description: 'Events and schema that connect UI to agents, tools and storage.',
    items: ['Payload Inspector', 'Terminal', 'Test Results', 'Action Events'],
  },
];

export const aiElementsDesignPrinciples: AIElementPrinciple[] = [
  {
    id: 'own-the-code',
    title: 'Own the code',
    description: 'Components are plain React and CSS, designed to live inside a product codebase.',
  },
  {
    id: 'structured',
    title: 'Structure over strings',
    description: 'Mentions, tools, files, artifacts and runtime state stay typed through submit.',
  },
  {
    id: 'preview-first',
    title: 'Preview first',
    description: 'Every meaningful element should have a visible state and a copyable example.',
  },
  {
    id: 'runtime-aware',
    title: 'Runtime aware',
    description: 'Approvals, retries, logs, outputs and tests are product states, not decorations.',
  },
  {
    id: 'composable',
    title: 'Composable',
    description: 'Use the full composer when useful, or assemble primitives and blocks yourself.',
  },
  {
    id: 'agent-ready',
    title: 'Agent-ready',
    description: 'Registry metadata makes the system searchable by docs, humans and future agents.',
  },
];

export const aiElementsSystemStats: AIElementStat[] = [
  {
    label: 'Elements',
    value: `${aiElementsRegistry.length}+`,
    detail: 'surfaces, primitives, blocks and runtime tools',
  },
  {
    label: 'Layers',
    value: `${aiElementsSystemLayers.length}`,
    detail: 'surface, primitive, block and runtime bridge',
  },
  {
    label: 'Schema',
    value: 'v2',
    detail: 'portable document contract for storage and handoff',
  },
  {
    label: 'Kernel',
    value: 'Lexical',
    detail: 'node model, commands and React integration',
  },
];

export const aiElementsWorkflow: AIElementWorkflowStep[] = [
  {
    id: 'pick',
    title: 'Pick a surface',
    description: 'Start with the composer, agent console or artifact workspace shape.',
    code: '<AIElementsComposer />',
  },
  {
    id: 'compose',
    title: 'Compose primitives',
    description: 'Add mentions, models, tool modes, attachments and media controls.',
    code: '<MentionPicker items={items} />',
  },
  {
    id: 'connect',
    title: 'Connect runtime',
    description: 'Submit typed payloads and stream tool state back into blocks.',
    code: 'editorRef.current?.updateAIBlock(payload)',
  },
];
