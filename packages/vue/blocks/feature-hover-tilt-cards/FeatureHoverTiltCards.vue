<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Eye,
  Layers,
  LayoutGrid,
  Maximize2,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Interactive card state tracking for 3D perspective effect
const cardRotations = reactive<Record<number, { rx: number; ry: number; active: boolean }>>({
  0: { rx: 0, ry: 0, active: false },
  1: { rx: 0, ry: 0, active: false },
  2: { rx: 0, ry: 0, active: false },
})

function handleMouseMove(e: MouseEvent, index: number) {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -7
  const rotateY = ((x - centerX) / centerX) * 7

  cardRotations[index] = { rx: rotateX, ry: rotateY, active: true }
}

function handleMouseLeave(index: number) {
  cardRotations[index] = { rx: 0, ry: 0, active: false }
}

// Card 1 Interactive Token Scale Slider
const tokenScale = ref(100)

// Card 2 Interactive Spring Frequency
const springFrequency = ref(180)
const isPulsing = ref(false)

function triggerSpringTest() {
  isPulsing.value = true
  setTimeout(() => (isPulsing.value = false), 600)
}

// Card 3 Interactive Framework Output Toggle
const activeMirror = ref<'vue' | 'react'>('vue')

// Kept in script: a literal `<script` inside a template interpolation trips
// prettier's HTML parser (it looks like a real tag open).
const mirrorBadges = {
  vue: '<script setup lang="ts"> + Reka UI',
  react: "'use client' + Radix UI",
} as const
</script>

