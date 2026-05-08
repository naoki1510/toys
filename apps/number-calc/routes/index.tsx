import { createFileRoute } from '@tanstack/react-router'
import { NumberCalcPage } from '../pages/NumberCalcPage'

type Search = { readonly n?: string }

export const Route = createFileRoute('/number-calc/')({
  // TanStack Router のデフォルト search パーサは `?n=2201` を数値 2201 にする。
  // 文字列・数値どちらでも 4 桁以下の整数なら 0 詰めしない素の表記で受ける。
  validateSearch: (search: Record<string, unknown>): Search => {
    const raw = search.n
    if (typeof raw === 'string' && /^\d{1,4}$/.test(raw)) return { n: raw }
    if (
      typeof raw === 'number' &&
      Number.isInteger(raw) &&
      raw >= 0 &&
      raw <= 9999
    ) {
      return { n: String(raw) }
    }
    return {}
  },
  component: NumberCalcRoute,
})

function NumberCalcRoute() {
  const { n = '' } = Route.useSearch()
  const navigate = Route.useNavigate()
  // n が変わったら state を破棄して再マウント
  // (戻る/進む・手動 URL 変更で表示と URL が食い違わないように)
  return (
    <NumberCalcPage
      key={n}
      initialDigits={n}
      onCommit={(value) =>
        navigate({ search: { n: value }, replace: true })
      }
      onClear={() => navigate({ search: {}, replace: true })}
    />
  )
}
