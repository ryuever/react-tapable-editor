import { defineConfig } from 'vitepress';

const componentSidebar = [
  { text: 'Overview', link: '/components/' },
  { text: 'Composer', link: '/components/composer' },
  { text: 'Agent Console', link: '/components/agent-console' },
  { text: 'Mention Picker', link: '/components/mention-picker' },
  { text: 'Attachment Tray', link: '/components/attachment-tray' },
  { text: 'Media Insert', link: '/components/media-insert' },
  { text: 'Sources & Citations', link: '/components/sources-citations' },
  { text: 'Reasoning', link: '/components/reasoning' },
  { text: 'Task Plan', link: '/components/task-plan' },
  { text: 'Runtime Output', link: '/components/runtime-output' },
  { text: 'Payload Inspector', link: '/components/payload-inspector' },
];

export default defineConfig({
  title: 'React Tapable Editor',
  description: 'AI Elements for Lexical: composable editor surfaces, blocks, runtime UI and portable schema.',
  lang: 'en-US',
  cleanUrls: true,
  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },
    nav: [
      { text: 'Philosophy', link: '/philosophy' },
      { text: 'Gallery', link: '/gallery' },
      { text: 'Components', link: '/components/' },
      { text: 'Blocks', link: '/blocks' },
      { text: 'Runtime', link: '/runtime' },
      { text: 'Recipes', link: '/recipes' },
      { text: 'API', link: '/api' },
    ],
    sidebar: {
      '/components/': [
        {
          text: 'Components',
          items: componentSidebar,
        },
      ],
      '/': [
        {
          text: 'Start',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Philosophy', link: '/philosophy' },
            { text: 'Gallery', link: '/gallery' },
          ],
        },
        {
          text: 'System',
          items: [
            { text: 'Components', link: '/components/' },
            { text: 'Blocks', link: '/blocks' },
            { text: 'Runtime', link: '/runtime' },
            { text: 'Recipes', link: '/recipes' },
            { text: 'API', link: '/api' },
          ],
        },
      ],
    },
    search: { provider: 'local' },
    outline: { label: 'On this page', level: [2, 3] },
    footer: {
      message: 'Composable AI editor primitives for Lexical.',
      copyright: 'MIT Licensed',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ryuever/react-tapable-editor',
      },
    ],
  },
});
