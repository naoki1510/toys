// `src/routeTree.gen.ts` を vite を介さずに生成する。
// 目的: `pnpm typecheck` を vite build に依存させず単体で走らせるため。
// 出力は `tanstackStart()` (vite plugin) が生成するものと一致させる。
// vite.config.ts や routes.ts を変えたらここも追従させること。

import { Generator, getConfig } from '@tanstack/router-generator'
import { resolve } from 'node:path'

const root = process.cwd()

// `vite.config.ts` の `routesDirectory: '..'` は start plugin 内部で project root に
// 展開される (path.resolve(root, 'src', '..') = root)。ここでは同じ結果を直接渡す。
const generatedRouteTree = resolve(root, 'src', 'routeTree.gen.ts')

// start plugin が `@tanstack/react-start` 用の Register 宣言を footer として追記する
// (`@tanstack/start-plugin-core/.../route-tree-footer.ts` 参照)。SSR まわりの型を
// vite 経由生成と一致させるため、同じブロックをここでも付ける。
const routeTreeFileFooter = [
  [
    "import type { getRouter } from './router.tsx'",
    "import type { createStart } from '@tanstack/react-start'",
    "declare module '@tanstack/react-start' {",
    '  interface Register {',
    '    ssr: true',
    '    router: Awaited<ReturnType<typeof getRouter>>',
    '  }',
    '}',
  ].join('\n'),
]

const config = getConfig(
  {
    routesDirectory: root,
    generatedRouteTree,
    // virtualRouteConfig は root 起点で resolve されるので相対パスで渡す。
    virtualRouteConfig: './routes.ts',
    routeTreeFileFooter,
  },
  root,
)

const generator = new Generator({ config, root })
await generator.run()
