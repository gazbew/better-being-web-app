import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';

// Environment detection
const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: isDev ? true : 'hidden', // Hidden sourcemaps for production debugging
    minify: isProduction ? 'esbuild' : false, // Enable minification in production
    cssMinify: isProduction, // Enable CSS minification in production
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle
          vendor: ['react', 'react-dom'],
          // Router bundle
          router: ['react-router-dom'],
          // UI components bundle
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select'],
          // Animation and utilities
          utils: ['framer-motion', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          // Charts and data visualization
          charts: ['recharts'],
          // Form handling
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // State management
          state: ['zustand', '@tanstack/react-query'],
          // Icons
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false // Skip compressed size reporting for faster builds
  },
  define: { 
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development'),
    __DEV__: isDev
  },
  esbuild: { 
    jsx: "automatic", 
    jsxImportSource: "react",
    drop: isProduction ? ['console', 'debugger'] : [], // Remove console logs in production
    minifyIdentifiers: isProduction,
    minifySyntax: isProduction,
    minifyWhitespace: isProduction
  },
  plugins: [
    react({
      // React optimizations - simplified for better compatibility
      jsxRuntime: 'automatic'
    }),
    
    // Image optimization for critical performance improvement
    ...(isProduction ? [
      viteImagemin({
        gifsicle: { optimizationLevel: 7 },
        mozjpeg: { quality: 85 },
        pngquant: { quality: [0.8, 0.9], speed: 4 },
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeEmptyAttrs', active: false }
          ]
        },
        webp: { quality: 85 },
        avif: { quality: 80 }
      })
    ] : []),

    // PWA capabilities for caching and performance
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Better Being - Wellness Platform',
        short_name: 'Better Being',
        description: 'Premium wellness and health products platform',
        theme_color: '#C1581B',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    }),

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
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ],
    exclude: [
      // Remove all fontsource packages since we're using Google Fonts directly
      '@fontsource/inter', 
      '@fontsource/league-spartan', 
      '@fontsource/montserrat', 
      '@fontsource/open-sans', 
      '@fontsource/playfair-display',
      // Exclude MUI packages if still present
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ]
  },
  server: {
    hmr: isDev,
    open: isDev
  },
};

// Add plugins conditionally
config.plugins.push(tsconfigPaths());

// Add bundle analyzer for production builds with ANALYZE=true
if (isProduction && process.env.ANALYZE) {
  config.plugins.push(
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Don't auto-open in headless environment
      gzipSize: true,
      brotliSize: true,
    })
  );
}

export default defineConfig(config);
