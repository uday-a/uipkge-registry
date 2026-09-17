<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Terminal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const props = withDefaults(defineProps<{ lineDelay?: number }>(), { lineDelay: 420 })

const lines = [
  { kind: 'prompt', text: 'npx @northwind/cli connect snowflake' },
  { kind: 'out', text: 'Testing credentials…  ok' },
  { kind: 'out', text: 'Mirroring schema…     412 tables' },
  { kind: 'prompt', text: 'npx @northwind/cli certify revenue_net' },
  { kind: 'out', text: 'Reconciling 4 quarters…' },
  { kind: 'out', text: 'Q1 ✓   Q2 ✓   Q3 ✓   Q4 ✓' },
  { kind: 'ok', text: 'revenue_net certified · 41 consumers notified' },
]

// Renders the whole transcript immediately when the viewer prefers reduced
// motion; otherwise reveals a line at a time from mount.
const shown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    shown.value = lines.length
    return
  }
  timer = setInterval(() => {
    shown.value += 1
    if (shown.value >= lines.length) clearInterval(timer)
  }, props.lineDelay)
})

onBeforeUnmount(() => clearInterval(timer))

function toneClass(kind: string) {
  if (kind === 'prompt') return 'text-foreground'
  if (kind === 'ok') return 'text-success'
  return 'text-muted-foreground'
}
</script>

<template>
  <section data-slot="code-terminal-session" class="bg-background">
    <div class="mx-auto max-w-3xl px-6 py-20">
      <Badge variant="secondary" class="gap-1.5">
        <Terminal class="size-3" aria-hidden="true" />
        CLI
      </Badge>
      <h2 class="mt-4 text-2xl font-semibold tracking-tight">Connected and certified in two commands</h2>
      <p class="text-muted-foreground mt-2">
        The CLI does everything the UI does, so the first rollout can live in a script.
      </p>

      <Card class="mt-6">
        <CardContent class="p-0">
          <div class="border-border flex items-center gap-1.5 border-b px-4 py-2.5">
            <span class="bg-muted-foreground/30 size-2.5 rounded-full" aria-hidden="true" />
            <span class="bg-muted-foreground/30 size-2.5 rounded-full" aria-hidden="true" />
            <span class="bg-muted-foreground/30 size-2.5 rounded-full" aria-hidden="true" />
            <span class="text-muted-foreground ml-2 font-mono text-xs">bash — northwind</span>
          </div>

          <!-- min-h holds the final transcript height from the first paint, so
               the card does not grow line by line and shove the page down. -->
          <div class="min-h-[13.5rem] space-y-1 p-4 font-mono text-xs leading-relaxed">
            <p v-for="(line, index) in lines.slice(0, shown)" :key="index" :class="toneClass(line.kind)">
              <span v-if="line.kind === 'prompt'" class="text-primary select-none">$ </span>{{ line.text }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" class="mt-6">Read the CLI reference</Button>
    </div>
  </section>
</template>
