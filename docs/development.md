# 開発フロー

## 前提

- Node.js 22 以上 (Wrangler v4 の要件)
- pnpm 9 以上
- (デプロイ時のみ) Cloudflare アカウントと `wrangler login` 済み

## 初回セットアップ

```bash
pnpm install
```

## ローカル起動

```bash
pnpm dev
```

- Vite が `http://localhost:5173` で起動
- ファイル保存で HMR
- `apps/<toy>/routes/` や `src/routes/` を更新すると、`src/routeTree.gen.ts` が自動生成される
- `routeTree.gen.ts` は `.gitignore` 済み(コミットしない)
- 新しい toy を追加するときは `routes.ts` への登録が必要。詳細は [新しい toy を追加する](adding-new-toy.md)

## ビルド確認

```bash
pnpm build
pnpm preview
```

`pnpm preview` は本番ビルド成果物をローカルで提供。Cloudflare 環境固有の挙動は検証できないので、それは `wrangler dev` を使う(後述)。

## Cloudflare 環境のローカル再現

```bash
pnpm wrangler dev
```

`wrangler dev` は `workerd`(Cloudflare の本番ランタイム)で `.output/` を起動する。`vite preview` と異なり、Cloudflare 環境の制約(Node API の有無、Bindings 等)が反映される。

ただし基本は `pnpm dev` で十分。デプロイ前に最終チェックする程度で OK。

## shadcn/ui のコンポーネント追加

```bash
pnpm dlx shadcn@latest add button
```

- 生成先: `src/components/ui/button.tsx`
- toy からは `import { Button } from '@/components/ui/button'` で参照できる(`@/` → `src/`)
- 必要に応じて編集してよい(コピペ式なのでロックインなし)

## 新しい toy を追加するとき

[新しい toy を追加する](adding-new-toy.md) を参照。

## 型チェック

```bash
pnpm tsc --noEmit
```

`pnpm build` の中で `tsc --noEmit` も走るので、CI 不要なら build を回せばよい。

## ルーター型生成のリセット

`src/routeTree.gen.ts` がおかしくなったら:

```bash
rm src/routeTree.gen.ts
pnpm dev
```

dev サーバが再生成する。

## デバッグ tips

- TanStack Router の devtools は `src/__root.tsx` で `<TanStackRouterDevtools />` を置けば有効
- React 19 のエラー境界は `src/__root.tsx` の `errorComponent` で受ける
- Cloudflare Workers のログは `wrangler tail` でリアルタイム確認
