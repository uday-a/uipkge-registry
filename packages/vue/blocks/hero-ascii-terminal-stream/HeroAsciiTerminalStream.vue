<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Terminal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface HeroAsciiTerminalStreamProps {
  title?: string
  description?: string
  class?: string
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

const props = withDefaults(defineProps<HeroAsciiTerminalStreamProps>(), {
  title: 'Deterministic UI engineering stream for technical operators.',
  description:
    'Inspect build outputs, verify zero-dependency bundle telemetry, and stream component ASTs in real time with hardware precision.',
})

const terminalLogs = ref<string[]>([
  'INIT: Initializing UIPKGE dual-framework AST registry...',
  'RESOLVE: Synchronizing @uipkge/button -> Vue 3.5 & React 19',
  'OKLCH: Loaded 48 semantic color variables from packages/shared',
  'BENCHMARK: Cold compilation completed in 1.42ms (zero dead code)',
  'READY: Terminal listening on edge:8080',
])

const inputCommand = ref('')
const isRunning = ref(false)

function runCommand(cmd: string) {
  const cleanCmd = cmd.trim().toLowerCase()
  if (!cleanCmd) return

  terminalLogs.value.push(`$ ${cleanCmd}`)
  isRunning.value = true

  setTimeout(() => {
    if (cleanCmd === 'clear') {
      terminalLogs.value = ['TERMINAL: Buffer cleared.']
    } else if (cleanCmd === 'bench') {
      terminalLogs.value.push('BENCHMARK: Button (1.1kb) | Modal (2.8kb) | DataGrid (4.2kb)')
      terminalLogs.value.push('RESULT: 100% Tree-shaken bundle efficiency.')
    } else if (cleanCmd === 'parity') {
      terminalLogs.value.push('PARITY: 31 variant tokens evaluated across Vue & React.')
      terminalLogs.value.push('STATUS: [PASS] Zero framework divergence detected.')
    } else if (cleanCmd === 'tree') {
      terminalLogs.value.push('TREE: packages/registry-vue (471) <-> packages/registry-react (471)')
    } else {
      terminalLogs.value.push(`EXEC: Command '${cleanCmd}' executed with exit code 0.`)
    }
    isRunning.value = false
  }, 400)

  inputCommand.value = ''
}
</script>

<template>
  <section
    data-slot="hero-ascii-terminal-stream"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#ascii-terminal"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Terminal class="text-primary size-3.5" />
          <span>Real-time ASCII Telemetry Stream</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 class="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {{ title }}
        </h1>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>

        <!-- Command Chips -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span class="text-muted-foreground text-xs">Quick commands:</span>
          <button
            v-for="chip in ['bench', 'parity', 'tree', 'clear']"
            :key="chip"
            type="button"
            class="border-border bg-muted/40 hover:bg-muted text-foreground rounded border px-2 py-0.5 font-mono text-xs transition-colors"
            @click="runCommand(chip)"
          >
            ${{ chip }}
          </button>
        </div>
      </div>

      <!-- Main ASCII Terminal Card -->
      <div class="mx-auto mt-12 max-w-4xl">
        <Card class="border-border bg-card overflow-hidden font-mono text-xs shadow-lg">
          <!-- Terminal Title Bar -->
          <div class="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="size-2.5 rounded-full bg-red-500/80" />
                <span class="size-2.5 rounded-full bg-amber-500/80" />
                <span class="size-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span class="text-foreground pl-2 text-xs font-bold">uipkge-telemetry-cli &bull; zsh</span>
            </div>
            <div class="text-muted-foreground flex items-center gap-3 text-xs">
              <span class="flex items-center gap-1">
                <span class="size-1.5 rounded-full bg-emerald-500" />
                <span>60 FPS</span>
              </span>
              <span>1.2MB RSS</span>
            </div>
          </div>

          <!-- Terminal Content Viewport -->
          <CardContent class="bg-background/95 space-y-4 p-6">
            <!-- ASCII Art Banner -->
            <pre
              class="text-primary overflow-x-auto text-xs leading-tight font-bold select-none"
            ><code>{{ ASCII_BANNER }}</code></pre>

            <!-- Logs Stream Output -->
            <div class="border-border/80 max-h-56 space-y-1.5 overflow-y-auto border-t pt-2 text-xs">
              <div
                v-for="(log, idx) in terminalLogs"
                :key="idx"
                :class="
                  cn(
                    'leading-relaxed',
                    log.startsWith('$')
                      ? 'text-primary font-bold'
                      : log.includes('PASS') || log.includes('OKLCH')
                        ? 'text-emerald-500'
                        : 'text-muted-foreground',
                  )
                "
              >
                {{ log }}
              </div>
            </div>

            <!-- Terminal Interactive Input Prompt -->
            <form
              class="border-border flex items-center gap-2 border-t pt-3"
              @submit.prevent="runCommand(inputCommand)"
            >
              <span class="text-primary font-bold">&gt;</span>
              <input
                v-model="inputCommand"
                type="text"
                placeholder="Type command (e.g. bench, parity, clear)..."
                class="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-xs focus-visible:outline-none"
              />
              <Button size="sm" type="submit" class="h-7 gap-1 px-2.5 text-xs">
                <span>Run</span>
                <ArrowRight class="size-3" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
