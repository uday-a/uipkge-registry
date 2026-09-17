<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Calendar, CheckCircle2, Lock, Mail, ShieldCheck, Sparkles, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const email = ref('')
const teamSize = ref('11-50')
const frameworkFocus = ref('Dual-Framework Monorepo')
const isSubmitted = ref(false)

function submitDemoRequest() {
  if (!email.value) return
  isSubmitted.value = true
}
</script>

<template>
  <section
    data-slot="cta-split-demo-request-modal"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Calendar class="text-primary size-3.5" />
          Enterprise Design System Strategy
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Schedule an architectural walkthrough.
        </h2>
        <p class="text-muted-foreground text-base">
          See how unbundled registries and dual-framework tokens accelerate enterprise frontend velocity.
        </p>
      </div>

      <!-- Split Workbench Container -->
      <div class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <!-- Left Column: Enterprise Benefits (6 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-xl sm:p-8 lg:col-span-6"
        >
          <div class="space-y-6">
            <h3 class="text-foreground font-mono text-xl font-bold">What you'll discover on the call:</h3>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="bg-primary/10 border-primary/20 text-primary shrink-0 rounded-lg border p-2">
                  <Zap class="size-4" />
                </div>
                <div>
                  <h4 class="text-foreground font-mono text-xs font-bold">Eliminating NPM Semver Bottlenecks</h4>
                  <p class="text-muted-foreground mt-0.5 text-xs">
                    How code ownership prevents breaking upgrades and unblocks feature teams.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="bg-primary/10 border-primary/20 text-primary shrink-0 rounded-lg border p-2">
                  <ShieldCheck class="size-4" />
                </div>
                <div>
                  <h4 class="text-foreground font-mono text-xs font-bold">
                    Private Registry Mirroring &amp; Air-Gapping
                  </h4>
                  <p class="text-muted-foreground mt-0.5 text-xs">
                    Host internal organizational registries behind your enterprise firewall with custom security audits.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="bg-primary/10 border-primary/20 text-primary shrink-0 rounded-lg border p-2">
                  <Sparkles class="size-4" />
                </div>
                <div>
                  <h4 class="text-foreground font-mono text-xs font-bold">Tailwind CSS v4 Token Architecture</h4>
                  <p class="text-muted-foreground mt-0.5 text-xs">
                    100% mathematical token sync across Vue 3.5 SFCs and React 19 TSX islands.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Trust footer -->
          <div
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs"
          >
            <span class="flex items-center gap-1.5">
              <Lock class="text-primary size-3.5" /> NDA Protected &bull; No Obligation
            </span>
            <span class="font-semibold text-emerald-500">&check; 30-Min Fast Track</span>
          </div>
        </Card>

        <!-- Right Column: Interactive Scheduling Form (6 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-sm sm:p-8 lg:col-span-6"
        >
          <div v-if="!isSubmitted" class="space-y-5">
            <div class="space-y-1">
              <h3 class="text-foreground font-mono text-lg font-bold">Request Your Custom Demo</h3>
              <p class="text-muted-foreground text-xs">
                Fill in your team details to receive an instant calendar invite.
              </p>
            </div>

            <!-- Email Field -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground font-mono text-xs">Work Email Address</label>
              <div class="relative">
                <Mail class="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <Input
                  v-model="email"
                  type="email"
                  placeholder="alex@company.com"
                  class="bg-card border-border h-10 rounded-xl pl-10 font-mono text-xs shadow-xs"
                />
              </div>
            </div>

            <!-- Team Size Picker -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground font-mono text-xs">Engineering Team Size</label>
              <div class="grid grid-cols-4 gap-1.5">
                <button
                  v-for="size in ['1-10', '11-50', '50-200', '200+']"
                  :key="size"
                  type="button"
                  class="rounded-lg border py-1.5 text-center font-mono text-xs transition-all"
                  :class="
                    teamSize === size
                      ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  "
                  @click="teamSize = size"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Framework Focus -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground font-mono text-xs">Primary Architecture Focus</label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="fw in ['Vue / Nuxt', 'React / Next', 'Dual-Framework']"
                  :key="fw"
                  type="button"
                  class="rounded-lg border py-1.5 text-center font-mono text-xs transition-all"
                  :class="
                    frameworkFocus === fw
                      ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  "
                  @click="frameworkFocus = fw"
                >
                  {{ fw }}
                </button>
              </div>
            </div>

            <Button class="mt-2 h-10 w-full gap-1.5 font-mono text-xs shadow-md" @click="submitDemoRequest">
              <span>Confirm &amp; Pick Time Slot</span>
              <ArrowRight class="size-3.5" />
            </Button>
          </div>

          <!-- Submitted confirmation state -->
          <div v-else class="space-y-4 py-12 text-center">
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
            >
              <CheckCircle2 class="size-6" />
            </div>
            <div class="space-y-1">
              <h4 class="text-foreground font-mono text-base font-bold">Demo Request Received</h4>
              <p class="text-muted-foreground mx-auto max-w-xs text-xs">
                We've sent calendar access to <span class="text-foreground font-mono font-semibold">{{ email }}</span
                >. Check your inbox to select a time.
              </p>
            </div>
            <Button size="sm" variant="outline" class="font-mono text-xs" @click="isSubmitted = false">
              Submit Another Request
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
