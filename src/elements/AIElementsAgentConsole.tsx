import { forwardRef, ReactNode, useState } from 'react';
import {
  LexicalTapableEditorHandle,
  PromptInputPayload,
} from '../lexical/types';
import { AIElementsComposer, AIElementsComposerProps } from './AIElementsComposer';
import {
  FileTreeBlock,
  FileTreeItem,
  PayloadInspector,
  SourceItem,
  SourcesBlock,
  TaskPlanBlock,
  TaskPlanItem,
  TerminalBlock,
  TestResultItem,
  TestResultsBlock,
} from './primitives';

export interface AIElementsAgentConsoleProps extends AIElementsComposerProps {
  fileTree?: FileTreeItem[];
  inspector?: boolean;
  runtimeSlot?: ReactNode;
  sidebarSlot?: ReactNode;
  sources?: SourceItem[];
  tasks?: TaskPlanItem[];
  terminal?: {
    command: string;
    output?: string;
    status?: 'idle' | 'running' | 'success' | 'error';
  };
  testResults?: TestResultItem[];
}

const defaultTasks: TaskPlanItem[] = [
  { id: 'context', title: 'Read selected context and attachments', status: 'done' },
  { id: 'plan', title: 'Plan implementation steps', status: 'doing' },
  { id: 'verify', title: 'Run focused verification', status: 'todo' },
];

const defaultSources: SourceItem[] = [
  {
    id: 'repo',
    title: 'Repository context',
    description: 'Selected files, docs and runtime payload metadata.',
  },
  {
    id: 'api',
    title: 'API contract',
    description: 'Typed payload, portable schema and action events.',
  },
];

const defaultFileTree: FileTreeItem[] = [
  { id: 'src', name: 'src', kind: 'folder' },
  { id: 'elements', name: 'elements', kind: 'folder', depth: 1 },
  { id: 'composer', name: 'AIElementsComposer.tsx', kind: 'file', depth: 2 },
  { id: 'runtime', name: 'prompt-input', kind: 'folder', depth: 1 },
];

const defaultTerminal = {
  command: 'npm run release:check',
  output: 'build pending\ndocs pending\nverification waiting',
  status: 'running' as const,
};

const defaultTestResults: TestResultItem[] = [
  { id: 'types', name: 'Type declarations', status: 'passed', duration: '0.8s' },
  { id: 'docs', name: 'Docs build', status: 'passed', duration: '2.4s' },
  { id: 'e2e', name: 'Agent workflow e2e', status: 'skipped' },
];

export const AIElementsAgentConsole = forwardRef<
  LexicalTapableEditorHandle,
  AIElementsAgentConsoleProps
>(function AIElementsAgentConsole(
  {
    className,
    description = 'A product-ready agent surface with context, plans, runtime output and payload inspection.',
    eyebrow = 'AI Elements',
    fileTree = defaultFileTree,
    inspector = true,
    onChange,
    onSubmit,
    runtimeSlot,
    sidebarSlot,
    sources = defaultSources,
    tasks = defaultTasks,
    terminal = defaultTerminal,
    testResults = defaultTestResults,
    title = 'Agent Console',
    ...props
  },
  ref
) {
  const [payload, setPayload] = useState<PromptInputPayload | null>(null);

  function handlePayload(nextPayload: PromptInputPayload) {
    setPayload(nextPayload);
    onChange?.(nextPayload);
  }

  function handleSubmit(nextPayload: PromptInputPayload) {
    setPayload(nextPayload);
    onSubmit?.(nextPayload);
  }

  return (
    <section className="rte-agent-console">
      <div className="rte-agent-console-main">
        <AIElementsComposer
          {...props}
          className={['rte-agent-console-composer', className]
            .filter(Boolean)
            .join(' ')}
          description={description}
          eyebrow={eyebrow}
          onChange={handlePayload}
          onSubmit={handleSubmit}
          ref={ref}
          title={title}
        />
        <div className="rte-agent-console-runtime">
          {runtimeSlot || (
            <>
              <TerminalBlock {...terminal} />
              <TestResultsBlock results={testResults} />
            </>
          )}
        </div>
      </div>
      <aside className="rte-agent-console-side" aria-label="Agent console context">
        {sidebarSlot || (
          <>
            <TaskPlanBlock tasks={tasks} />
            <SourcesBlock sources={sources} />
            <FileTreeBlock items={fileTree} />
            {inspector && <PayloadInspector payload={payload} />}
          </>
        )}
      </aside>
    </section>
  );
});

export default AIElementsAgentConsole;
