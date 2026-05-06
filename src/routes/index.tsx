import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const toys = [
  {
    name: 'number-calc',
    path: '/number-calc',
    description: '4 桁数字パズル(21 に近づける)の解探索',
    status: 'WIP',
  },
] as const

function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">toys</h1>
        <p className="mt-2 text-neutral-600">
          思いついたちょっとした Web アプリの置き場
        </p>
      </header>

      <ul className="space-y-3">
        {toys.map((toy) => (
          <li key={toy.name}>
            <Link
              to={toy.path}
              className="block rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-lg font-medium">
                  {toy.name}
                </span>
                <span className="text-xs text-neutral-500">{toy.status}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                {toy.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
