'use client'

import { useEffect, useState } from 'react'
import { Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const lines = [
  { kind: 'prompt', text: 'npx @northwind/cli connect snowflake' },
  { kind: 'out', text: 'Testing credentials…  ok' },
  { kind: 'out', text: 'Mirroring schema…     412 tables' },
  { kind: 'prompt', text: 'npx @northwind/cli certify revenue_net' },
  { kind: 'out', text: 'Reconciling 4 quarters…' },
  { kind: 'out', text: 'Q1 ✓   Q2 ✓   Q3 ✓   Q4 ✓' },
  { kind: 'ok', text: 'revenue_net certified · 41 consumers notified' },
]

function toneClass(kind: string) {
  if (kind === 'prompt') return 'text-foreground'
  if (kind === 'ok') return 'text-success'
  return 'text-muted-foreground'
}

export function CodeTerminalSession({ lineDelay = 420 }: { lineDelay?: number }) {
  // Renders the whole transcript immediately when the viewer prefers reduced
  // motion; otherwise reveals a line at a time from mount.
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(lines.length)
      return
    }
    const timer = setInterval(() => {
      setShown((value) => {
        if (value >= lines.length) {
          clearInterval(timer)
          return value
        }
        return value + 1
      })
    }, lineDelay)
    return () => clearInterval(timer)
  }, [lineDelay])

  return (
    <section data-slot="code-terminal-session" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Badge variant="secondary" className="gap-1.5">
          <Terminal className="size-3" aria-hidden="true" />
          CLI
        </Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Connected and certified in two commands</h2>
        <p className="text-muted-foreground mt-2">
          The CLI does everything the UI does, so the first rollout can live in a script.
        </p>

        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="border-border flex items-center gap-1.5 border-b px-4 py-2.5">
              <span className="bg-muted-foreground/30 size-2.5 rounded-full" aria-hidden="true" />
              <span className="bg-muted-foreground/30 size-2.5 rounded-full" aria-hidden="true" />
              <span className="bg-muted-foreground/30 size-2.5 rounded-full" aria-hidden="true" />
              <span className="text-muted-foreground ml-2 font-mono text-xs">bash — northwind</span>
            </div>

            {/* min-h holds the final transcript height from the first paint, so
                the card does not grow line by line and shove the page down. */}
            <div className="min-h-[13.5rem] space-y-1 p-4 font-mono text-xs leading-relaxed">
              {lines.slice(0, shown).map((line, index) => (
                <p key={index} className={toneClass(line.kind)}>
                  {line.kind === 'prompt' && <span className="text-primary select-none">$ </span>}
                  {line.text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="mt-6">
          Read the CLI reference
        </Button>
      </div>
    </section>
  )
}
