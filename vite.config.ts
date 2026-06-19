import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/extension.ts'),
      formats: ['cjs'],
      fileName: () => 'extension.js',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vscode'],
    },
    sourcemap: true,
    minify: false,
  },
});
