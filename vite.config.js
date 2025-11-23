import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import { creaoPlugins } from "./config/vite/creao-plugin.mjs";
import basicSsl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
// Production optimizations
const productionPlugins = [
  visualizer({
    open: false,
    filename: 'dist/stats.html',
    gzipSize: true,
    brotliSize: true,
    template: 'treemap',
  }),
];

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: env.TENANT_ID ? `/${env.TENANT_ID}/` : "/",
    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV),
      "import.meta.env.TENANT_ID": JSON.stringify(env.TENANT_ID || ""),
    },
    plugins: [
      ...creaoPlugins(),
      TanStackRouterVite({
        autoCodeSplitting: true,
        routeFileIgnorePrefix: 'ignored-',
        routes: 'src/pages',
      }),
      viteReact({
        jsxRuntime: "automatic",
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
            'babel-plugin-macros',
          ],
        },
      }),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
      tailwindcss(),
      basicSsl(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Super Casino Platform',
            description: 'Experience the ultimate online casino gaming platform',
          },
        },
      }),
      isProduction && productionPlugins,
    ].filter(Boolean),
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: './src/test/setup.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '~': resolve(__dirname, './'),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      https: true,
      hmr: {
        protocol: 'wss',
        clientPort: 443
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://api.casino-platform.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/socket': {
          target: env.VITE_WS_URL || 'wss://ws.casino-platform.com',
          ws: true,
          changeOrigin: true,
        },
      },
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.casino-platform.com wss://ws.casino-platform.com;"
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('tailwind-merge')) {
                return 'vendor-ui';
              }
              if (id.includes('lodash') || id.includes('date-fns') || id.includes('zod')) {
                return 'vendor-utils';
              }
              return 'vendor';
            }
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  };
});
