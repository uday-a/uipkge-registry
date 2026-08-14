'use client'

import * as React from 'react'
import { ArrowRight, Check, CheckCircle2, Code2, Copy, Download, Globe, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Framework = 'vue' | 'react' | 'nuxt'

const installCommands: Record<Framework, { command: string; subtitle: string }> = {
  vue: {
    command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y',
    subtitle: 'Zero-config Vue 3.5 + Tailwind v4 + Reka UI primitives',
  },
  react: {
    command: 'npx shadcn@latest add https://uipkge.dev/r/react/init.json -y',
    subtitle: 'Production-ready React 19 + Radix primitives + CVA variants',
  },
  nuxt: {
    command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y',
    subtitle: 'Nuxt 3 auto-imports, SSR hydration-safe, unbundled ownership',
  },
}

export function Cta01() {
  const [activeFramework, setActiveFramework] = React.useState<Framework>('vue')
  const [copied, setCopied] = React.useState(false)
  const [pingMs] = React.useState(14)

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommands[activeFramework].command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      data-slot="cta-01"
      className="bg-background border-border relative w-full overflow-hidden border-y py-16 lg:py-24"
    >
      {/* Subtle architectural background glow */}
      <div className="from-primary/10 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

      <div className="mx-auto max-w-5xl space-y-10 px-4 text-center sm:px-6 lg:px-8">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary bg-primary/5 gap-1.5 px-3 py-1 font-mono text-xs tracking-wide uppercase"
          >
            <Zap className="size-3.5" />
            Unbundled Registry Distribution
          </Badge>
          <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            <span>CDN Edge: {pingMs}ms P99</span>
          </div>
        </div>

        {/* Main Headline & Narrative */}
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-foreground text-3xl leading-[1.15] font-bold tracking-tight sm:text-5xl">
            Own Your UI. No Semver Lock-in. Zero Bloat.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            The components are the product. Source files are copied directly into your workspace. Modify, compose, and
            refactor without fighting external package boundaries.
          </p>
        </div>

        {/* Interactive Developer Terminal Box */}
        <Card className="mx-auto max-w-2xl overflow-hidden border-zinc-800 bg-zinc-950 text-left text-zinc-100 shadow-sm">
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-rose-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 font-mono text-xs text-zinc-400">terminal — bootstrap workspace</span>
            </div>

            {/* Framework selector tabs */}
            <div className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 p-0.5">
              {[
                { id: 'vue', label: 'Vue 3' },
                { id: 'react', label: 'React 19' },
                { id: 'nuxt', label: 'Nuxt 3' },
              ].map((fw) => (
                <button
                  key={fw.id}
                  type="button"
                  className={cn(
                    'rounded px-2 py-0.5 font-mono text-xs transition-all',
                    activeFramework === fw.id
                      ? 'bg-zinc-800 font-semibold text-zinc-100 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200',
                  )}
                  onClick={() => setActiveFramework(fw.id as any)}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Command Runner Body */}
          <div className="space-y-3 p-4 font-mono text-xs sm:p-5">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
              <div className="flex items-center gap-2.5 overflow-x-auto text-emerald-400 select-all">
                <span className="shrink-0 text-zinc-500">$</span>
                <span className="whitespace-nowrap">{installCommands[activeFramework].command}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 shrink-0 gap-1.5 border-zinc-700 bg-zinc-800 px-2.5 font-mono text-xs text-zinc-200 hover:bg-zinc-700"
                onClick={copyCommand}
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Sparkles className="size-3.5 shrink-0 text-yellow-400" />
              <span>{installCommands[activeFramework].subtitle}</span>
            </p>
          </div>
        </Card>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Button size="lg" className="h-11 gap-2 px-6 font-semibold shadow-sm" onClick={copyCommand}>
            <Download className="size-4" />
            {copied ? 'Command Copied to Clipboard' : 'Install Components'}
          </Button>
          <Button size="lg" variant="outline" className="h-11 gap-2 px-6 font-semibold" asChild>
            <a href="https://github.com/uday-a/uipkge" target="_blank" rel="noreferrer">
              <Code2 className="size-4" />
              Explore Source Registry
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        {/* Trust Badges & Guarantees Grid */}
        <div className="border-border grid grid-cols-2 gap-4 border-t pt-8 text-left sm:grid-cols-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-foreground text-xs font-semibold">100% Code Ownership</p>
              <p className="text-muted-foreground mt-0.5 text-xs">Files live in your repository</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-foreground text-xs font-semibold">Zero Runtime Bloat</p>
              <p className="text-muted-foreground mt-0.5 text-xs">No opaque wrapper dependencies</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-foreground text-xs font-semibold">Tailwind CSS v4</p>
              <p className="text-muted-foreground mt-0.5 text-xs">OKLCH color system & tokens</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Globe className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-foreground text-xs font-semibold">Dual Framework</p>
              <p className="text-muted-foreground mt-0.5 text-xs">Strict Vue 3 & React parity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Cta01
