<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Check, Copy, Sparkles, Terminal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn'

const packageManager = ref<PackageManager>('pnpm')
const isCopied = ref(false)

const cliCommand = computed(() => {
  switch (packageManager.value) {
    case 'pnpm':
      return 'pnpm dlx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json'
    case 'npm':
      return 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json'
    case 'bun':
      return 'bunx --bun shadcn-vue@latest add https://uipkge.dev/r/vue/init.json'
    case 'yarn':
      return 'yarn dlx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json'
  }
})

function copyCommand() {
  navigator.clipboard.writeText(cliCommand.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <section
    data-slot="cta-gradient-glow-action"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="relative mx-auto max-w-5xl">
      <!-- Ambient Glow Behind CTA Card -->
      <div
        class="from-primary/30 to-primary/30 pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-60 blur-2xl"
      />

      <!-- Main CTA Card -->
      <Card
        class="border-border bg-card/95 relative space-y-8 overflow-hidden rounded-3xl p-8 text-center shadow-sm backdrop-blur-xl sm:p-14"
      >
        <!-- Floating decorative badge -->
        <div
          class="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs"
        >
          <Sparkles class="size-3.5" />
          <span>Production Ready &bull; Unbundled Distribution</span>
        </div>

        <!-- Headline & Subtitle -->
        <div class="mx-auto max-w-2xl space-y-3">
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Start building with unbundled code in 30 seconds.
          </h2>
          <p class="text-muted-foreground text-base sm:text-lg">
            Run the init command below to copy calibrated tokens, utilities, and primitives directly into your
            repository.
          </p>
        </div>

        <!-- CLI Installation Terminal Box -->
        <div class="mx-auto max-w-xl space-y-2">
          <!-- Package manager selector tabs -->
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-1">
              <button
                v-for="pm in ['pnpm', 'npm', 'bun', 'yarn'] as PackageManager[]"
                :key="pm"
                type="button"
                class="rounded-md px-2.5 py-0.5 font-mono text-xs uppercase transition-all"
                :class="
                  packageManager === pm
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="packageManager = pm"
              >
                {{ pm }}
              </button>
            </div>
            <span class="text-muted-foreground font-mono text-xs">Single Command Init</span>
          </div>

          <!-- Command Display Strip -->
          <div
            class="border-border bg-muted/50 text-foreground flex items-center justify-between gap-3 overflow-hidden rounded-xl border p-3.5 text-left font-mono text-xs shadow-inner sm:p-4"
          >
            <div class="flex min-w-0 items-center gap-2">
              <Terminal class="text-primary size-4 shrink-0" />
              <span class="truncate font-semibold select-all">{{ cliCommand }}</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              class="h-8 shrink-0 gap-1.5 px-3 font-mono text-xs"
              @click="copyCommand"
            >
              <Check v-if="isCopied" class="size-3.5 text-emerald-500" />
              <Copy v-else class="text-muted-foreground size-3.5" />
              <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
            </Button>
          </div>
        </div>

        <!-- Action Links -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button size="lg" class="h-11 gap-2 px-6 font-mono text-xs shadow-md">
            <span>Browse 450+ Component Blocks</span>
            <ArrowRight class="size-4" />
          </Button>
        </div>

        <!-- Developer Trust Assurance Badges -->
        <div
          class="border-border/60 text-muted-foreground flex flex-wrap items-center justify-center gap-6 border-t pt-6 font-mono text-xs sm:gap-10"
        >
          <div class="flex items-center gap-1.5">
            <Check class="size-4 text-emerald-500" />
            <span>100% Free &amp; Open Source (MIT)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Check class="size-4 text-emerald-500" />
            <span>Zero Vendor NPM Dependencies</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Check class="size-4 text-emerald-500" />
            <span>Dual-Framework AST Parity</span>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>
