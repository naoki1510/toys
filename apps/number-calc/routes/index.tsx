import { useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  bestUnder21,
  OPERATORS,
  parseInputDigits,
  solve,
  type Op,
} from '../lib/solve'

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
  component: NumberCalcPage,
})

function NumberCalcPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/number-calc/' })

  const [draft, setDraft] = useState(search.n ?? '')
  const [committed, setCommitted] = useState(search.n ?? '')

  const [valueQuery, setValueQuery] = useState('')
  const [opFilter, setOpFilter] = useState<ReadonlySet<Op>>(new Set())
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const result = useMemo(() => {
    const digits = parseInputDigits(committed)
    return digits ? solve(digits) : null
  }, [committed])

  const best = useMemo(() => (result ? bestUnder21(result) : null), [result])

  const filteredEntries = useMemo<readonly [number, readonly string[]][]>(() => {
    if (!result) return []
    let entries: [number, readonly string[]][] = [...result.entries()]

    const target = valueQuery.trim() === '' ? null : Number(valueQuery)
    if (target !== null && Number.isFinite(target)) {
      entries = entries.filter(([v]) => v === target)
    }

    if (opFilter.size > 0) {
      const ops = [...opFilter]
      entries = entries
        .map(([v, exprs]): [number, readonly string[]] => [
          v,
          exprs.filter((e) => ops.every((op) => e.includes(op))),
        ])
        .filter(([, exprs]) => exprs.length > 0)
    }

    entries.sort(([a], [b]) => (sortOrder === 'desc' ? b - a : a - b))
    return entries
  }, [result, valueQuery, opFilter, sortOrder])

  const commit = () => {
    setCommitted(draft)
    navigate({ search: { n: draft || undefined }, replace: true })
  }

  const toggleOp = (op: Op) => {
    setOpFilter((prev) => {
      const next = new Set(prev)
      if (next.has(op)) next.delete(op)
      else next.add(op)
      return next
    })
  }

  const inputInvalid = committed !== '' && parseInputDigits(committed) === null

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          ← toys
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">number-calc</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          4 桁の数字に四則演算 + 累乗を組み合わせて 21 以下でなるべく 21 に近い値を作るパズル。
        </p>
      </header>

      <section className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{0,4}"
            maxLength={4}
            placeholder="2201"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
            }}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-2xl tracking-widest shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          <Button onClick={commit} disabled={draft.length === 0}>
            計算
          </Button>
        </div>
        {inputInvalid && (
          <p className="mt-2 text-sm text-destructive">入力が不正です(4 桁以下の数字のみ)</p>
        )}
      </section>

      {best && (
        <section className="mb-6 rounded-lg border bg-card p-5 shadow-xs">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">⭐ ベスト解 (≤ 21)</span>
            <span className="text-3xl font-bold tabular-nums">{best.value}</span>
            {best.value !== 21 && (
              <span className="text-sm text-muted-foreground">差: {21 - best.value}</span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {best.expressions.length} 式
            </span>
          </div>
          <ul className="mt-3 space-y-1">
            {best.expressions.slice(0, 5).map((e) => (
              <li key={e}>
                <ExpressionItem expr={e} value={best.value} />
              </li>
            ))}
            {best.expressions.length > 5 && (
              <li className="text-xs text-muted-foreground">
                他 {best.expressions.length - 5} 式は下のリストから
              </li>
            )}
          </ul>
        </section>
      )}

      {result && (
        <section className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">検索:</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="例: 21"
              value={valueQuery}
              onChange={(e) => setValueQuery(e.target.value.replace(/[^\d-]/g, ''))}
              className="w-24 rounded-md border border-input bg-background px-2 py-1 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </label>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">演算子:</span>
            {OPERATORS.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => toggleOp(op)}
                title={`${op} を含む式のみ表示`}
                className={cn(
                  'h-8 w-8 rounded-md border font-mono transition',
                  opFilter.has(op)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background hover:bg-accent',
                )}
              >
                {op}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'))}
            className="rounded-md border border-input bg-background px-3 py-1 hover:bg-accent"
          >
            {sortOrder === 'desc' ? '値 降順 ▼' : '値 昇順 ▲'}
          </button>
        </section>
      )}

      {result && (
        <section>
          {filteredEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">該当なし</p>
          ) : (
            <ul className="divide-y">
              {filteredEntries.map(([value, exprs]) => (
                <ResultGroup key={value} value={value} exprs={exprs} />
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}

function ResultGroup({
  value,
  exprs,
}: {
  value: number
  exprs: readonly string[]
}) {
  const [open, setOpen] = useState(false)
  const distance = Math.abs(21 - value)

  return (
    <li className="py-2">
      <button
        type="button"
        className="flex w-full items-baseline gap-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="min-w-12 shrink-0 text-right font-mono text-lg tabular-nums">{value}</span>
        <span className="shrink-0 text-xs text-muted-foreground">差 {distance}</span>
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{exprs.length} 式</span>
        <span className="w-4 shrink-0 text-muted-foreground">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-1 pl-15">
          {exprs.map((e) => (
            <li key={e}>
              <ExpressionItem expr={e} value={value} />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function ExpressionItem({ expr, value }: { expr: string; value: number }) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(expr)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title="クリックでコピー"
      className="rounded px-1 font-mono text-sm hover:bg-accent"
    >
      <span className="text-muted-foreground">{value} =</span>{' '}
      <span>{expr}</span>
      {copied && <span className="ml-2 text-xs text-muted-foreground">copied!</span>}
    </button>
  )
}
