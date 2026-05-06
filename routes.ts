import { rootRoute, physical } from '@tanstack/virtual-file-routes'

/**
 * 仮想ルート定義 — どの toy が URL のどこに乗るかを宣言する。
 *
 * 新しい toy を追加するときは:
 *   1. apps/<toy-name>/routes/index.tsx を作る
 *   2. ここに physical('/<toy-name>', 'apps/<toy-name>/routes') を 1 行追加
 *
 * src/ は toy ではなく、共通レイアウト + 一覧ページを担う。
 */
export const routes = rootRoute('src/__root.tsx', [
  physical('/', 'src/routes'),
  physical('/number-calc', 'apps/number-calc/routes'),
])
