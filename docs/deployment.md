# デプロイ

## デプロイ先

- **Cloudflare Workers**(1 つの Worker に全 toy が相乗り)
- カスタムドメイン: `toys.naoki1510.net`
- すべての toy は `toys.naoki1510.net/<toy-name>` でアクセスされる

## 初回セットアップ

### 1. Cloudflare アカウント認証

```bash
pnpm dlx wrangler login
```

ブラウザが開くので Cloudflare アカウントで認証する。`~/.config/.wrangler/config/default.toml` に credentials が保存される。

### 2. カスタムドメインの設定

`wrangler.jsonc` の `routes` で宣言済み。`naoki1510.net` Zone が同じ CF アカウントにある前提で、deploy 時に Cloudflare 側で DNS レコードと Custom Domain trigger が自動作成される。

```jsonc
"routes": [
  { "pattern": "toys.naoki1510.net", "custom_domain": true }
]
```

ダッシュボード操作は不要。

### 3. 初回デプロイ

```bash
pnpm deploy
```

これは内部で `pnpm build && wrangler deploy` を実行する。

## 通常のデプロイ

```bash
pnpm deploy
```

それだけ。

## デプロイ後の確認

```bash
pnpm wrangler tail        # ライブログ
curl https://toys.naoki1510.net/        # 一覧ページが返る
curl https://toys.naoki1510.net/number-calc  # toy のページが返る
```

## ロールバック

```bash
pnpm wrangler rollback
```

直前のバージョンに戻せる。Cloudflare ダッシュボードからもバージョン履歴を選んでロールバック可能。

## デプロイで壊したくない toy がある場合

このリポジトリは「全 toy が同居していて、1 回のデプロイで全部更新される」構造なので、**個別 toy だけのデプロイ**はできない。

代わりに以下のいずれか:

- 壊しそうな変更は **feature branch** で作業して、本番にマージしない
- 完成度に応じて toy ごとに `<toy-name>/.draft` のようなフラグファイルを置き、`__root.tsx` で読み取って 404 を返す(必要になったら実装)
- どうしても分離したいくらい大きくなったら、その toy だけ別 Worker に切り出す

## シークレットの扱い

現状なし。必要になった場合:

```bash
pnpm wrangler secret put MY_API_KEY
```

`process.env.MY_API_KEY` または Workers の `env` から参照。**`.env` ファイルにシークレットを書いてコミットしないこと**。

## 環境

- **production**: `toys.naoki1510.net`(`pnpm deploy`)
- **staging**: 用意しない。気になる変更はローカルで `wrangler dev` する
