import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const externalPackages = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'lexical',
  '@lexical/code',
  '@lexical/link',
  '@lexical/list',
  '@lexical/markdown',
  '@lexical/react',
  '@lexical/rich-text',
  '@lexical/selection',
  'yjs',
];

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/index.tsx'),
      name: 'ReactTapableEditor',
      formats: ['es', 'cjs'],
      fileName: format =>
        format === 'es'
          ? 'react-tapable-editor.mjs'
          : 'react-tapable-editor.cjs',
    },
    rollupOptions: {
      external: id =>
        externalPackages.some(pkg => id === pkg || id.startsWith(`${pkg}/`)),
      output: {
        exports: 'named',
        assetFileNames: assetInfo =>
          assetInfo.name === 'style.css'
            ? 'react-tapable-editor.css'
            : '[name][extname]',
      },
    },
  },
});
