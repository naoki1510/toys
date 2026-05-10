# アーキテクチャ

## ディレクトリ構成

```
toys/
├── README.md
├── docs/                            # リポジトリ全体のドキュメント
│   ├── overview.md
│   ├── architecture.md              # ← このファイル
│   ├── tech-stack.md
│   ├── development.md
│   ├── deployment.md
│   └── adding-new-toy.md
│
├── package.json                     # 単一 package。toy 横断で共有
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc                   # Cloudflare Workers 設定
├── components.json                  # shadcn/ui 設定
├── routes.ts                        # 仮想ルート定義 (toy → URL マッピング)
│
├── src/                           # 共通の枠組み (toy ではない)
│   ├── __root.tsx                   # 全 route の共通レイアウト
│   ├── router.tsx                   # createRouter
│   ├── styles.css                   # Tailwind import
│   ├── routeTree.gen.ts             # 自動生成 (.gitignore)
│   ├── routes/
│   │   └── index.tsx                # /  (toy 一覧ページ)
│   ├── components/
│   │   └── ui/                      # shadcn/ui (共有)
│   └── lib/
│       └── utils.ts                 # cn() ヘルパー
│
└── apps/
    └── number-calc/                 # 1 toy = 1 ディレクトリで完結
        ├── docs/
        │   └── index.md             # 仕様書・メモ
        ├── routes/
        │   └── index.tsx            # /number-calc
        ├── components/              # toy 内 colocate
        └── lib/                     # toy 内 colocate
```

## 1 toy = 1 ディレクトリの原則

`apps/<toy-name>/` の中にその toy のすべて(docs, routes, components, lib, etc.)を入れる。toy ディレクトリの外に toy のコードを置かない、toy ディレクトリの中に他の toy のコードを置かない。

| 種類                 | 場所                     |
| -------------------- | ------------------------ |
| 仕様・メモ           | `apps/<toy>/docs/`       |
| URL に紐づくページ   | `apps/<toy>/routes/`     |
| toy 内コンポーネント | `apps/<toy>/components/` |
| toy 内ロジック       | `apps/<toy>/lib/`        |
| toy 内 hooks         | `apps/<toy>/hooks/`      |

## 仮想ルート(virtual file routes)

複数の toy ディレクトリを 1 つのルートツリーに合成するために、TanStack Router の `physical()` を使う。設定は [routes.ts](../routes.ts):

```ts
import { rootRoute, physical } from '@tanstack/virtual-file-routes'

export const routes = rootRoute('src/__root.tsx', [
  physical('/', 'src/routes'),
  physical('/number-calc', 'apps/number-calc/routes'),
])
```

- `rootRoute('src/__root.tsx', ...)` — root layout は src/ に置く
- `physical('/', 'src/routes')` — src/routes/ を `/` 配下に mount(一覧ページ)
- `physical('/number-calc', 'apps/number-calc/routes')` — number-calc を `/number-calc` 配下に mount

vite.config.ts でこの定義を `tanstackStart` プラグインに渡している。`src/routeTree.gen.ts` が自動生成される。

> **補足**: `routes.ts` 内のパスは `routesDirectory` を起点に解決される。デフォルトの `src/routes` 起点だと `apps/<toy>/routes` を指すのに `../../apps/...` のようになって読みづらいので、vite.config.ts で `routesDirectory: '..'`(srcDirectory='src' から見て一つ上＝プロジェクトルート)に変更し、routes.ts ではプロジェクトルート起点のパスを書けるようにしている。

## URL ルール

| ファイル                                      | URL                                 |
| --------------------------------------------- | ----------------------------------- |
| `src/routes/index.tsx`                        | `/`                                 |
| `apps/number-calc/routes/index.tsx`           | `/number-calc`                      |
| `apps/number-calc/routes/about.tsx`           | `/number-calc/about`                |
| `apps/number-calc/routes/-components/Foo.tsx` | route 化されない(`-` prefix で除外) |

createFileRoute の path 文字列は **マウント後の絶対 URL** を書く。例:

```tsx
// apps/number-calc/routes/index.tsx
export const Route = createFileRoute('/number-calc/')({ ... })
```

## 共有するもの・しないもの

| 種類                             | 共有 | 場所                                              |
| -------------------------------- | ---- | ------------------------------------------------- |
| shadcn/ui の primitive           | ✓    | `src/components/ui/`                              |
| Tailwind 設定                    | ✓    | `src/styles.css`(Tailwind v4 は CSS でテーマ定義) |
| `cn()` ヘルパー                  | ✓    | `src/lib/utils.ts`                                |
| 共通レイアウト(html, body, head) | ✓    | `src/__root.tsx`                                  |
| toy 個別のドメインロジック       | ✗    | `apps/<toy>/lib/`                                 |
| toy 個別のコンポーネント         | ✗    | `apps/<toy>/components/`                          |

**早すぎる共通化はしない**。toy 同士で似たコードがあっても、まずは `apps/<toy>/` 内に書く。複数 toy で重複したら `src/` に上げる。

## パスエイリアス

`@/*` は `src/*` に解決される(tsconfig.json `paths` で設定)。

```tsx
// apps/number-calc/routes/index.tsx
import { Button } from '@/components/ui/button' // → src/components/ui/button
import { cn } from '@/lib/utils' // → src/lib/utils
```

toy 内のコードは **相対 import** で参照する(`../lib/solve` など)。toy をまたいだ import は基本やらない(やりたくなったら src/ に上げる)。

## ビルドと配信

```
src/ + apps/* ──[Vite + TanStack Start (virtualRouteConfig)]──▶ .output/ ──[Wrangler]──▶ Cloudflare Workers
                                                                                                  │
                                                                                                  ▼
                                                                                  toys.naoki1510.net/*
```

- Vite が `src/__root.tsx` と `apps/*/routes/**` を 1 つの routeTree に合成
- SSR ビルドが `.output/` に出力される
- `wrangler deploy` で Cloudflare Workers にアップロード
- カスタムドメイン `toys.naoki1510.net` を Worker にバインド

## 将来の拡張余地

- **toy が大きくなりすぎたら**: `apps/<toy>/package.json` を追加して pnpm workspaces で個別 package 化
- **永続化が必要になったら**: VPS にバックエンドを立てて、TanStack Start の Server Functions から `fetch` で呼ぶ
- **toy ごとに Cloudflare Workers を分けたくなったら**: 該当 toy だけ別リポジトリ or 別 Worker に切り出して、Cloudflare の Routes でパス振り分け
