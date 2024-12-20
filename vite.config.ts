/* eslint-disable @typescript-eslint/no-var-requires */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@page': path.resolve(__dirname, 'src/page'),
      '@libs': path.resolve(__dirname, 'src/libs'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
  server: {
    port: 5173, // Thay đổi cổng sang 3000
  },
});
