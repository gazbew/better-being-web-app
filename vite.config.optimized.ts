import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from 'vite-plugin-pwa';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Asset optimization configuration
const config = defineConfig({
  plugins: [
    react(),
    
    // PWA for service worker and caching
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheKeyWillBeUsed: async ({ request }) => `${request.url}?version=1`
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    }),

    // Static copy with optimization
    viteStaticCopy({
      targets: [
        { src: "./assets/*", dest: "assets" },
        {
          src: "./public/assets/{*,}",
          dest: path.join("dist", "public/assets"),
        },
        { src: "./assets/*", dest: path.join("dist", "assets") },
      ],
      silent: true,
    }),

    tsconfigPaths(),
  ],

  // Build optimization
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    
    rollupOptions: {
      output: {
        // Asset file naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Code splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    },

    // Compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  },

  // CSS optimization
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            mergeRules: true
          }]
        })
      ]
    }
  },

  // Dev server configuration
  server: {
    port: 3000,
    host: true,
    headers: {
      'Cache-Control': 'max-age=31536000',
    }
  },

  // Asset processing
  assetsInclude: ['**/*.webp', '**/*.avif'],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },

  // Experimental features for better performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `window.__VITE_PRELOAD_MODULE__("${filename}")` }
      } else {
        return { relative: true }
      }
    }
  }
});

export default config;