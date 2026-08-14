'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeInstallCommandProps {
  pkg?: string
  version?: string
}

export function CodeInstallCommand({ pkg = '@northwind/metrics', version = '2.4.0' }: CodeInstallCommandProps) {
  // One package name, four managers — derived rather than duplicated so a
  // rename cannot leave one tab pointing at the old package.
  const managers = [
    { id: 'npm', command: `npm install ${pkg}` },
    { id: 'pnpm', command: `pnpm add ${pkg}` },
    { id: 'yarn', command: `yarn add ${pkg}` },
    { id: 'bun', command: `bun add ${pkg}` },
  ]

  const [copied, setCopied] = useState('')

  async function copy(command: string, id: string) {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(id)
      setTimeout(() => setCopied(''), 1600)
    } catch {
      // Clipboard blocked (insecure context or denied permission): leave the
      // command visible so it can still be selected by hand.
    }
  }

  return (
    <section data-slot="code-install-command" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1.5">
            <Terminal className="size-3" aria-hidden="true" />
            Install
          </Badge>
          <span className="text-muted-foreground font-mono text-xs">
            resolved {pkg}@{version}
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight">One command, then you own the source</h2>

        <Tabs defaultValue="npm" className="mt-6">
          <TabsList variant="segmented" className="flex-nowrap overflow-x-auto">
            {managers.map((manager) => (
              <TabsTrigger key={manager.id} value={manager.id} variant="segmented">
                {manager.id}
              </TabsTrigger>
            ))}
          </TabsList>

          {managers.map((manager) => (
            <TabsContent key={manager.id} value={manager.id} className="mt-4">
              <div className="border-border bg-card flex items-stretch overflow-hidden rounded-lg border">
                <span className="text-primary grid shrink-0 place-items-center px-3 font-mono text-xs select-none">
                  $
                </span>
                <code className="bg-muted/25 min-w-0 flex-1 truncate px-3 py-2.5 font-mono text-sm">
                  {manager.command}
                </code>
                <Button
                  variant="ghost"
                  className="border-border h-auto shrink-0 rounded-none border-l px-3"
                  aria-label={`Copy ${manager.id} command`}
                  onClick={() => copy(manager.command, manager.id)}
                >
                  {copied === manager.id ? (
                    <Check className="text-success size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          Writes the component source into{' '}
          <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">components/</code> and adds nothing to your
          lockfile beyond the icon set. Edit it like any other file in your repo.
        </p>
      </div>
    </section>
  )
}
