import { Link } from '@tanstack/react-router'
import { Blocks } from 'lucide-react'
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
      <header className="mb-12 flex items-center gap-3">
        <div className="bg-primary text-primary-foreground flex aspect-square size-12 items-center justify-center rounded-lg">
          <Blocks className="size-6" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Toys</h1>
          <p className="text-muted-foreground mt-1">
            思いついたちょっとした Web アプリの置き場
          </p>
        </div>
      </header>

      <ul className="space-y-3">
        {toys.map((toy) => (
          <li key={toy.name}>
            <Link to={toy.path} className="block">
              <Card className="hover:bg-accent/50 gap-2 py-4 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{toy.name}</CardTitle>
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
