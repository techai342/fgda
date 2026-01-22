[file name]: vite.config.js
[file content begin]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Management Portal',
        short_name: 'Management',
        description: 'Tournament Management Control Panel',
        theme_color: '#000000',
        icons: [
          {
            src: 'https://ik.imagekit.io/shaban/SHABAN-1769057701316_BszrYcha1.jpg',
            sizes: '192x192',
            type: 'image/jpg'
          },
          {
            src: 'https://ik.imagekit.io/shaban/SHABAN-1769057701316_BszrYcha1.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}']
      }
    })
  ],
  server: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
[file content end]
