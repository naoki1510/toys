# toys

思いついたちょっとした Web アプリの置き場。

各 toy は **`apps/<toy-name>/` で完結**(docs もコードも)。1 つの TanStack Start アプリに合成して `toys.naoki1510.net/<toy-name>` でホストする。

## ドキュメント

- [概要](docs/overview.md) — このリポジトリは何で、何ではないか
- [アーキテクチャ](docs/architecture.md) — リポジトリ構成と toy 同居の仕組み
- [技術スタック](docs/tech-stack.md) — TanStack Start / shadcn/ui / Cloudflare Workers の選定理由
- [開発フロー](docs/development.md) — 日々の開発の進め方
- [デプロイ](docs/deployment.md) — Cloudflare Workers へのデプロイ手順
- [新しい toy を追加する](docs/adding-new-toy.md) — 0 から toy を生やす手順
- [Codex PR レビュー](docs/codex-review.md) — 自動レビュー設定とレビュー指示

## toys 一覧

| 名前 | URL | 概要 | 状態 |
|---|---|---|---|
| [number-calc](apps/number-calc/docs/index.md) | `/number-calc` | 4 桁数字パズル(21 に近づける)の解探索 | 実装済み |

## クイックスタート

```bash
pnpm install
pnpm dev          # ローカル起動 (Vite)
pnpm build        # 本番ビルド
pnpm deploy       # Cloudflare Workers へデプロイ
```

詳細は [開発フロー](docs/development.md) と [デプロイ](docs/deployment.md) を参照。
