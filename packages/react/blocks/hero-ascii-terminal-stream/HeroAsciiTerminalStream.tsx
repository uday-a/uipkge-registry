import * as React from 'react'
import { ArrowRight, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface HeroAsciiTerminalStreamProps {
  title?: string
  description?: string
  className?: string
}

const ASCII_BANNER = `
  _   _ ___ ____  _  ______ _____ 
 | | | |_ _|  _ \\| |/ / ___| ____|
 | | | || || |_) | ' / |  _|  _|  
 | |_| || ||  __/| . \\ |_| | |___ 
  \\___/|___|_|   |_|\\_\\____|_____|
  ================================
  DUAL-FRAMEWORK UNBUNDLED REGISTRY
`

export function HeroAsciiTerminalStream({
  title = 'Deterministic UI engineering stream for technical operators.',
  description = 'Inspect build outputs, verify zero-dependency bundle telemetry, and stream component ASTs in real time with hardware precision.',
  className,
}: HeroAsciiTerminalStreamProps) {
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([
    'INIT: Initializing UIPKGE dual-framework AST registry...',
    'RESOLVE: Synchronizing @uipkge/button -> Vue 3.5 & React 19',
    'OKLCH: Loaded 48 semantic color variables from packages/shared',
    'BENCHMARK: Cold compilation completed in 1.42ms (zero dead code)',
    'READY: Terminal listening on edge:8080',
  ])
  const [inputCommand, setInputCommand] = React.useState('')
  const [isRunning, setIsRunning] = React.useState(false)

  function runCommand(cmd: string) {
    const cleanCmd = cmd.trim().toLowerCase()
    if (!cleanCmd) return

    setTerminalLogs((prev) => [...prev, `$ ${cleanCmd}`])
    setIsRunning(true)

    setTimeout(() => {
      if (cleanCmd === 'clear') {
        setTerminalLogs(['TERMINAL: Buffer cleared.'])
      } else if (cleanCmd === 'bench') {
        setTerminalLogs((prev) => [
          ...prev,
          'BENCHMARK: Button (1.1kb) | Modal (2.8kb) | DataGrid (4.2kb)',
          'RESULT: 100% Tree-shaken bundle efficiency.',
        ])
      } else if (cleanCmd === 'parity') {
        setTerminalLogs((prev) => [
          ...prev,
          'PARITY: 31 variant tokens evaluated across Vue & React.',
          'STATUS: [PASS] Zero framework divergence detected.',
        ])
      } else if (cleanCmd === 'tree') {
        setTerminalLogs((prev) => [...prev, 'TREE: packages/registry-vue (471) <-> packages/registry-react (471)'])
      } else {
        setTerminalLogs((prev) => [...prev, `EXEC: Command '${cleanCmd}' executed with exit code 0.`])
      }
      setIsRunning(false)
    }, 400)

    setInputCommand('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runCommand(inputCommand)
  }

  return (
    <section
      data-slot="hero-ascii-terminal-stream"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#ascii-terminal"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Terminal className="text-primary size-3.5" />
            <span>Real-time ASCII Telemetry Stream</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>

          {/* Command Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-muted-foreground text-xs">Quick commands:</span>
            {['bench', 'parity', 'tree', 'clear'].map((chip) => (
              <button
                key={chip}
                type="button"
                className="border-border bg-muted/40 hover:bg-muted text-foreground rounded border px-2 py-0.5 font-mono text-xs transition-colors"
                onClick={() => runCommand(chip)}
              >
                ${chip}
              </button>
            ))}
          </div>
        </div>

        {/* Main ASCII Terminal Card */}
        <div className="mx-auto mt-12 max-w-4xl">
          <Card className="border-border bg-card overflow-hidden font-mono text-xs shadow-lg">
            {/* Terminal Title Bar */}
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-foreground pl-2 text-xs font-bold">uipkge-telemetry-cli &bull; zsh</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>60 FPS</span>
                </span>
                <span>1.2MB RSS</span>
              </div>
            </div>

            {/* Terminal Content Viewport */}
            <CardContent className="bg-background/95 space-y-4 p-6">
              {/* ASCII Art Banner */}
              <pre className="text-primary overflow-x-auto text-xs leading-tight font-bold select-none">
                <code>{ASCII_BANNER}</code>
              </pre>

              {/* Logs Stream Output */}
              <div className="border-border/80 max-h-56 space-y-1.5 overflow-y-auto border-t pt-2 text-xs">
                {terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'leading-relaxed',
                      log.startsWith('$')
                        ? 'text-primary font-bold'
                        : log.includes('PASS') || log.includes('OKLCH')
                          ? 'text-emerald-500'
                          : 'text-muted-foreground',
                    )}
                  >
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Interactive Input Prompt */}
              <form className="border-border flex items-center gap-2 border-t pt-3" onSubmit={handleSubmit}>
                <span className="text-primary font-bold">&gt;</span>
                <input
                  type="text"
                  placeholder="Type command (e.g. bench, parity, clear)..."
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-xs focus-visible:outline-none"
                />
                <Button size="sm" type="submit" className="h-7 gap-1 px-2.5 text-xs">
                  <span>Run</span>
                  <ArrowRight className="size-3" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
