import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

const toUrl = (value?: string | null) => {
  if (!value) {
    return null
  }

  try {
    return new URL(value)
  } catch {
    console.warn('VitePWA runtime caching skipped for invalid URL', value)
    return null
  }
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildPrefixPattern = (target: URL) => {
  const normalizedPath = target.pathname.endsWith('/') ? target.pathname : `${target.pathname}/`
  return new RegExp(`^${escapeRegex(`${target.origin}${normalizedPath}`)}`)
}

type RuntimeCaching = NonNullable<NonNullable<VitePWAOptions['workbox']>['runtimeCaching']>

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredBase = env.VITE_PUBLIC_PATH ?? '/'
  const isDev = mode === 'development'
  const publicPath = isDev ? '/' : configuredBase
  const enableDevSW = env.VITE_ENABLE_PWA_DEV === 'true'
  const manifestStart = publicPath === '/' ? '.' : publicPath

  const runtimeCaching: RuntimeCaching = []
  const apiUrl = toUrl(env.VITE_API_BASE_URL)
  const storageUrl = toUrl(env.VITE_STORAGE_BASE_URL)

  if (apiUrl) {
    runtimeCaching.push({
      urlPattern: buildPrefixPattern(apiUrl),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache-v1',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60,
        },
      },
    })
  }

  if (storageUrl) {
    runtimeCaching.push({
      urlPattern: buildPrefixPattern(storageUrl),
      handler: 'CacheFirst',
      options: {
        cacheName: 'media-cache-v1',
        expiration: {
          maxEntries: 40,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    })
  }

  return {
    base: publicPath,
    plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/pwa-192.png', 'icons/pwa-512.png', 'cart.png', 'rectangle-2-6.png'],
      devOptions: { enabled: enableDevSW },
      manifest: {
        name: 'LicenseCalc Licenses',
        short_name: 'RIP Licenses',
        description: 'Каталог моделей лицензирования LicenseCalc c PWA и Tauri-шеллом',
        start_url: manifestStart,
        scope: publicPath,
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#ffcd00',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        categories: ['business', 'productivity'],
        lang: 'ru-RU'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching
      }
    })
    ],
    server: {
      https: {},
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
      watch: {
        usePolling: true,
      },
      host: true,
      strictPort: true,
      port: 3000,
    },
    preview: {
      https: {},
    },
  }
})
