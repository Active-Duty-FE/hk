import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import svgLoader from 'vite-svg-loader'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const envFull = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    plugins: [
      vue(),
      VueDevTools(),
      visualizer({
        template: 'treemap',
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'analyse.html'
      }),
      Components({
        dts: false,
        resolvers: [AntDesignVueResolver()]
      }),
      svgLoader({
        defaultImport: 'component'
      }),
      UnoCSS(),
      createStyleImportPlugin({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`
            }
          }
        ]
      }),
      VitePWA({
        strategies: 'injectManifest',
        injectManifest: {
          swSrc: 'public/sw.js',
          swDest: 'dist/sw.js',
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,ico,png,xml,webp,jpeg,jpg,svg,vue}']
        },
        includeAssets: [], // TODO: add assets
        manifest: {
          name: 'Riman',
          short_name: 'Riman',
          description: `Enhance your RIMAN shopping experience with our convenient, on-the-go app! Immerse yourself in the complete RIMAN digital universe, all at your fingertips.
          Ship and Save
          Create a monthly Autoship Order to earn discounts and reward points on each order, PLUS receive free gifts for every consecutive three months you stay on Autoship!

          Shop by Category
          Effortlessly navigate and explore our diverse RIMAN product profiles through intuitive search, sorting, and filtering options. Discover your favorite items grouped by category, skin concern, and product line, simplifying your shopping journey.

          Find the Perfect Ritual
          Not sure what your skin needs? Not to worry! Take our Skin Quiz, sharing insights into your routine, lifestyle, and skin concerns, and let us curate the ideal RIMAN Ritual tailored just for you.

          Order Management
          Keep tabs on your orders effortlessly. Track order statuses and access tracking information through your personalized My Page within the app.

          Replicated Site Management
          For our dedicated RIMAN Planners, managing your My Bag and Personal Mall is now more convenient than ever. Easily handle your essentials directly from your My Page within the app. Additionally, share your Shopping Link and Enrollment Links with customers to enhance your RIMAN experience.
          `,
          theme_color: '#04263F',
          icons: [
            {
              src: '/pwa-icon/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-icon/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/pwa-icon/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-icon/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          start_url: 'https://riman.com',
          scope: 'https://riman.com',
          lang: 'en',
          orientation: 'portrait',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'browser', 'fullscreen'],
          related_applications: [],
          prefer_related_applications: false,
          shortcuts: [
            {
              name: 'Home',
              url: '/'
            },
            {
              name: 'Specials',
              url: '/product-category/monthly-specials'
            },
            {
              name: 'Orders',
              url: '/my-page/order-history'
            },
            {
              name: 'My page',
              url: '/my-page'
            }
          ],
          categories: ['shopping', 'business']
          // screenshots: [
          //   {
          //     'src': 'screenshot.jpg',
          //     'sizes': '1280x720',
          //     'type': 'image/jpg',
          //     'platform': 'ios, android'
          //   }
          // ]
        },
        manifestFilename: 'manifest.json'
      })
    ],
    define: {
      __APP_ENV__: {
        ...envFull,
        DEV_MODE: mode
      }
    },
    logLevel: 'info',
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@helpers': resolve(__dirname, 'src/helpers'),
        '@assets': resolve(__dirname, 'src/assets')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: envFull.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          ws: true,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      },
      host: '0.0.0.0',
      port: +envFull.VITE_PORT || 3000,
      open: true,
      cors: true
    }
  }
})
