# 依存関係の自動更新 (Renovate)

依存パッケージと GitHub Actions のバージョンは [Renovate](https://docs.renovatebot.com/) で自動更新する。
設定はリポジトリ直下の [`renovate.json`](../renovate.json)。

## 有効化 (初回のみ)

1. [Renovate GitHub App](https://github.com/apps/renovate) を `naoki1510/toys` にインストールする
2. (推奨) リポジトリの Settings → General → Pull Requests で **Allow auto-merge** を有効化する
   - 無効でも Renovate 自身がマージするが、有効にすると GitHub のネイティブ auto-merge が使われて速い

`renovate.json` が既にあるので、Renovate のオンボーディング PR は作られずにそのまま動き始める。

## 更新ポリシー

| 種類 | PR | マージ |
|---|---|---|
| minor / patch (1.x 以上) | `non-major dependencies` に 1 本へまとめる | CI が通れば自動 |
| lock ファイルのメンテナンス | 週 1 | CI が通れば自動 |
| GitHub Actions (major 含む) | 個別 | CI が通れば自動 |
| major | 個別 | 手動 |
| 0.x 系 (minor も破壊的変更がありうる) | 個別 | 手動 |
| CI の Node.js major | 作らない | Wrangler の要件に合わせて手動で上げる |

- 実行タイミングは毎週月曜 0〜7 時 (JST)
- 公開から 3 日経っていないバージョンは採用しない (`minimumReleaseAge`)
- 自動マージは CI (`test & build`) が green のときだけ行われる
- main へのマージで Deploy ワークフローが走るため、自動マージされた更新はそのまま本番に反映される
- 状況は Renovate が立てる Issue「Dependency Dashboard」で確認・手動トリガーできる
