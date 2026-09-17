'use client'

import { Check, FileDiff, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// tone drives the row treatment, so individual lines carry no styling of their own.
const hunk = [
  { old: 12, new: 12, tone: 'same', text: 'metric revenue_net {' },
  { old: 13, new: 13, tone: 'same', text: '  owner: finance-analytics' },
  { old: 14, new: null, tone: 'remove', text: '  window: trailing_30d' },
  { old: null, new: 14, tone: 'add', text: '  window: trailing_28d' },
  { old: null, new: 15, tone: 'add', text: '  restated_from: 2026-01-01' },
  { old: 15, new: 16, tone: 'same', text: '  source: warehouse.orders' },
  { old: 16, new: 17, tone: 'same', text: '}' },
]

const added = hunk.filter((line) => line.tone === 'add').length
const removed = hunk.filter((line) => line.tone === 'remove').length

function rowClass(tone: string) {
  if (tone === 'add') return 'bg-success/10 text-foreground'
  if (tone === 'remove') return 'bg-destructive/10 text-muted-foreground'
  return 'text-muted-foreground'
}

function marker(tone: string) {
  return tone === 'add' ? '+' : tone === 'remove' ? '-' : ' '
}

export function CodeDiffReview() {
  return (
    <section data-slot="code-diff-review" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Badge variant="secondary" className="gap-1.5">
          <FileDiff className="size-3" aria-hidden="true" />
          Change review
        </Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Every metric change is a reviewable diff</h2>
        <p className="text-muted-foreground mt-2">
          Definitions live in the repo, so changing one opens a pull request with an owner and a revert path.
        </p>

        <Card className="mt-8">
          <CardContent className="p-0">
            <div className="border-border flex items-center gap-3 border-b px-4 py-2.5">
              <code className="min-w-0 truncate font-mono text-xs">metrics/revenue_net.yml</code>
              <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-xs">
                <span className="text-success">+{added}</span>
                <span className="text-destructive">−{removed}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-xs">
                <caption className="sr-only">Unified diff for metrics/revenue_net.yml</caption>
                <tbody>
                  {hunk.map((line, index) => (
                    <tr key={index} className={rowClass(line.tone)}>
                      <td className="text-muted-foreground/60 w-10 px-2 py-1 text-right select-none">
                        {line.old ?? ''}
                      </td>
                      <td className="text-muted-foreground/60 w-10 px-2 py-1 text-right select-none">
                        {line.new ?? ''}
                      </td>
                      <td className="w-4 py-1 pl-2 select-none">{marker(line.tone)}</td>
                      <td className="py-1 pr-4 whitespace-pre">{line.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator />

            <div className="flex items-start gap-3 px-4 py-3">
              <Avatar className="size-7">
                <AvatarFallback className="text-[10px]">EW</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs">
                  <span className="font-medium">Erin Walsh</span>
                  <span className="text-muted-foreground"> on line 14</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  Restating from January means Q1 reports change. Flag it in the release note before this merges.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto h-7 shrink-0 gap-1.5 text-xs">
                <MessageSquare className="size-3" aria-hidden="true" />
                Reply
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <span className="flex items-center gap-1.5">
            <Check className="text-success size-3.5" aria-hidden="true" />
            Reconciliation passed against the prior four quarters
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="text-success size-3.5" aria-hidden="true" />
            41 downstream consumers identified
          </span>
        </div>
      </div>
    </section>
  )
}
