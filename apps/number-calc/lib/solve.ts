export type Op = '+' | '-' | '*' | '/' | '^'

export const OPERATORS: readonly Op[] = ['+', '-', '*', '/', '^']

export type Expr =
  | { readonly kind: 'num'; readonly value: number; readonly text: string }
  | {
      readonly kind: 'bin'
      readonly op: Op
      readonly left: Expr
      readonly right: Expr
    }

const num = (n: number): Expr => ({ kind: 'num', value: n, text: String(n) })

const joinDigits = (digs: readonly number[]): number =>
  Number.parseInt(digs.join(''), 10)

function uniquePermutations(arr: readonly number[]): number[][] {
  const result: number[][] = []
  const seen = new Set<string>()
  const used: boolean[] = arr.map(() => false)
  const buf: number[] = []

  function go() {
    if (buf.length === arr.length) {
      const key = buf.join(',')
      if (!seen.has(key)) {
        seen.add(key)
        result.push([...buf])
      }
      return
    }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue
      used[i] = true
      buf.push(arr[i]!)
      go()
      buf.pop()
      used[i] = false
    }
  }

  go()
  return result
}

function groupings(perm: readonly number[]): Expr[][] {
  if (perm.length !== 4) throw new Error('expected 4 digits')
  const a = perm[0]!,
    b = perm[1]!,
    c = perm[2]!,
    d = perm[3]!
  return [
    // (1,1,1,1)
    [num(a), num(b), num(c), num(d)],
    // (2,1,1) — 3 positions for the 2-digit
    [num(joinDigits([a, b])), num(c), num(d)],
    [num(a), num(joinDigits([b, c])), num(d)],
    [num(a), num(b), num(joinDigits([c, d]))],
    // (2,2)
    [num(joinDigits([a, b])), num(joinDigits([c, d]))],
    // (3,1) — 2 positions
    [num(joinDigits([a, b, c])), num(d)],
    [num(a), num(joinDigits([b, c, d]))],
  ]
}

function* allTrees(operands: readonly Expr[]): Generator<Expr> {
  if (operands.length === 1) {
    yield operands[0]!
    return
  }
  for (let i = 1; i < operands.length; i++) {
    const lefts = [...allTrees(operands.slice(0, i))]
    const rights = [...allTrees(operands.slice(i))]
    for (const left of lefts) {
      for (const right of rights) {
        for (const op of OPERATORS) {
          yield { kind: 'bin', op, left, right }
        }
      }
    }
  }
}

function evaluate(expr: Expr): number | null {
  if (expr.kind === 'num') return expr.value
  const l = evaluate(expr.left)
  if (l === null) return null
  const r = evaluate(expr.right)
  if (r === null) return null
  if (!Number.isFinite(l) || !Number.isFinite(r)) return null
  switch (expr.op) {
    case '+':
      return l + r
    case '-':
      return l - r
    case '*':
      return l * r
    case '/':
      if (r === 0) return null
      return l / r
    case '^':
      // 0^0 = 1 (JS の慣行) として許容。0^(-n) は Infinity になるので除外。
      if (l === 0 && r < 0) return null
      if (l < 0 && !Number.isInteger(r)) return null
      if (Math.abs(r) > 30) return null
      return l ** r
  }
}

function precedence(op: Op): number {
  switch (op) {
    case '+':
    case '-':
      return 1
    case '*':
    case '/':
      return 2
    case '^':
      return 3
  }
}

const isRightAssoc = (op: Op): boolean => op === '^'

type Side = 'L' | 'R'
type Assoc = 'L' | 'R'

function formatChild(
  expr: Expr,
  parentPrec: number,
  parentAssoc: Assoc,
  side: Side,
): string {
  if (expr.kind === 'num') return expr.text
  const myPrec = precedence(expr.op)
  const myAssoc: Assoc = isRightAssoc(expr.op) ? 'R' : 'L'
  const leftStr = formatChild(expr.left, myPrec, myAssoc, 'L')
  const rightStr = formatChild(expr.right, myPrec, myAssoc, 'R')
  const inner = `${leftStr} ${expr.op} ${rightStr}`

  let needParens = false
  if (myPrec < parentPrec) {
    needParens = true
  } else if (myPrec === parentPrec) {
    if (parentAssoc === 'L' && side === 'R') needParens = true
    if (parentAssoc === 'R' && side === 'L') needParens = true
  }
  return needParens ? `(${inner})` : inner
}

export function format(expr: Expr): string {
  return formatChild(expr, 0, 'L', 'L')
}

function isValidResult(value: number): boolean {
  return (
    Number.isFinite(value) && Number.isInteger(value) && Math.abs(value) <= 1e9
  )
}

/**
 * Map<結果値, その結果を生む式の配列(辞書順)>
 */
export type CalcResult = ReadonlyMap<number, readonly string[]>

export function solve(digits: readonly number[]): CalcResult {
  const acc = new Map<number, Set<string>>()

  for (const perm of uniquePermutations(digits)) {
    for (const operands of groupings(perm)) {
      for (const expr of allTrees(operands)) {
        const value = evaluate(expr)
        if (value === null || !isValidResult(value)) continue
        const text = format(expr)
        let set = acc.get(value)
        if (!set) {
          set = new Set()
          acc.set(value, set)
        }
        set.add(text)
      }
    }
  }

  const out = new Map<number, readonly string[]>()
  for (const [value, set] of acc) {
    out.set(value, [...set].sort())
  }
  return out
}

export type BestSolution = {
  readonly value: number
  readonly expressions: readonly string[]
}

export function bestUnder21(result: CalcResult): BestSolution | null {
  let bestValue = -Infinity
  let bestExprs: readonly string[] | null = null
  for (const [value, exprs] of result) {
    if (value <= 21 && value > bestValue) {
      bestValue = value
      bestExprs = exprs
    }
  }
  if (bestExprs === null) return null
  return { value: bestValue, expressions: bestExprs }
}

export function parseInputDigits(input: string): number[] | null {
  if (!/^\d{1,4}$/.test(input)) return null
  return input.padStart(4, '0').split('').map(Number)
}
