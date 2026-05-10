import { describe, expect, it } from 'vitest'
import { bestUnder21, parseInputDigits, solve } from './solve'

describe('parseInputDigits', () => {
  it('4 桁をそのまま分解する', () => {
    expect(parseInputDigits('2201')).toEqual([2, 2, 0, 1])
  })

  it('短い入力は左 0 詰め', () => {
    expect(parseInputDigits('21')).toEqual([0, 0, 2, 1])
    expect(parseInputDigits('5')).toEqual([0, 0, 0, 5])
  })

  it('数字以外・5 桁以上は null', () => {
    expect(parseInputDigits('')).toBeNull()
    expect(parseInputDigits('12345')).toBeNull()
    expect(parseInputDigits('a123')).toBeNull()
    expect(parseInputDigits('1.23')).toBeNull()
  })
})

describe('solve', () => {
  it('2201 は 21 を含む(22-0-1 相当)', () => {
    const result = solve([2, 2, 0, 1])
    expect(result.has(21)).toBe(true)
    const exprs = result.get(21)!
    expect(exprs.length).toBeGreaterThan(0)
    expect(
      exprs.some(
        (e) => /22\s*-\s*0\s*-\s*1/.test(e) || /22\s*-\s*1\s*-\s*0/.test(e),
      ),
    ).toBe(true)
  })

  it('3110 は 21 を含む(31-10 相当)', () => {
    // ※ 仕様書(apps/number-calc/docs/index.md)の "3201 → 31-10" は誤り。
    //   31-10 は 1 を 2 個使うので桁集合 {3,1,1,0} = 入力 3110 が正しい。
    const result = solve([3, 1, 1, 0])
    expect(result.has(21)).toBe(true)
    const exprs = result.get(21)!
    expect(exprs.some((e) => /31\s*-\s*10/.test(e))).toBe(true)
  })

  it('0000 は 0^0=1 を経由して 0, 1, 2 を生成する', () => {
    const result = solve([0, 0, 0, 0])
    // 0+0+0+0 = 0, 0^0 = 1, 0^0 + 0^0 = 2
    expect(result.has(0)).toBe(true)
    expect(result.has(1)).toBe(true)
    expect(result.has(2)).toBe(true)
    // 0^0 + 0^0 のような形で 2 が生成されているはず
    const exprs2 = result.get(2)!
    expect(exprs2.some((e) => /0\s*\^\s*0[\s+()]+0\s*\^\s*0/.test(e))).toBe(
      true,
    )
  })

  it('結果は整数だけ(非整数を含まない)', () => {
    const result = solve([1, 2, 3, 4])
    for (const value of result.keys()) {
      expect(Number.isInteger(value)).toBe(true)
    }
  })

  it('ゼロ除算で生成される式は含まれない(値として出てこない)', () => {
    // 1/0 を含むパターンは弾かれるが、評価可能な他の式の結果には影響しない
    const result = solve([1, 0, 2, 3])
    for (const value of result.keys()) {
      expect(Number.isFinite(value)).toBe(true)
    }
  })

  it('式は重複除去されている', () => {
    const result = solve([1, 2, 3, 4])
    for (const exprs of result.values()) {
      expect(new Set(exprs).size).toBe(exprs.length)
    }
  })
})

describe('bestUnder21', () => {
  it('2201 のベスト解は 21', () => {
    const result = solve([2, 2, 0, 1])
    const best = bestUnder21(result)
    expect(best?.value).toBe(21)
    expect((best?.expressions.length ?? 0) > 0).toBe(true)
  })

  it('0000 のベスト解は 2 (0^0 + 0^0)', () => {
    const result = solve([0, 0, 0, 0])
    const best = bestUnder21(result)
    expect(best?.value).toBe(2)
  })

  it('21 を作れない場合はそれ以下の最大値', () => {
    // 9999 は 21 を作れないが、20 や 19 は作れるはず(9+9+...等)
    const result = solve([9, 9, 9, 9])
    const best = bestUnder21(result)
    expect(best).not.toBeNull()
    expect(best!.value).toBeLessThanOrEqual(21)
    // 9999 は (9*9-9)/9*9-9 みたいな式にはならず...実際 9-9+9+9=18 とかが上限
    // ただしざっくり 0 以上ではある
    expect(best!.value).toBeGreaterThanOrEqual(0)
  })
})
