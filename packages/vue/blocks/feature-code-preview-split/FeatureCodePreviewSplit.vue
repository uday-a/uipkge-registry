<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Code2, Copy, Eye, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type FrameworkTab = 'vue' | 'react' | 'tailwind'
type ButtonVariant = 'default' | 'secondary' | 'outline' | 'destructive'
type ButtonSize = 'sm' | 'default' | 'lg'

const activeFramework = ref<FrameworkTab>('vue')
const activeVariant = ref<ButtonVariant>('default')
const activeSize = ref<ButtonSize>('default')
const showIcon = ref(true)
const isCopied = ref(false)

const dynamicCode = computed(() => {
  if (activeFramework.value === 'vue') {
    const iconImport = showIcon.value ? "\nimport { Zap } from 'lucide-vue-next'" : ''
    const iconElement = showIcon.value ? '\n    <Zap class="size-4" />' : ''
    return `<script setup lang="ts">
import { Button } from '@/components/ui/button'${iconImport}
<\/script>

<template>
  <Button
    variant="${activeVariant.value}"
    size="${activeSize.value}"
    class="font-mono"
  >${iconElement}
    <span>Deploy Application</span>
  </Button>
</template>`
  }

  if (activeFramework.value === 'react') {
    const iconImport = showIcon.value ? "\nimport { Zap } from 'lucide-react'" : ''
    const iconElement = showIcon.value ? '\n      <Zap className="size-4" />' : ''
    return `'use client'

import { Button } from '@/components/ui/button'${iconImport}

export function DeployTrigger() {
  return (
    <Button
      variant="${activeVariant.value}"
      size="${activeSize.value}"
      className="font-mono"
    >${iconElement}
      <span>Deploy Application</span>
    </Button>
  )
}`
  }

  return `@theme inline {
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --radius-lg: 0.625rem;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
}`
})

function copyCode() {
  navigator.clipboard.writeText(dynamicCode.value)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 2000)
}
</script>

<template>
  <section
    data-slot="feature-code-preview-split"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-7xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Code2 class="text-primary size-3.5" />
          Interactive DX Playground
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Real-time code generation with instant live preview.
        </h2>
        <p class="text-muted-foreground text-base">
          Modify the interactive controls on the right to see the AST code synchronize live across Vue 3.5, React 19,
          and Tailwind v4.
        </p>
      </div>

      <!-- Split-Pane DX Workbench -->
      <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <!-- Left Pane: Interactive Code Sandbox Editor (7 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-4 rounded-2xl p-6 text-left shadow-sm lg:col-span-7"
        >
          <!-- Editor Top Bar -->
          <div class="border-border flex items-center justify-between border-b pb-3">
            <!-- Framework Selector Tabs -->
            <div class="bg-muted/60 border-border flex items-center gap-1 rounded-lg border p-1">
              <button
                type="button"
                class="rounded-md px-2.5 py-1 font-mono text-xs transition-all"
                :class="
                  activeFramework === 'vue'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeFramework = 'vue'"
              >
                Vue 3.5 SFC
              </button>
              <button
                type="button"
                class="rounded-md px-2.5 py-1 font-mono text-xs transition-all"
                :class="
                  activeFramework === 'react'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeFramework = 'react'"
              >
                React 19 JSX
              </button>
              <button
                type="button"
                class="rounded-md px-2.5 py-1 font-mono text-xs transition-all"
                :class="
                  activeFramework === 'tailwind'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeFramework = 'tailwind'"
              >
                Tailwind Tokens
              </button>
            </div>

            <!-- Copy Code Button -->
            <Button size="sm" variant="ghost" class="h-8 gap-1.5 px-2 font-mono text-xs" @click="copyCode">
              <Check v-if="isCopied" class="size-3.5 text-emerald-500" />
              <Copy v-else class="text-muted-foreground size-3.5" />
              <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
            </Button>
          </div>

          <!-- Code Viewport -->
          <pre
            class="border-border bg-muted/40 text-foreground my-2 flex-1 overflow-x-auto rounded-xl border p-4 font-mono text-xs leading-relaxed"
          ><code>{{ dynamicCode }}</code></pre>

          <!-- Footer Metadata -->
          <div
            class="text-muted-foreground border-border flex items-center justify-between border-t pt-3 font-mono text-xs"
          >
            <span
              >Syntax:
              {{
                activeFramework === 'vue'
                  ? 'Vue SFC + TS'
                  : activeFramework === 'react'
                    ? 'TypeScript TSX'
                    : 'CSS @theme'
              }}</span
            >
            <span class="font-semibold text-emerald-500">&check; 100% Tree-Shakeable</span>
          </div>
        </Card>

        <!-- Right Pane: Live Component Render & Controls (5 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-sm lg:col-span-5"
        >
          <div class="space-y-4">
            <div class="border-border flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <Eye class="text-primary size-4" />
                <h3 class="text-foreground font-mono text-xs font-bold">Interactive Component Canvas</h3>
              </div>
              <Badge
                variant="outline"
                class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                Live Render
              </Badge>
            </div>

            <!-- Live Rendered Component Center Stage -->
            <div
              class="border-border bg-background/50 flex h-44 items-center justify-center rounded-xl border border-dashed p-6 transition-all"
            >
              <Button :variant="activeVariant" :size="activeSize" class="gap-2 font-mono shadow-sm transition-all">
                <Zap v-if="showIcon" class="size-4" />
                <span>Deploy Application</span>
              </Button>
            </div>
          </div>

          <!-- Component Controls Box -->
          <div class="border-border space-y-4 border-t pt-2">
            <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">Interactive Prop Controls</p>

            <!-- Variant Selector -->
            <div class="space-y-1.5">
              <span class="text-muted-foreground font-mono text-xs">Variant:</span>
              <div class="grid grid-cols-2 gap-1.5">
                <button
                  v-for="v in ['default', 'secondary', 'outline', 'destructive'] as ButtonVariant[]"
                  :key="v"
                  type="button"
                  class="rounded-lg border px-2.5 py-1 text-center font-mono text-xs capitalize transition-all"
                  :class="
                    activeVariant === v
                      ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  "
                  @click="activeVariant = v"
                >
                  {{ v }}
                </button>
              </div>
            </div>

            <!-- Size Selector & Icon Toggle -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <span class="text-muted-foreground font-mono text-xs">Size:</span>
                <div class="flex items-center gap-1">
                  <button
                    v-for="s in ['sm', 'default', 'lg'] as ButtonSize[]"
                    :key="s"
                    type="button"
                    class="flex-1 rounded-lg border py-1 text-center font-mono text-xs uppercase transition-all"
                    :class="
                      activeSize === s
                        ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'border-border bg-card text-muted-foreground'
                    "
                    @click="activeSize = s"
                  >
                    {{ s === 'default' ? 'md' : s }}
                  </button>
                </div>
              </div>

              <div class="space-y-1.5">
                <span class="text-muted-foreground font-mono text-xs">Leading Icon:</span>
                <Button
                  size="sm"
                  variant="outline"
                  class="h-7 w-full font-mono text-xs"
                  :class="showIcon ? 'border-primary text-primary' : 'text-muted-foreground'"
                  @click="showIcon = !showIcon"
                >
                  {{ showIcon ? 'Enabled' : 'Disabled' }}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
