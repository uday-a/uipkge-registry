<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, ArrowLeftRight, CheckCircle2, PackageX, Sparkles } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const sliderPosition = ref(50) // 0 to 100%

function setPreset(pos: number) {
  sliderPosition.value = pos
}
</script>

<template>
  <section
    data-slot="feature-comparison-slider"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <ArrowLeftRight class="text-primary size-3.5" />
          Side-by-Side architectural upgrade
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Monolithic npm packages vs Unbundled code ownership.
        </h2>
        <p class="text-muted-foreground text-base">
          Drag the slider to compare how UIPKGE eliminates dependency chains, bundle bloat, and breaking semver updates.
        </p>

        <!-- Slider Quick Presets -->
        <div class="flex items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            class="font-mono text-xs"
            :class="sliderPosition === 0 ? 'border-primary bg-primary/10 text-primary' : ''"
            @click="setPreset(0)"
          >
            100% Monolith
          </Button>
          <Button
            size="sm"
            variant="outline"
            class="font-mono text-xs"
            :class="sliderPosition === 50 ? 'border-primary bg-primary/10 text-primary' : ''"
            @click="setPreset(50)"
          >
            50 / 50 Comparison
          </Button>
          <Button
            size="sm"
            variant="outline"
            class="font-mono text-xs"
            :class="sliderPosition === 100 ? 'border-primary bg-primary/10 text-primary' : ''"
            @click="setPreset(100)"
          >
            100% UIPKGE Registry
          </Button>
        </div>
      </div>

      <!-- Interactive Comparison Container -->
      <Card class="border-border bg-card relative overflow-hidden rounded-2xl shadow-sm select-none">
        <!-- Dual Split View Canvas -->
        <div class="grid min-h-[460px] grid-cols-1 md:grid-cols-2">
          <!-- Left Side: Monolithic Approach -->
          <div
            class="bg-destructive/5 border-border flex flex-col justify-between space-y-6 border-b p-6 text-left sm:p-8 md:border-r md:border-b-0"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Badge
                  variant="outline"
                  class="text-destructive bg-destructive/10 border-destructive/20 gap-1.5 font-mono text-xs"
                >
                  <PackageX class="size-3.5" /> Traditional NPM Package
                </Badge>
                <span class="text-muted-foreground font-mono text-xs">Locked in node_modules</span>
              </div>

              <h3 class="text-foreground font-mono text-xl font-bold">Black-Box Dependency Hell</h3>
              <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Monolithic component libraries ship compiled bundles with opaque internals, forcing you to fight CSS
                specificity and wait months for upstream bug fixes.
              </p>

              <!-- Pain Points List -->
              <ul class="space-y-2.5 pt-2">
                <li class="text-muted-foreground flex items-start gap-2 text-xs">
                  <AlertTriangle class="text-destructive mt-0.5 size-4 shrink-0" />
                  <span><strong>640 kB vendor chunk:</strong> Ships all 80+ unused components to production.</span>
                </li>
                <li class="text-muted-foreground flex items-start gap-2 text-xs">
                  <AlertTriangle class="text-destructive mt-0.5 size-4 shrink-0" />
                  <span
                    ><strong>Breaking semver upgrades:</strong> Upgrading minor versions breaks custom CSS
                    overrides.</span
                  >
                </li>
                <li class="text-muted-foreground flex items-start gap-2 text-xs">
                  <AlertTriangle class="text-destructive mt-0.5 size-4 shrink-0" />
                  <span
                    ><strong>CVE vulnerability surface:</strong> Deep transitive dependency chains trigger security
                    flags.</span
                  >
                </li>
              </ul>
            </div>

            <div
              class="border-destructive/20 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-3.5 font-mono text-xs"
            >
              <span>Maintenance Overhead</span>
              <span class="font-bold">High (24 hrs/mo)</span>
            </div>
          </div>

          <!-- Right Side: UIPKGE Unbundled Architecture -->
          <div class="flex flex-col justify-between space-y-6 bg-emerald-500/5 p-6 text-left sm:p-8">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Badge
                  variant="outline"
                  class="gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <Sparkles class="size-3.5" /> UIPKGE Component Registry
                </Badge>
                <span class="font-mono text-xs font-semibold text-emerald-500">100% Owned Source</span>
              </div>

              <h3 class="text-foreground font-mono text-xl font-bold">Direct Code Ownership</h3>
              <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Source files copied directly into your repository. You have absolute control over every token, prop,
                micro-interaction, and layout shape.
              </p>

              <!-- Superpowers List -->
              <ul class="space-y-2.5 pt-2">
                <li class="text-foreground/90 flex items-start gap-2 text-xs">
                  <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span
                    ><strong>Zero bundle bloat:</strong> Only the exact component files you install exist in your
                    app.</span
                  >
                </li>
                <li class="text-foreground/90 flex items-start gap-2 text-xs">
                  <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span
                    ><strong>Zero breaking updates:</strong> No package updates ever modify your codebase without your
                    consent.</span
                  >
                </li>
                <li class="text-foreground/90 flex items-start gap-2 text-xs">
                  <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span
                    ><strong>Zero CVE risk:</strong> No third-party runtime dependencies or obscure node_modules
                    wrappers.</span
                  >
                </li>
              </ul>
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-600 dark:text-emerald-400"
            >
              <span>Maintenance Overhead</span>
              <span class="font-bold">Zero (Permanent Stability)</span>
            </div>
          </div>
        </div>

        <!-- Slider Range Bar at Bottom -->
        <div class="bg-muted/40 border-border flex items-center gap-4 border-t p-4">
          <span class="text-destructive shrink-0 font-mono text-xs">Monolith</span>
          <input
            v-model="sliderPosition"
            type="range"
            min="0"
            max="100"
            class="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
          />
          <span class="shrink-0 font-mono text-xs font-semibold text-emerald-500">UIPKGE</span>
        </div>
      </Card>
    </div>
  </section>
</template>
