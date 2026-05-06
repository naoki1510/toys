# 概要

## このリポジトリの位置づけ

`toys` は、思いついたちょっとした Web アプリ(以下「toy」)を雑に並べる個人用の置き場。

- 1 つの toy = 1 つのページ(または小さな SPA)
- 完成度や継続性は問わない。書き捨ても可
- 完全に外向きに公開される(`toys.naoki1510.net/<toy-name>`)
- 認証もログも分析も入れない。アクセスは「URL を知っている人だけ」

## このリポジトリ"ではない"もの

- ❌ プロダクト開発の練習場ではない(品質目標を持たない)
- ❌ ライブラリやフレームワークのショーケースではない
- ❌ ポートフォリオサイトではない(凝った見た目を作り込まない)
- ❌ 業務で使うものではない(実験用)

## デプロイ単位

**1 つの Cloudflare Worker に全 toy を相乗りさせる**。各 toy は TanStack Router の route として分岐する。

| パターン | 採用 | 理由 |
|---|---|---|
| toy ごとに別 Worker | ✗ | デプロイ・DNS・wrangler 設定が toy 数だけ増える |
| サブドメインで分離 | ✗ | DNS 設定が増える、Cookie/状態の分離が必要なケースが少ない |
| **パスで分離(採用)** | ✓ | URL: `toys.naoki1510.net/<toy-name>`、設定は 1 つ |
| Pages にまとめる | ✗ | TanStack Start の SSR を活かしたい |

## バックエンド方針

現状なし。toy のロジックは **完全にクライアントサイド or TanStack Start の Server Functions** で完結させる。

将来、永続化や重い処理が必要な toy が出てきたら **VPS** にバックエンドを置き、Cloudflare Workers から `fetch` で呼ぶ構成にする。

- ✅ Cloudflare Workers: フロントエンドのホスティング、軽い Server Functions
- ⏳ VPS: 永続化(DB)、重い計算、長時間タスク。必要になったら立てる
- ❌ Cloudflare D1 / KV / R2: 必要になったら検討するが、まずは VPS に寄せる方針(自由度のため)

## なぜ TanStack Start か

[技術スタック](tech-stack.md) で詳述。要点:

- **仮想ルート(`physical()`)が使える** — `apps/<toy>/` を独立ディレクトリのまま 1 つのルートツリーに合成できる
- **Cloudflare Workers が公式サポート対象**
- **SSR / Server Functions** が最初から使える(将来の幅)
- **Vite ベース**で開発体験が軽い
