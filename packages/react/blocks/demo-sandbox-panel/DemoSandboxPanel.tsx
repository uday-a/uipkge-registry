'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DEFAULTS = { metric: 'revenue_net', window: 'trailing_28d', groupBy: 'region' }

const BASE: Record<string, { key: string; value: number }[]> = {
  region: [
    { key: 'EMEA', value: 1_842_100 },
    { key: 'AMER', value: 1_536_400 },
    { key: 'APAC', value: 762_400 },
  ],
  channel: [
    { key: 'Direct', value: 2_104_900 },
    { key: 'Marketplace', value: 1_218_600 },
    { key: 'Wholesale', value: 817_400 },
  ],
}

const MULTIPLIER: Record<string, number> = { trailing_7d: 0.25, trailing_28d: 1, trailing_90d: 3.1 }

export function DemoSandboxPanel() {
  const [form, setForm] = useState({ ...DEFAULTS })
  const set = (key: keyof typeof DEFAULTS, value: string) => setForm((f) => ({ ...f, [key]: value }))

  // Both outputs derive from the same form, so the query and the result can
  // never describe different things — the failure mode of most fake sandboxes.
  const query = `SELECT ${form.groupBy},
       SUM(amount) AS ${form.metric}
FROM   metrics.${form.metric}
WHERE  window = '${form.window}'
GROUP  BY ${form.groupBy}
ORDER  BY ${form.metric} DESC`

  const results = (BASE[form.groupBy] ?? BASE.region).map((row) => ({
    key: row.key,
    value: Math.round(row.value * (MULTIPLIER[form.window] ?? 1)),
  }))

  return (
    <section data-slot="demo-sandbox-panel" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Badge variant="secondary">Sandbox</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Change the definition, watch both sides
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setForm({ ...DEFAULTS })}>
            <RotateCcw className="mr-1.5 size-3.5" aria-hidden="true" />
            Reset
          </Button>
        </div>

        <Card className="mt-8">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[18rem_1fr] lg:gap-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="sandbox-metric" className="text-sm font-medium">
                  Metric
                </label>
                <Input
                  id="sandbox-metric"
                  value={form.metric}
                  onChange={(event) => set('metric', event.target.value)}
                  className="mt-1.5 font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="sandbox-window" className="text-sm font-medium">
                  Window
                </label>
                <Select value={form.window} onValueChange={(value) => set('window', value)}>
                  <SelectTrigger id="sandbox-window" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trailing_7d">trailing_7d</SelectItem>
                    <SelectItem value="trailing_28d">trailing_28d</SelectItem>
                    <SelectItem value="trailing_90d">trailing_90d</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="sandbox-group" className="text-sm font-medium">
                  Group by
                </label>
                <Select value={form.groupBy} onValueChange={(value) => set('groupBy', value)}>
                  <SelectTrigger id="sandbox-group" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="region">region</SelectItem>
                    <SelectItem value="channel">channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              <p className="text-muted-foreground text-xs leading-relaxed">
                Both panels recompute from these three fields. Nothing is cached between them.
              </p>
            </div>

            <Tabs defaultValue="result">
              <TabsList variant="segmented">
                <TabsTrigger value="result" variant="segmented">
                  Result
                </TabsTrigger>
                <TabsTrigger value="query" variant="segmented">
                  Generated query
                </TabsTrigger>
              </TabsList>

              <TabsContent value="result" className="mt-4">
                <div className="border-border min-h-[12rem] overflow-hidden rounded-lg border">
                  <div className="border-border text-muted-foreground border-b px-4 py-2 font-mono text-xs">
                    {form.metric} · {form.window}
                  </div>
                  <ul className="divide-border divide-y">
                    {results.map((row) => (
                      <li key={row.key} className="flex items-center justify-between gap-4 px-4 py-2.5">
                        <span className="text-sm">{row.key}</span>
                        <span className="font-mono text-sm tabular-nums">£{row.value.toLocaleString('en-GB')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="query" className="mt-4">
                <pre className="border-border min-h-[12rem] overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
                  <code>{query}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
