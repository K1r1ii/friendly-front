import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    middlewareMode: true,
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'firebase-messaging-sw.js') {
            return 'firebase-messaging-sw.js';
          }
          return '[name].[hash].[ext]';
        },
      },
    },
  },
});