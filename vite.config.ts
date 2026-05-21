import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

function appTsxLoader() {
  return {
    name: 'app-tsx-loader',
    enforce: 'pre' as const,
    async transform(code: string, id: string) {
      if (
        id.endsWith(`${path.sep}app.ts`) ||
        id.endsWith(`${path.sep}src${path.sep}app.ts`) ||
        id === 'app.ts'
      ) {
        return transformWithEsbuild(code, id, {
          loader: 'tsx',
          jsx: 'automatic'
        });
      }
      return null;
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [appTsxLoader(), react()],
  server: {
    host: '0.0.0.0'
  }
});
