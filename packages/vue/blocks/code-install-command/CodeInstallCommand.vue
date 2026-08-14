<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy, Terminal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = withDefaults(defineProps<{ pkg?: string; version?: string }>(), {
  pkg: '@northwind/metrics',
  version: '2.4.0',
})

// One package name, four managers — derived rather than duplicated so a rename
// cannot leave one tab pointing at the old package.
const managers = computed(() => [
  { id: 'npm', command: `npm install ${props.pkg}` },
  { id: 'pnpm', command: `pnpm add ${props.pkg}` },
  { id: 'yarn', command: `yarn add ${props.pkg}` },
  { id: 'bun', command: `bun add ${props.pkg}` },
])

const copied = ref('')

async function copy(command: string, id: string) {
  try {
    await navigator.clipboard.writeText(command)
    copied.value = id
    setTimeout(() => (copied.value = ''), 1600)
  } catch {
    // Clipboard blocked (insecure context or denied permission): leave the
    // command visible so it can still be selected by hand.
  }
}
</script>

<template>
  <section data-slot="code-install-command" class="bg-background">
    <div class="mx-auto max-w-3xl px-6 py-20">
      <div class="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" class="gap-1.5">
          <Terminal class="size-3" aria-hidden="true" />
          Install
        </Badge>
        <span class="text-muted-foreground font-mono text-xs">resolved {{ pkg }}@{{ version }}</span>
      </div>

      <h2 class="mt-4 text-2xl font-semibold tracking-tight">One command, then you own the source</h2>

      <Tabs default-value="npm" class="mt-6">
        <TabsList variant="segmented" class="flex-nowrap overflow-x-auto">
          <TabsTrigger v-for="manager in managers" :key="manager.id" :value="manager.id" variant="segmented">
            {{ manager.id }}
          </TabsTrigger>
        </TabsList>

        <TabsContent v-for="manager in managers" :key="manager.id" :value="manager.id" class="mt-4">
          <div class="border-border bg-card flex items-stretch overflow-hidden rounded-lg border">
            <span class="text-primary grid shrink-0 place-items-center px-3 font-mono text-xs select-none">$</span>
            <code class="bg-muted/25 min-w-0 flex-1 truncate px-3 py-2.5 font-mono text-sm">
              {{ manager.command }}
            </code>
            <Button
              variant="ghost"
              class="border-border h-auto shrink-0 rounded-none border-l px-3"
              :aria-label="`Copy ${manager.id} command`"
              @click="copy(manager.command, manager.id)"
            >
              <Check v-if="copied === manager.id" class="text-success size-4" aria-hidden="true" />
              <Copy v-else class="size-4" aria-hidden="true" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <p class="text-muted-foreground mt-4 text-sm leading-relaxed">
        Writes the component source into <code class="bg-muted rounded px-1 py-0.5 font-mono text-xs">components/</code>
        and adds nothing to your lockfile beyond the icon set. Edit it like any other file in your repo.
      </p>
    </div>
  </section>
</template>
