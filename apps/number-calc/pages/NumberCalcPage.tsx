import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  bestUnder21,
  OPERATORS,
  parseInputDigits,
  solve,
  type Op,
} from '../lib/solve'

type Props = {
  initialDigits: string
  onCommit: (digits: string) => void
  onClear: () => void
}

export function NumberCalcPage({ initialDigits, onCommit, onClear }: Props) {
  const initial = initialDigits.slice(0, 4)
  const [draft, setDraft] = useState(initial)
  const [committed, setCommitted] = useState(initial.length === 4 ? initial : '')

  const [valueQuery, setValueQuery] = useState('')
  const [opFilter, setOpFilter] = useState<readonly Op[]>([])
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

    if (opFilter.length > 0) {
      entries = entries
        .map(([v, exprs]): [number, readonly string[]] => [
          v,
          exprs.filter((e) => opFilter.every((op) => e.includes(op))),
        ])
        .filter(([, exprs]) => exprs.length > 0)
    }

    entries.sort(([a], [b]) => (sortOrder === 'desc' ? b - a : a - b))
    return entries
  }, [result, valueQuery, opFilter, sortOrder])

  const onInputChange = (value: string) => {
    setDraft(value)
    if (value.length === 4) {
      setCommitted(value)
      onCommit(value)
    } else if (value.length === 0 && committed !== '') {
      setCommitted('')
      onClear()
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">number-calc</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          4 桁の数字に四則演算 + 累乗を組み合わせて 21 以下でなるべく 21 に近い値を作るパズル。
        </p>
      </header>

      <section className="mb-6">
        <InputOTP
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          value={draft}
          onChange={onInputChange}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-14 w-14 font-mono text-2xl" />
            <InputOTPSlot index={1} className="h-14 w-14 font-mono text-2xl" />
            <InputOTPSlot index={2} className="h-14 w-14 font-mono text-2xl" />
            <InputOTPSlot index={3} className="h-14 w-14 font-mono text-2xl" />
          </InputOTPGroup>
        </InputOTP>
      </section>

      {best && (
        <Card className="mb-6 gap-3 py-5">
          <CardContent className="px-5">
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
          </CardContent>
        </Card>
      )}

      {result && (
        <section className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">検索:</span>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="例: 21"
              value={valueQuery}
              onChange={(e) => setValueQuery(e.target.value.replace(/[^\d-]/g, ''))}
              className="h-8 w-24"
            />
          </label>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">演算子:</span>
            <ToggleGroup
              multiple
              variant="outline"
              size="sm"
              spacing={1}
              value={opFilter}
              onValueChange={(values) => setOpFilter(values as Op[])}
            >
              {OPERATORS.map((op) => (
                <ToggleGroupItem
                  key={op}
                  value={op}
                  aria-label={`${op} を含む式のみ表示`}
                  title={`${op} を含む式のみ表示`}
                  className="font-mono"
                >
                  {op}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'))}
          >
            {sortOrder === 'desc' ? '値 降順 ▼' : '値 昇順 ▲'}
          </Button>
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
    </div>
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
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="group flex w-full items-baseline gap-3 text-left">
          <span className="min-w-12 shrink-0 text-right font-mono text-lg tabular-nums">{value}</span>
          <span className="shrink-0 text-xs text-muted-foreground">差 {distance}</span>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">{exprs.length} 式</span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-2 space-y-1 pl-15">
            {exprs.map((e) => (
              <li key={e}>
                <ExpressionItem expr={e} value={value} />
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
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
    <Button
      type="button"
      variant="ghost"
      size="xs"
      onClick={onClick}
      title="クリックでコピー"
      className="font-mono"
    >
      <span className="text-muted-foreground">{value} =</span>
      <span>{expr}</span>
      {copied && <span className="ml-1 text-xs text-muted-foreground">copied!</span>}
    </Button>
  )
}
