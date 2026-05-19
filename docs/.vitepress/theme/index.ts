import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import * as previews from './ComponentPreviews';
import './style.css';
import '../../../src/lexical/styles.css';
import '../../../src/elements/styles.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    Object.entries(previews).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
} satisfies Theme;
