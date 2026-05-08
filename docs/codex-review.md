# Codex PR レビュー

このリポジトリでは、PR レビュー時の Codex 向け指示をトップレベルの
[`AGENTS.md`](../AGENTS.md) に置く。

## 自動レビューを有効化する

Codex の GitHub 連携側で、`naoki1510/toys` の Code review と Automatic reviews を有効化する。

1. Codex cloud で `naoki1510/toys` を利用できる状態にする
2. [Codex settings](https://chatgpt.com/codex/settings) を開く
3. `naoki1510/toys` の Code review を有効化する
4. Automatic reviews を有効化する

有効化後は、レビュー対象として開かれた PR に Codex が自動でレビューを投稿する。

## 手動でレビューを依頼する

自動レビューがまだ動かない場合や、追加の観点で見てほしい場合は、PR コメントで次を投稿する。

```text
@codex review
```

特定の観点に絞る場合:

```text
@codex review for security regressions, missing tests, and risky behavior changes.
```

Codex が指摘した内容を直してほしい場合は、同じ PR で次のように依頼できる。

```text
@codex fix the P1 issue
```