<template>
  <section
    data-slot="feature-hover-tilt-cards"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-7xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Eye class="text-primary size-3.5" />
          Tactile Physics &amp; Surface Depth
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Engineered for tactile feedback &amp; micro-interactions.
        </h2>
        <p class="text-muted-foreground text-base">
          Hover over each workbench card to experience hardware-accelerated 3D depth and live interactive physics.
        </p>
      </div>

      <!-- 3D Perspective Tilt Cards Grid -->
      <div class="grid grid-cols-1 gap-6 [perspective:1200px] lg:grid-cols-3">
        <!-- Card 1: Unbundled Token Inspector -->
        <div
          class="transition-transform duration-200 ease-out will-change-transform"
          :style="{
            transform: `perspective(1000px) rotateX(${cardRotations[0].rx}deg) rotateY(${cardRotations[0].ry}deg)`,
          }"
          @mousemove="(e) => handleMouseMove(e, 0)"
          @mouseleave="() => handleMouseLeave(0)"
        >
          <Card
            class="border-border bg-card/95 hover:border-primary/50 relative flex h-full flex-col justify-between space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all hover:shadow-sm"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl font-mono">
                  <Layers class="size-4" />
                </div>
                <Badge variant="outline" class="font-mono text-xs">Zero Bloat</Badge>
              </div>

              <h3 class="text-foreground font-mono text-lg font-bold">Unbundled Code Ownership</h3>
              <p class="text-muted-foreground text-xs leading-relaxed">
                AST-level code generation puts pristine component source directly in your repository.
              </p>

              <!-- Interactive Token Scale Slider -->
              <div class="border-border bg-muted/30 mt-4 space-y-2 rounded-xl border p-3.5">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="text-muted-foreground">Tree-Shake Efficiency:</span>
                  <span class="font-bold text-emerald-500">{{ tokenScale }}%</span>
                </div>
                <input
                  v-model="tokenScale"
                  type="range"
                  min="50"
                  max="100"
                  class="accent-primary bg-border h-1.5 w-full cursor-pointer rounded-lg"
                />
                <p class="text-muted-foreground font-mono text-xs">
                  Unused variants automatically pruned at compile time.
                </p>
              </div>
            </div>

            <div
              class="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs"
            >
              <span>0 dependencies added</span>
              <span class="text-primary font-semibold">&check; Pure Source</span>
            </div>
          </Card>
        </div>

        <!-- Card 2: Spring Velocity Simulator -->
        <div
          class="transition-transform duration-200 ease-out will-change-transform"
          :style="{
            transform: `perspective(1000px) rotateX(${cardRotations[1].rx}deg) rotateY(${cardRotations[1].ry}deg)`,
          }"
          @mousemove="(e) => handleMouseMove(e, 1)"
          @mouseleave="() => handleMouseLeave(1)"
        >
          <Card
            class="border-border bg-card/95 hover:border-primary/50 relative flex h-full flex-col justify-between space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all hover:shadow-sm"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div
                  class="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 font-mono text-amber-500"
                >
                  <Zap class="size-4" />
                </div>
                <Badge variant="outline" class="border-amber-500/20 bg-amber-500/10 font-mono text-xs text-amber-500">
                  Fluid Motion
                </Badge>
              </div>

              <h3 class="text-foreground font-mono text-lg font-bold">Spring Physics Engine</h3>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Calibrated cubic-bezier curves for tactile, zero-overshoot micro-interactions.
              </p>

              <!-- Interactive Spring Trigger Box -->
              <div class="border-border bg-muted/30 mt-4 space-y-3 rounded-xl border p-3.5 text-center">
                <div
                  class="bg-primary text-primary-foreground mx-auto flex size-12 items-center justify-center rounded-2xl font-mono text-sm font-bold shadow-md transition-all duration-300"
                  :class="isPulsing ? 'scale-125 rotate-12 bg-emerald-500 ring-4 ring-emerald-500/30' : 'scale-100'"
                >
                  <Cpu class="size-5" />
                </div>

                <Button size="sm" variant="outline" class="h-8 w-full font-mono text-xs" @click="triggerSpringTest">
                  Trigger Spring Impulse
                </Button>
              </div>
            </div>

            <div
              class="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs"
            >
              <span>Duration: 180ms</span>
              <span class="font-semibold text-emerald-500">&check; 60fps Native</span>
            </div>
          </Card>
        </div>

        <!-- Card 3: Dual-Framework Mirror Comparator -->
        <div
          class="transition-transform duration-200 ease-out will-change-transform"
          :style="{
            transform: `perspective(1000px) rotateX(${cardRotations[2].rx}deg) rotateY(${cardRotations[2].ry}deg)`,
          }"
          @mousemove="(e) => handleMouseMove(e, 2)"
          @mouseleave="() => handleMouseLeave(2)"
        >
          <Card
            class="border-border bg-card/95 hover:border-primary/50 relative flex h-full flex-col justify-between space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all hover:shadow-sm"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 font-mono text-blue-500">
                  <LayoutGrid class="size-4" />
                </div>
                <Badge variant="outline" class="border-blue-500/20 bg-blue-500/10 font-mono text-xs text-blue-500">
                  1:1 Parity
                </Badge>
              </div>

              <h3 class="text-foreground font-mono text-lg font-bold">Dual-Framework Compiler</h3>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Identical DOM attributes, variants, and keyboard ergonomics across Vue 3.5 &amp; React 19.
              </p>

              <!-- Interactive Framework Switcher -->
              <div class="border-border bg-muted/30 mt-4 space-y-2 rounded-xl border p-3 font-mono text-xs">
                <div class="bg-background border-border flex items-center gap-1 rounded-lg border p-1">
                  <button
                    type="button"
                    class="flex-1 rounded py-1 text-center transition-all"
                    :class="
                      activeMirror === 'vue'
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground'
                    "
                    @click="activeMirror = 'vue'"
                  >
                    Vue 3.5 SFC
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded py-1 text-center transition-all"
                    :class="
                      activeMirror === 'react'
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground'
                    "
                    @click="activeMirror = 'react'"
                  >
                    React 19 JSX
                  </button>
                </div>
                <p class="text-muted-foreground pt-1 text-xs">
                  {{ mirrorBadges[activeMirror] }}
                </p>
              </div>
            </div>

            <div
              class="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs"
            >
              <span>AST Verified</span>
              <span class="text-primary font-semibold">&check; 100% Match</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
