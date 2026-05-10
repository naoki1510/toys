# 技術スタック

| レイヤ               | 技術                     | バージョン目安    |
| -------------------- | ------------------------ | ----------------- |
| 言語                 | TypeScript               | 5.x               |
| フレームワーク       | TanStack Start (React)   | 1.x               |
| ルーター             | TanStack Router          | 1.x(Start に同梱) |
| UI ランタイム        | React                    | 19                |
| スタイル             | Tailwind CSS             | 4.x               |
| UI コンポーネント    | shadcn/ui (Radix ベース) | 最新              |
| アイコン             | lucide-react             | 最新              |
| ビルド               | Vite                     | 7.x               |
| ホスティング         | Cloudflare Workers       | —                 |
| ホスティング CLI     | Wrangler                 | 4.x               |
| パッケージマネージャ | pnpm                     | 9.x               |

## 各選定の理由

### TanStack Start (React)

- **ファイルベースルーティングが強力**。route と layout、loader、search params の型がすべてファイル構成から自動生成される
- **Cloudflare Workers が公式の deploy ターゲット**(`@cloudflare/vite-plugin`)
- **SSR/Server Functions が標準装備**。最初は使わなくても、後で API 的なものが欲しくなったら同じ repo 内に書ける
- React Server Components のような巻き込まれ案件と距離を取れる(Vite ベースで素直)

採用しない選択肢:

- **Next.js**: Cloudflare Workers サポートが OpenNext 経由で間接的。フルファットすぎる
- **Astro**: ページ単位のアプリには良いが、toy が SPA 的になることも想定すると React 一本のほうが楽
- **SvelteKit / Solid Start**: React 知見をそのまま使いたいので外す

### shadcn/ui

- **コピペで取り込む**ライブラリなので、依存先のバージョン地獄が発生しない
- 必要なコンポーネントだけ `src/components/ui/` に追加する
- Radix ベースなのでアクセシビリティの最低保証がある
- toy 用途で Material UI / Chakra のようなフルフレームを引きずり込むのは過剰

### Tailwind CSS v4

- v4 から **CSS ファイルでテーマ定義**(`@theme`)、設定ファイル不要
- `@tailwindcss/vite` プラグインを入れるだけ
- shadcn/ui v2 系が Tailwind v4 を前提にしている

### Cloudflare Workers (Pages ではなく)

- **TanStack Start の SSR/Server Functions を活かすなら Workers**
- Pages は静的中心で、Functions が後付けに見えるので避ける
- 静的 HTML でも Workers は十分速い
- カスタムドメイン(`toys.naoki1510.net`)を Workers に直接バインドできる

### pnpm

- ディスク効率がよく、`node_modules` の挙動が厳密(undeclared 依存に気づきやすい)
- 将来 monorepo 化したくなった場合に workspaces への移行が楽

## バージョン管理ポリシー

- 個人の遊び場なので、依存はためらわず上げる
- 互換性を壊す更新が来ても、影響を受ける toy だけ直せばよい(toy はそもそも壊れていてよい)
- セキュリティ警告は対応する(Cloudflare Workers に乗っているので一応)
