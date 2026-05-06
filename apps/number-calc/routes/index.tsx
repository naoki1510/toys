import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/number-calc/')({
  component: NumberCalcPage,
})

function NumberCalcPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-neutral-500 hover:text-neutral-900">
          ← toys
        </Link>
      </nav>

      <h1 className="text-3xl font-bold">number-calc</h1>
      <p className="mt-2 text-neutral-600">
        4 桁数字パズル(21 に近づける)の解探索
      </p>

      <p className="mt-8 text-sm text-neutral-500">
        仕様策定済み・実装はこれから。仕様は{' '}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5">
          apps/number-calc/docs/index.md
        </code>{' '}
        に。
      </p>
    </main>
  )
}
