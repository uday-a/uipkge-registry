'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Samples are plain strings, so a highlighter can be layered on later without
// touching this component.
const samples = [
  {
    id: 'curl',
    label: 'cURL',
    code: `curl https://api.northwind.dev/v1/metrics/revenue_net \\
  -H "Authorization: Bearer $NORTHWIND_TOKEN" \\
  -d 'window=trailing_28d' \\
  -d 'group_by=region'`,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    code: `import { Northwind } from '@northwind/metrics'

const client = new Northwind(process.env.NORTHWIND_TOKEN)

const revenue = await client.metrics.get('revenue_net', {
  window: 'trailing_28d',
  groupBy: ['region'],
})`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `from northwind import Northwind

client = Northwind(os.environ["NORTHWIND_TOKEN"])

revenue = client.metrics.get(
    "revenue_net",
    window="trailing_28d",
    group_by=["region"],
)`,
  },
]

export function CodeTabsMultiLanguage() {
  const [copied, setCopied] = useState('')

  async function copy(code: string, id: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(id)
      setTimeout(() => setCopied(''), 1600)
    } catch {
      // Clipboard blocked: the sample stays selectable by hand.
    }
  }

  return (
    <section data-slot="code-tabs-multi-language" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Badge variant="secondary">API</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Read a certified metric in three lines</h2>
        <p className="text-muted-foreground mt-2">
          The same definition the dashboards use. Scope is applied from the caller&apos;s token, not the query.
        </p>

        <Tabs defaultValue="curl" className="mt-6">
          <TabsList variant="segmented" className="flex-nowrap overflow-x-auto">
            {samples.map((sample) => (
              <TabsTrigger key={sample.id} value={sample.id} variant="segmented">
                {sample.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {samples.map((sample) => (
            <TabsContent key={sample.id} value={sample.id} className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="border-border flex items-center gap-3 border-b px-4 py-2">
                    <span className="text-muted-foreground font-mono text-xs">GET /v1/metrics/revenue_net</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-7 gap-1.5 text-xs"
                      aria-label={`Copy the ${sample.label} sample`}
                      onClick={() => copy(sample.code, sample.id)}
                    >
                      {copied === sample.id ? (
                        <Check className="text-success size-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="size-3.5" aria-hidden="true" />
                      )}
                      {copied === sample.id ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                    <code>{sample.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
