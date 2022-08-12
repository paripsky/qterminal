/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import viteCssSplitPlugin from './viteSassSplitPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'QTerminal',
      fileName: (format) => `qterminal.${format}.js`,
    },
  },
  plugins: [
    viteCssSplitPlugin({
      files: ['./themes/default.scss', './themes/80s.scss', './themes/cyber.scss'],
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
