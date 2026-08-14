'use client'

import * as React from 'react'
import { ArrowRight, Check, Copy, Sparkles, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn'

export interface CtaGradientGlowActionProps {
  className?: string
}

export function CtaGradientGlowAction({ className }: CtaGradientGlowActionProps) {
  const [packageManager, setPackageManager] = React.useState<PackageManager>('pnpm')
  const [isCopied, setIsCopied] = React.useState(false)

  const cliCommand = React.useMemo(() => {
    switch (packageManager) {
      case 'pnpm':
        return 'pnpm dlx shadcn@latest add https://uipkge.dev/r/react/init.json'
      case 'npm':
        return 'npx shadcn@latest add https://uipkge.dev/r/react/init.json'
      case 'bun':
        return 'bunx --bun shadcn@latest add https://uipkge.dev/r/react/init.json'
      case 'yarn':
        return 'yarn dlx shadcn@latest add https://uipkge.dev/r/react/init.json'
    }
  }, [packageManager])

  const copyCommand = () => {
    navigator.clipboard.writeText(cliCommand)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <section
      data-slot="cta-gradient-glow-action"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="relative mx-auto max-w-5xl">
        {/* Ambient Glow Behind CTA Card */}
        <div className="from-primary/30 to-primary/30 pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-60 blur-2xl" />

        {/* Main CTA Card */}
        <Card className="border-border bg-card/95 relative space-y-8 overflow-hidden rounded-3xl p-8 text-center shadow-sm backdrop-blur-xl sm:p-14">
          {/* Floating decorative badge */}
          <div className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs">
            <Sparkles className="size-3.5" />
            <span>Production Ready &bull; Unbundled Distribution</span>
          </div>

          {/* Headline & Subtitle */}
          <div className="mx-auto max-w-2xl space-y-3">
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Start building with unbundled code in 30 seconds.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Run the init command below to copy calibrated tokens, utilities, and primitives directly into your
              repository.
            </p>
          </div>

          {/* CLI Installation Terminal Box */}
          <div className="mx-auto max-w-xl space-y-2">
            {/* Package manager selector tabs */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                {(['pnpm', 'npm', 'bun', 'yarn'] as PackageManager[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    className={cn(
                      'rounded-md px-2.5 py-0.5 font-mono text-xs uppercase transition-all',
                      packageManager === pm
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setPackageManager(pm)}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <span className="text-muted-foreground font-mono text-xs">Single Command Init</span>
            </div>

            {/* Command Display Strip */}
            <div className="border-border bg-muted/50 text-foreground flex items-center justify-between gap-3 overflow-hidden rounded-xl border p-3.5 text-left font-mono text-xs shadow-inner sm:p-4">
              <div className="flex min-w-0 items-center gap-2">
                <Terminal className="text-primary size-4 shrink-0" />
                <span className="truncate font-semibold select-all">{cliCommand}</span>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-8 shrink-0 gap-1.5 px-3 font-mono text-xs"
                onClick={copyCommand}
              >
                {isCopied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="text-muted-foreground size-3.5" />
                )}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg" className="h-11 gap-2 px-6 font-mono text-xs shadow-md">
              <span>Browse 450+ Component Blocks</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Developer Trust Assurance Badges */}
          <div className="border-border/60 text-muted-foreground flex flex-wrap items-center justify-center gap-6 border-t pt-6 font-mono text-xs sm:gap-10">
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-500" />
              <span>100% Free &amp; Open Source (MIT)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-500" />
              <span>Zero Vendor NPM Dependencies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-emerald-500" />
              <span>Dual-Framework AST Parity</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default CtaGradientGlowAction
