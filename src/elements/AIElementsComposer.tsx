import { forwardRef, ReactNode } from 'react';
import LexicalTapableEditor from '../lexical/LexicalTapableEditor';
import {
  LexicalTapableEditorHandle,
  LexicalTapableEditorProps,
} from '../lexical/types';
import {
  aiElementsMentionSuggestions,
  aiElementsModels,
  aiElementsPromptHistory,
  aiElementsSlashCommands,
  aiElementsToolModes,
} from './presets';
import './styles.css';

export interface AIElementsComposerProps extends LexicalTapableEditorProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
}

export const AIElementsComposer = forwardRef<
  LexicalTapableEditorHandle,
  AIElementsComposerProps
>(function AIElementsComposer(
  {
    className,
    eyebrow = 'AI Elements',
    title = 'Composer',
    description = 'A shadcn-inspired AI input surface with mentions, tools, models, artifacts and structured payloads.',
    headerSlot,
    footerSlot,
    mentionSuggestions = aiElementsMentionSuggestions,
    models = aiElementsModels,
    promptHistory = aiElementsPromptHistory,
    slashCommands = aiElementsSlashCommands,
    toolModes = aiElementsToolModes,
    ...props
  },
  ref
) {
  return (
    <section className="rte-ai-elements">
      <header className="rte-ai-elements-header">
        <div>
          <span className="rte-ai-elements-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {headerSlot && <div className="rte-ai-elements-slot">{headerSlot}</div>}
      </header>
      <LexicalTapableEditor
        {...props}
        className={['rte-ai-elements-editor', className].filter(Boolean).join(' ')}
        mentionSuggestions={mentionSuggestions}
        models={models}
        promptHistory={promptHistory}
        ref={ref}
        slashCommands={slashCommands}
        toolModes={toolModes}
      />
      {footerSlot && <footer className="rte-ai-elements-footer">{footerSlot}</footer>}
    </section>
  );
});

export interface AIElementCatalogItem {
  category?: string;
  id: string;
  title: string;
  description: string;
  tags?: string[];
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

export function AIElementsCatalog({
  items,
}: {
  items?: AIElementCatalogItem[];
}) {
  const catalogItems =
    items ||
    [
      {
        id: 'composer',
        category: 'Surface',
        title: 'AI Composer',
        description: 'Prompt input with mentions, model selector and payload preview.',
        tags: ['input', 'mentions'],
      },
      {
        id: 'agent-console',
        category: 'Runtime',
        title: 'Agent Console',
        description: 'Tool-call lifecycle blocks with approvals, logs and outputs.',
        tags: ['agent', 'tools'],
      },
      {
        id: 'artifact',
        category: 'Block',
        title: 'Artifact Block',
        description: 'Structured AI output that can be edited and serialized.',
        tags: ['artifact', 'schema'],
      },
      {
        id: 'visual-context',
        category: 'Block',
        title: 'Visual Context',
        description: 'Image blocks with alignment, width, caption and alt controls.',
        tags: ['image', 'context'],
      },
      {
        id: 'media-insert',
        category: 'Primitive',
        title: 'Media Insert',
        description: 'File upload, drag-and-drop files and URL image insertion.',
        tags: ['files', 'images'],
      },
      {
        id: 'mention-picker',
        category: 'Primitive',
        title: 'Mention Picker',
        description: 'People, files, folders, context and actions as structured references.',
        tags: ['@', 'references'],
      },
      {
        id: 'payload-inspector',
        category: 'Debug',
        title: 'Payload Inspector',
        description: 'Inspect text, parts, Lexical JSON and portable schema v2.',
        tags: ['payload', 'schema'],
      },
      {
        id: 'reasoning',
        category: 'Block',
        title: 'Reasoning Block',
        description: 'Readable step traces for model thoughts, tool plans or summaries.',
        tags: ['reasoning', 'trace'],
      },
      {
        id: 'task-plan',
        category: 'Block',
        title: 'Task Plan',
        description: 'Track todos, running work, blocked items and completed agent steps.',
        tags: ['plan', 'agent'],
      },
      {
        id: 'sources',
        category: 'Block',
        title: 'Sources and Citations',
        description: 'Source lists and inline citation chips for retrieval-heavy answers.',
        tags: ['sources', 'rag'],
      },
      {
        id: 'runtime-output',
        category: 'Runtime',
        title: 'Terminal and Test Results',
        description: 'Show commands, logs and verification output as first-class UI blocks.',
        tags: ['terminal', 'tests'],
      },
    ];

  return (
    <section className="rte-ai-elements-catalog" aria-label="AI Elements catalog">
      {catalogItems.map(item => (
        <article className="rte-ai-elements-card" key={item.id}>
          {item.category && (
            <span className="rte-ai-elements-card-kicker">{item.category}</span>
          )}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.tags && (
            <div className="rte-ai-elements-tags">
              {item.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

export function AIElementsSystemMap({
  layers,
  principles,
}: {
  layers?: AIElementSystemLayer[];
  principles?: AIElementPrinciple[];
}) {
  const systemLayers =
    layers ||
    [
      {
        id: 'surfaces',
        title: 'Surfaces',
        description: 'Composable entry points for product screens.',
        items: ['Composer', 'Agent Console', 'Artifact Workspace'],
      },
      {
        id: 'primitives',
        title: 'Primitives',
        description: 'Small pieces that can be copied, replaced or rearranged.',
        items: [
          'Mention Picker',
          'Model Select',
          'Tool Mode',
          'History',
          'Attachments',
          'Media Insert',
        ],
      },
      {
        id: 'blocks',
        title: 'Blocks',
        description: 'Structured AI UI units embedded in the document tree.',
        items: [
          'Tool Call',
          'Artifact',
          'Sources',
          'Reasoning',
          'Task Plan',
        ],
      },
      {
        id: 'runtime',
        title: 'Runtime Bridge',
        description: 'Events and schema that connect UI to agents and tools.',
        items: ['Payload Inspector', 'Terminal', 'Test Results', 'Action Events'],
      },
    ];

  const designPrinciples =
    principles ||
    [
      {
        id: 'composable',
        title: 'Composable',
        description: 'Use focused building blocks, not a closed editor box.',
      },
      {
        id: 'simple',
        title: 'Simple',
        description: 'Defaults work immediately; customization stays explicit.',
      },
      {
        id: 'accessible',
        title: 'Accessible',
        description: 'Semantic controls, labels and keyboard-friendly surfaces.',
      },
      {
        id: 'performant',
        title: 'Performant',
        description: 'Static CSS, tree-shakeable exports and runtime boundaries.',
      },
      {
        id: 'typed',
        title: 'Type-first',
        description: 'Payloads, blocks and suggestions carry typed metadata.',
      },
      {
        id: 'shadcn',
        title: 'shadcn-minded',
        description: 'Opinionated defaults that can live inside the app codebase.',
      },
    ];

  return (
    <section className="rte-ai-elements-system" aria-label="AI Elements system map">
      <div className="rte-ai-elements-system-header">
        <span>System</span>
        <h2>AI Elements is a layered UI market, not just one editor.</h2>
        <p>
          The composer preset is only the first surface. The reusable value is a
          set of primitives, blocks, runtime events and portable schema helpers
          that product teams can compose.
        </p>
      </div>
      <div className="rte-ai-elements-layers">
        {systemLayers.map(layer => (
          <article key={layer.id}>
            <h3>{layer.title}</h3>
            <p>{layer.description}</p>
            <ul>
              {layer.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="rte-ai-elements-principles">
        {designPrinciples.map(principle => (
          <article key={principle.id}>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AIElementsComposer;
