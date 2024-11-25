import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // proxy: {
    //   '/api': {
    //     target: `http://0.0.0.0:${process.env.VITE_API_PORT}`,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     secure: false,
    //   },
    //   '/media': {
    //     target: `http://0.0.0.0:${process.env.VITE_MEDIA_STORE_PORT}`,
    //     changeOrigin: true,
    //     rewrite: (path) => path,
    //     secure: false,
    //   },
    // },
  },
  resolve: {
    alias: {
      src: resolve('src/'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
