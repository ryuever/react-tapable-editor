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
import {
  aiElementsDesignPrinciples,
  aiElementsRegistry,
  aiElementsSystemLayers,
  aiElementsSystemStats,
  aiElementsWorkflow,
} from './registry';
import type {
  AIElementCategory,
  AIElementCatalogItem,
  AIElementPrinciple,
  AIElementStat,
  AIElementSystemLayer,
  AIElementWorkflowStep,
} from './registry';
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

export type {
  AIElementCategory,
  AIElementCatalogItem,
  AIElementPrinciple,
  AIElementStat,
  AIElementSystemLayer,
  AIElementWorkflowStep,
} from './registry';

const galleryCategories: AIElementCategory[] = [
  'Surface',
  'Primitive',
  'Block',
  'Runtime',
  'Debug',
];

export function AIElementsCatalog({
  items,
}: {
  items?: AIElementCatalogItem[];
}) {
  const catalogItems = items || aiElementsRegistry;

  return (
    <section className="rte-ai-elements-catalog" aria-label="AI Elements catalog">
      {catalogItems.map(item => (
        <article className="rte-ai-elements-card" key={item.id}>
          {item.category && (
            <span className="rte-ai-elements-card-kicker">{item.category}</span>
          )}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {(item.importName || item.maturity) && (
            <div className="rte-ai-elements-meta">
              {item.importName && <code>{item.importName}</code>}
              {item.maturity && (
                <span data-maturity={item.maturity}>{item.maturity}</span>
              )}
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
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

export function AIElementsGallery({
  items,
}: {
  items?: AIElementCatalogItem[];
}) {
  const catalogItems = items || aiElementsRegistry;

  return (
    <section className="rte-ai-elements-gallery" aria-label="AI Elements gallery">
      {galleryCategories.map(category => {
        const categoryItems = catalogItems.filter(item => item.category === category);

        if (categoryItems.length === 0) return null;

        return (
          <section className="rte-ai-elements-gallery-group" key={category}>
            <header>
              <span>{category}</span>
              <h2>{category} elements</h2>
            </header>
            <div className="rte-ai-elements-gallery-grid">
              {categoryItems.map(item => (
                <article className="rte-ai-elements-gallery-card" key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <dl>
                    {item.importName && (
                      <>
                        <dt>Import</dt>
                        <dd>
                          <code>{item.importName}</code>
                        </dd>
                      </>
                    )}
                    {item.docsPath && (
                      <>
                        <dt>Docs</dt>
                        <dd>{item.docsPath}</dd>
                      </>
                    )}
                    {item.sourcePath && (
                      <>
                        <dt>Source</dt>
                        <dd>{item.sourcePath}</dd>
                      </>
                    )}
                  </dl>
                  <div className="rte-ai-elements-tags">
                    {(item.tags || []).map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
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
  const systemLayers = layers || aiElementsSystemLayers;
  const designPrinciples = principles || aiElementsDesignPrinciples;

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

export function AIElementsStats({ stats }: { stats?: AIElementStat[] }) {
  const items = stats || aiElementsSystemStats;

  return (
    <section className="rte-ai-elements-stats" aria-label="AI Elements stats">
      {items.map(item => (
        <article key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function AIElementsWorkflow({
  steps,
}: {
  steps?: AIElementWorkflowStep[];
}) {
  const items = steps || aiElementsWorkflow;

  return (
    <section className="rte-ai-elements-workflow" aria-label="AI Elements workflow">
      {items.map((item, index) => (
        <article key={item.id}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.code && <code>{item.code}</code>}
        </article>
      ))}
    </section>
  );
}

export default AIElementsComposer;
