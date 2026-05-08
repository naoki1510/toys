# 新しい toy を追加する

## 1. 命名

URL 安全な kebab-case で名前を決める(例: `number-calc`, `color-picker`, `regex-tester`)。

その名前は以下すべてで同じものを使う:

- `apps/<name>/` のディレクトリ名
- URL パス: `toys.naoki1510.net/<name>`

## 2. ディレクトリを作る

```bash
mkdir -p apps/<name>/{docs,routes,components,lib}
```

## 3. 仕様書を書く(任意)

```bash
$EDITOR apps/<name>/docs/index.md
```

何を作るか、どう動くか、なぜ作るかを書く。テンプレートは決めないが、`apps/number-calc/docs/index.md` を参考にする。

> 仕様書を書くのは推奨だが必須ではない。3 行で済む toy なら省略可。

## 4. ルート(エントリページ)を作る

`apps/<name>/routes/index.tsx`:

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/<name>/')({
  component: <Name>Page,
})

function <Name>Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-neutral-500 hover:text-neutral-900">
          ← Toys
        </Link>
      </nav>
      <h1 className="text-3xl font-bold">&lt;name&gt;</h1>
    </main>
  )
}
```

> `createFileRoute` の path 文字列は **マウント後の絶対 URL**。`/<name>/` (末尾 `/` あり)を指定する。

## 5. routes.ts に登録する

リポジトリルートの [routes.ts](../routes.ts) に 1 行追加:

```ts
export const routes = rootRoute('src/__root.tsx', [
  physical('/', 'src/routes'),
  physical('/number-calc', 'apps/number-calc/routes'),
  physical('/<name>', 'apps/<name>/routes'),   // ← 追加
])
```

## 6. 一覧ページに追加する

`src/routes/index.tsx` の `toys` 配列に entry を追加:

```ts
const toys = [
  // ...
  {
    name: '<name>',
    path: '/<name>',
    description: '1 行説明',
    status: 'WIP',
  },
] as const
```

ルート README.md の Toys 一覧テーブルにも追加する。

## 7. 中身を書く

```
apps/<name>/
├── docs/index.md
├── routes/
│   ├── index.tsx              # /<name>
│   └── about.tsx              # /<name>/about (任意)
├── components/                # toy 内 colocate
│   └── Foo.tsx
└── lib/                       # toy 内 colocate
    ├── core.ts
    └── core.test.ts
```

- toy 内の import は相対パス(`../lib/core`)
- 共通の shadcn / utils は `@/components/ui/...` `@/lib/utils` で参照(`@/` → `src/`)

## 8. 動作確認

```bash
pnpm dev
# http://localhost:5173/<name> にアクセス
```

## 9. デプロイ

```bash
pnpm deploy
```

これで `toys.naoki1510.net/<name>` で公開される。

## ガイドライン

- **早すぎる共通化はしない**。toy 同士で似たコードがあっても、まずは `apps/<name>/` 内に書く。3 つ目で同じものが出たら `src/` に上げる。
- **完成させなくてよい**。WIP のまま push してよい。トップページからリンクするのは動く状態になってから。
- **削除も自由**。要らなくなった toy は `apps/<name>/` ごと削除し、`routes.ts` と一覧から外す。履歴は git に残る。
- **依存追加は気にしない**。toy 単位で軽く動く範囲で増やす。TanStack Router のコード分割で route 単位に分離されるため他 toy の bundle 肥大化は限定的。
