import * as React from 'react'
import { ArrowRight, Check, Copy, Globe, Play, Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface FeatureInteractiveApiCurlBuilderProps {
  title?: string
  description?: string
  className?: string
}

export function FeatureInteractiveApiCurlBuilder({
  title = 'Composable REST APIs designed for programmatic automation.',
  description = 'Synthesize type-safe HTTP payloads, test endpoints in real time, and export snippets directly to your production workflow.',
  className,
}: FeatureInteractiveApiCurlBuilderProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<'GET' | 'POST'>('POST')
  const [selectedEndpoint, setSelectedEndpoint] = React.useState('/v1/components/bundle')
  const [selectedLanguage, setSelectedLanguage] = React.useState<'curl' | 'javascript' | 'python' | 'go'>('curl')
  const [enableAstTree, setEnableAstTree] = React.useState(true)
  const [enableOklchTokens, setEnableOklchTokens] = React.useState(true)
  const [copiedSnippet, setCopiedSnippet] = React.useState(false)
  const [isExecuting, setIsExecuting] = React.useState(false)
  const [executionResult, setExecutionResult] = React.useState<any>({
    status: 200,
    latencyMs: 14,
    data: {
      bundleId: 'pkg_9981x2',
      name: 'button',
      frameworks: ['vue', 'react'],
      astCompiled: true,
      sizeBytes: 1480,
      oklchTokensInlined: 48,
      edgeDeliveryTime: '0.8ms',
    },
  })

  const generatedCode = React.useMemo(() => {
    const payload = JSON.stringify(
      {
        component: 'button',
        framework: 'vue',
        astTree: enableAstTree,
        inlineTokens: enableOklchTokens,
      },
      null,
      2,
    )

    if (selectedLanguage === 'curl') {
      return `curl -X ${selectedMethod} https://api.uipkge.dev${selectedEndpoint} \\
  -H "Authorization: Bearer uipkge_sec_89201" \\
  -H "Content-Type: application/json" \\
  -d '${payload.replace(/\n/g, '\n  ')}'`
    }

    if (selectedLanguage === 'javascript') {
      return `const res = await fetch("https://api.uipkge.dev${selectedEndpoint}", {
  method: "${selectedMethod}",
  headers: {
    "Authorization": "Bearer uipkge_sec_89201",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${payload})
});
const data = await res.json();`
    }

    if (selectedLanguage === 'python') {
      return `import requests

res = requests.${selectedMethod.toLowerCase()}(
    "https://api.uipkge.dev${selectedEndpoint}",
    headers={"Authorization": "Bearer uipkge_sec_89201"},
    json=${payload.replace(/true/g, 'True').replace(/false/g, 'False')}
)
data = res.json()`
    }

    return `// Go HTTP Request
req, _ := http.NewRequest("${selectedMethod}", "https://api.uipkge.dev${selectedEndpoint}", payload)
req.Header.Set("Authorization", "Bearer uipkge_sec_89201")
res, _ := client.Do(req)`
  }, [selectedMethod, selectedEndpoint, selectedLanguage, enableAstTree, enableOklchTokens])

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopiedSnippet(true)
      setTimeout(() => {
        setCopiedSnippet(false)
      }, 2000)
    } catch {
      // fallback
    }
  }

  function executeRequest() {
    setIsExecuting(true)
    setTimeout(() => {
      setIsExecuting(false)
      setExecutionResult({
        status: 200,
        latencyMs: Math.floor(Math.random() * 8) + 11,
        data: {
          bundleId: `pkg_${Math.random().toString(36).substring(2, 8)}`,
          name: selectedEndpoint.includes('bundle') ? 'button' : 'tokens',
          frameworks: ['vue', 'react'],
          astCompiled: enableAstTree,
          sizeBytes: enableAstTree ? 1480 : 1120,
          oklchTokensInlined: enableOklchTokens ? 48 : 0,
          edgeDeliveryTime: '0.8ms',
        },
      })
    }, 350)
  }

  return (
    <section
      data-slot="feature-interactive-api-curl-builder"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#api-builder"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Globe className="text-primary size-3.5" />
            <span>Interactive Edge API Console</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* API Builder Workbench */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Config Parameters (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <Card className="border-border bg-card shadow-xs">
              <CardContent className="space-y-5 p-6">
                <div className="border-border flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Request Parameters
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-500"
                  >
                    Edge v1
                  </Badge>
                </div>

                {/* Endpoint Selector */}
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-bold">Endpoint Path</label>
                  <div className="border-border bg-muted/40 flex rounded-lg border p-1">
                    {['/v1/components/bundle', '/v1/tokens/compile'].map((ep) => (
                      <button
                        key={ep}
                        type="button"
                        className={cn(
                          'flex-1 rounded-md py-1 font-mono text-xs transition-colors',
                          selectedEndpoint === ep
                            ? 'bg-background text-foreground font-bold shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => setSelectedEndpoint(ep)}
                      >
                        {ep}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payload Toggles */}
                <div className="space-y-2.5 pt-2">
                  <label className="text-foreground text-xs font-bold">Payload Flags</label>
                  <div className="space-y-2">
                    <label className="border-border/80 bg-background hover:bg-muted/20 flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs">
                      <span className="text-muted-foreground">Emit AST Syntax Tree</span>
                      <input
                        type="checkbox"
                        checked={enableAstTree}
                        onChange={(e) => setEnableAstTree(e.target.checked)}
                        className="accent-primary size-4 cursor-pointer"
                      />
                    </label>
                    <label className="border-border/80 bg-background hover:bg-muted/20 flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs">
                      <span className="text-muted-foreground">Inline OKLCH CSS Tokens</span>
                      <input
                        type="checkbox"
                        checked={enableOklchTokens}
                        onChange={(e) => setEnableOklchTokens(e.target.checked)}
                        className="accent-primary size-4 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <Button className="w-full gap-2 shadow-xs" disabled={isExecuting} onClick={executeRequest}>
                  <Play className="fill-primary-foreground size-3.5" />
                  <span>{isExecuting ? 'Executing Edge Call...' : 'Send Live HTTP Request'}</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Code Preview & Simulated Response (7 cols) */}
          <div className="space-y-4 lg:col-span-7">
            <Card className="border-border bg-card overflow-hidden font-mono text-xs shadow-xs">
              {/* Language Selector Tabs */}
              <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'curl', label: 'cURL' },
                    { id: 'javascript', label: 'Fetch' },
                    { id: 'python', label: 'Python' },
                    { id: 'go', label: 'Go' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      className={cn(
                        'rounded px-2.5 py-1 text-xs transition-colors',
                        selectedLanguage === lang.id
                          ? 'bg-background text-foreground font-bold shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                      onClick={() => setSelectedLanguage(lang.id as any)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
                  onClick={copySnippet}
                >
                  {copiedSnippet ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <CardContent className="bg-muted/10 p-4">
                <pre className="text-foreground overflow-x-auto text-xs leading-relaxed">
                  <code>{generatedCode}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Simulated Live HTTP Response */}
            <div className="border-border bg-muted/30 space-y-2 rounded-xl border p-4 font-mono text-xs">
              <div className="border-border/80 flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="text-primary size-3.5" />
                  <span className="text-foreground font-bold">Response Payload</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-emerald-500">HTTP {executionResult.status} OK</span>
                  <span className="text-muted-foreground">{executionResult.latencyMs}ms</span>
                </div>
              </div>
              <pre className="text-muted-foreground overflow-x-auto text-xs leading-relaxed">
                <code>{JSON.stringify(executionResult.data, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
