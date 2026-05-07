import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toys } from '@/lib/toys'

export function HomePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">toys</h1>
        <p className="mt-2 text-muted-foreground">
          思いついたちょっとした Web アプリの置き場
        </p>
      </header>

      <ul className="space-y-3">
        {toys.map((toy) => (
          <li key={toy.name}>
            <Link to={toy.path} className="block">
              <Card className="gap-2 py-4 transition-colors hover:bg-accent/50">
                <CardHeader>
                  <CardTitle className="font-mono text-lg">
                    {toy.name}
                  </CardTitle>
                  <CardDescription>{toy.description}</CardDescription>
                  <CardAction>
                    <Badge variant="secondary">{toy.status}</Badge>
                  </CardAction>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
