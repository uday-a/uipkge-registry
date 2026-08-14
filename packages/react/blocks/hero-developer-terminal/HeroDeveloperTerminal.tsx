'use client'

import * as React from 'react'
import { ArrowRight, Check, Code2, Copy, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CommandPreset {
  id: string
  label: string
  command: string
  output: string[]
}

const presets: CommandPreset[] = [
  {
    id: 'init',
    label: '1. Init Theme',
    command: 'npx shadcn@latest add https://uipkge.dev/r/react/init.json',
    output: [
      '✔ Resolving registry dependencies...',
      '✔ Downloaded packages/shared/styles/tailwind.css (OKLCH @theme inline)',
      '✔ Configured cn() utility in src/lib/utils.ts',
      '✔ Injected useTheme hook with system preference sync',
      '✔ UIPKGE bootstrap complete in 124ms.',
    ],
  },
  {
    id: 'component',
    label: '2. Add KPI Grid',
    command: 'npx shadcn@latest add https://uipkge.dev/r/react/kpi-grid.json',
    output: [
      '✔ Fetched manifest for kpi-grid (registry:ui)',
      '✔ Added components/ui/kpi-grid/KpiGrid.tsx',
      '✔ Verified CVA variants in kpi-grid.variants.ts',
      '✔ Installed transitive primitives: Card, Badge, Sparkline',
      '✔ Zero npm bundle overhead added to node_modules.',
    ],
  },
  {
    id: 'verify',
    label: '3. Parity Check',
    command: 'npm run check:parity',
    output: [
      '✔ Checking 31 shared CVA variant definitions...',
      '✔ Validating Vue 3.5 SFC and React 19 TSX type contracts...',
      '✔ Token synchronization: styles/tailwind.css (100% match)',
      '✔ PASS: Full cross-framework parity confirmed across all 300+ items.',
    ],
  },
]

export interface HeroDeveloperTerminalProps {
  className?: string
}

export function HeroDeveloperTerminal({ className }: HeroDeveloperTerminalProps) {
  const [activePresetIndex, setActivePresetIndex] = React.useState(0)
  const [displayedLines, setDisplayedLines] = React.useState<string[]>([])
  const [isExecuting, setIsExecuting] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [executionSpeed, setExecutionSpeed] = React.useState<1 | 2>(1)

  const executionTimeoutRef = React.useRef<NodeJS.Timeout[]>([])

  const clearTimeouts = () => {
    executionTimeoutRef.current.forEach((t) => clearTimeout(t))
    executionTimeoutRef.current = []
  }

  const runPreset = React.useCallback(
    (index: number) => {
      setActivePresetIndex(index)
      setDisplayedLines([])
      setIsExecuting(true)
      clearTimeouts()

      const currentPreset = presets[index]
      const lines = currentPreset.output
      const delay = executionSpeed === 1 ? 160 : 70

      lines.forEach((line, i) => {
        const timeout = setTimeout(
          () => {
            setDisplayedLines((prev) => [...prev, line])
            if (i === lines.length - 1) {
              setIsExecuting(false)
            }
          },
          (i + 1) * delay,
        )
        executionTimeoutRef.current.push(timeout)
      })
    },
    [executionSpeed],
  )

  React.useEffect(() => {
    runPreset(0)
    return () => clearTimeouts()
  }, [runPreset])

  const copyCommand = () => {
    const current = presets[activePresetIndex]
    navigator.clipboard.writeText(current.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentPreset = presets[activePresetIndex]

  return (
    <section
      data-slot="hero-developer-terminal"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      {/* Subtle Background Glow */}
      <div className="bg-primary/5 pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 rounded-full blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Value Proposition & CTAs (6 Cols) */}
        <div className="space-y-6 text-left lg:col-span-6">
          {/* Parity Badge */}
          <div className="border-border bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs shadow-xs">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-foreground font-medium">Dual-Framework UI Registry</span>
            <span className="text-muted-foreground">&bull;</span>
            <span className="text-muted-foreground">Vue 3.5 & React 19</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The unbundled UI registry for design engineers.
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
            Own your source code. Copy production-grade components and dense workbenches directly into your project with
            zero npm runtime lock-in.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2 font-semibold shadow-xs">
              <a href="#components">
                <span>Explore 300+ Blocks</span>
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2 font-medium">
              <a href="#spec">
                <Code2 className="text-muted-foreground size-4" />
                <span>Registry Spec</span>
              </a>
            </Button>
          </div>

          {/* Telemetry Metrics Strip */}
          <div className="border-border/80 grid grid-cols-3 gap-4 border-t pt-6 text-left">
            <div>
              <p className="text-foreground font-mono text-2xl font-bold">300+</p>
              <p className="text-muted-foreground mt-0.5 text-xs">Workbenches & Primitives</p>
            </div>
            <div>
              <p className="text-foreground font-mono text-2xl font-bold">0 kB</p>
              <p className="text-muted-foreground mt-0.5 text-xs">Runtime Package Bloat</p>
            </div>
            <div>
              <p className="text-foreground font-mono text-2xl font-bold">100%</p>
              <p className="text-muted-foreground mt-0.5 text-xs">Cross-Framework Parity</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Developer Terminal Workbench (6 Cols) */}
        <div className="lg:col-span-6">
          <Card className="border-border bg-card overflow-hidden rounded-xl shadow-sm">
            {/* Terminal Header */}
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
              {/* Window Controls & File Path */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-muted-foreground ml-2 font-mono text-xs">uipkge-cli &mdash; bash</span>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Speed Selector */}
                <button
                  type="button"
                  className="border-border bg-background text-muted-foreground hover:text-foreground rounded border px-2 py-0.5 font-mono text-xs transition-colors"
                  onClick={() => setExecutionSpeed((s) => (s === 1 ? 2 : 1))}
                >
                  {executionSpeed}x speed
                </button>

                {/* Copy Button */}
                <button
                  type="button"
                  className="border-border bg-background text-muted-foreground hover:text-foreground flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs transition-colors"
                  onClick={copyCommand}
                >
                  {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Preset Navigation Tabs */}
            <div className="border-border/80 bg-muted/20 flex items-center overflow-x-auto border-b px-2">
              {presets.map((preset, idx) => (
                <button
                  key={preset.id}
                  type="button"
                  className={cn(
                    'border-b-2 px-3 py-2 font-mono text-xs whitespace-nowrap transition-colors',
                    activePresetIndex === idx
                      ? 'border-primary text-foreground bg-background/50 font-semibold'
                      : 'text-muted-foreground hover:text-foreground border-transparent',
                  )}
                  onClick={() => runPreset(idx)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Terminal Content Viewport */}
            <div className="bg-card min-h-[220px] space-y-3 p-4 font-mono text-xs sm:p-5">
              {/* Command Input Line */}
              <div className="text-foreground flex items-start gap-2">
                <span className="text-primary font-bold select-none">&gt;</span>
                <span className="text-foreground font-medium break-all">{currentPreset.command}</span>
              </div>

              {/* Output Lines */}
              <div className="space-y-1.5 pt-1">
                {displayedLines.map((line, idx) => (
                  <div key={idx} className="text-muted-foreground flex items-center gap-2 transition-all duration-150">
                    <span className="shrink-0 font-bold text-emerald-500 select-none">&check;</span>
                    <span className="text-xs">{line.replace(/^✔\s*/, '')}</span>
                  </div>
                ))}

                {/* Typing / Loading Cursor */}
                {isExecuting && (
                  <div className="text-muted-foreground flex items-center gap-2 pt-1">
                    <span className="bg-primary size-1.5 rounded-full" />
                    <span className="text-muted-foreground text-xs italic">Streaming AST payload...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Footer Status Bar */}
            <div className="border-border bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-4 py-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Registry v2.4.0 (OKLCH)</span>
              </div>
              <button
                type="button"
                className="text-primary inline-flex items-center gap-1 hover:underline"
                onClick={() => runPreset(activePresetIndex)}
              >
                <RotateCcw className="size-3" />
                <span>Re-run</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default HeroDeveloperTerminal
