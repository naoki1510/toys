import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    tsconfigPaths(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      router: {
        // virtualRouteConfig 内のパスは routesDirectory を起点に解決される。
        // routes.ts でプロジェクトルート起点のパス (`src/routes`, `apps/<toy>/routes`)
        // を書きたいので、routesDirectory をプロジェクトルートに合わせる。
        routesDirectory: '..',
        virtualRouteConfig: './routes.ts',
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
})
