<script setup lang="ts">
import { computed, ref } from 'vue'
import { Building2, Check, Copy, Headphones, MessageSquare, Send, ShieldCheck, Sparkles } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface InquiryType {
  id: string
  title: string
  subtitle: string
  sla: string
  icon: any
}

const inquiryTypes: InquiryType[] = [
  {
    id: 'enterprise',
    title: 'Enterprise Architecture',
    subtitle: 'Custom registries, zero-lockin migrations & multi-team governance',
    sla: '< 2h SLA',
    icon: Building2,
  },
  {
    id: 'support',
    title: 'Dedicated Engineering SLA',
    subtitle: '24/7 incident response, custom upstream bugfixes & private Slack channel',
    sla: '< 15m SLA',
    icon: Headphones,
  },
  {
    id: 'security',
    title: 'Security & Compliance Review',
    subtitle: 'SOC2 Type II audits, self-hosted registry mirrors & air-gapped deployments',
    sla: '< 4h SLA',
    icon: ShieldCheck,
  },
]

const globalHubs = [
  { city: 'San Francisco', tz: 'PST (UTC-8)', status: 'Active (09:00 - 18:00)', email: 'sf@uipkge.dev' },
  { city: 'London', tz: 'GMT (UTC+0)', status: 'Active (08:30 - 17:30)', email: 'london@uipkge.dev' },
  { city: 'Singapore', tz: 'SGT (UTC+8)', status: 'Active (09:00 - 18:00)', email: 'singapore@uipkge.dev' },
]

// Form State
const selectedType = ref('enterprise')
const name = ref('')
const email = ref('')
const company = ref('')
const teamSize = ref('10-50')
const message = ref('')
const sent = ref(false)
const ticketId = ref('')
const copiedTicket = ref(false)

const canSubmit = computed(() => name.value.trim() && email.value.trim() && message.value.trim())

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      type: string
      name: string
      email: string
      company: string
      teamSize: string
      message: string
      ticketId: string
    },
  ): void
}>()

function submit() {
  if (!canSubmit.value) return
  const generatedId = `UIP-${Math.floor(1000 + Math.random() * 9000)}`
  ticketId.value = generatedId

  emit('submit', {
    type: selectedType.value,
    name: name.value,
    email: email.value,
    company: company.value,
    teamSize: teamSize.value,
    message: message.value,
    ticketId: generatedId,
  })
  sent.value = true
}

function copyTicket() {
  navigator.clipboard.writeText(ticketId.value)
  copiedTicket.value = true
  setTimeout(() => (copiedTicket.value = false), 2000)
}
</script>

<template>
  <section data-slot="contact-01" class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-3">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Sparkles class="text-primary size-3.5" />
          Enterprise Engineering & Architecture Solutions
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Talk to a principal design engineer.
        </h2>
        <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
          No generic sales reps. Connect directly with the core team that architects our dual-framework registry, token
          engines, and headless workbenches.
        </p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <!-- Left Column: Inquiry Routing & Global Hubs (5 Cols) -->
        <div class="space-y-6 lg:col-span-5">
          <div class="space-y-3">
            <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">Select Engagement Track</p>
            <div class="space-y-2.5">
              <div
                v-for="track in inquiryTypes"
                :key="track.id"
                class="group cursor-pointer rounded-xl border p-4 transition-all"
                :class="
                  selectedType === track.id
                    ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40'
                "
                @click="selectedType = track.id"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="rounded-lg p-2 transition-colors"
                      :class="
                        selectedType === track.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      "
                    >
                      <component :is="track.icon" class="size-4" />
                    </div>
                    <span class="text-foreground text-xs font-semibold">{{ track.title }}</span>
                  </div>
                  <Badge variant="outline" class="bg-background font-mono text-xs">
                    {{ track.sla }}
                  </Badge>
                </div>
                <p class="text-muted-foreground mt-2 pl-9 text-xs">
                  {{ track.subtitle }}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Global Timezone & Architecture Hubs -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">Direct Engineering Hubs</p>
              <div class="flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
                Live Dispatch Active
              </div>
            </div>

            <div class="space-y-2">
              <div
                v-for="hub in globalHubs"
                :key="hub.city"
                class="border-border bg-card/60 flex items-center justify-between rounded-lg border p-3 text-xs shadow-xs"
              >
                <div>
                  <p class="text-foreground font-medium">{{ hub.city }}</p>
                  <p class="text-muted-foreground font-mono text-xs">{{ hub.tz }} &bull; {{ hub.status }}</p>
                </div>
                <a :href="`mailto:${hub.email}`" class="text-primary font-mono text-xs hover:underline">
                  {{ hub.email }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Dispatch Form (7 Cols) -->
        <div class="lg:col-span-7">
          <Card class="border-border bg-card overflow-hidden shadow-sm">
            <CardHeader class="border-border/60 bg-muted/20 border-b pb-4">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2 text-base font-semibold">
                  <MessageSquare class="text-primary size-4" />
                  Dispatch Engineering Request
                </CardTitle>
                <Badge variant="secondary" class="font-mono text-xs"> Direct Dispatch: {{ selectedType }} </Badge>
              </div>
              <CardDescription class="text-xs">
                Provide architectural specifications or questions. Our engineering team responds within guaranteed SLA.
              </CardDescription>
            </CardHeader>

            <CardContent class="p-6">
              <form v-if="!sent" class="space-y-4" @submit.prevent="submit">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="space-y-1.5">
                    <Label for="contact-name" class="text-xs font-medium">Your Name</Label>
                    <Input id="contact-name" v-model="name" placeholder="Jane Doe" required class="h-9 text-xs" />
                  </div>
                  <div class="space-y-1.5">
                    <Label for="contact-email" class="text-xs font-medium">Work Email</Label>
                    <Input
                      id="contact-email"
                      v-model="email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      class="h-9 font-mono text-xs"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="space-y-1.5">
                    <Label for="contact-company" class="text-xs font-medium">Company / Organization</Label>
                    <Input id="contact-company" v-model="company" placeholder="Acme Corp" class="h-9 text-xs" />
                  </div>
                  <div class="space-y-1.5">
                    <Label class="text-xs font-medium">Engineering Team Size</Label>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="ts in ['1-10', '10-50', '50+']"
                        :key="ts"
                        type="button"
                        class="rounded-md border px-2 py-1.5 text-center font-mono text-xs transition-all"
                        :class="
                          teamSize === ts
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                        "
                        @click="teamSize = ts"
                      >
                        {{ ts }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <Label for="contact-message" class="text-xs font-medium">Project Scope & Technical Details</Label>
                  <Textarea
                    id="contact-message"
                    v-model="message"
                    rows="4"
                    placeholder="Describe your tech stack (Vue 3, Nuxt 3, React 19, Next.js), design token requirements, and deployment targets..."
                    required
                    class="resize-none text-xs"
                  />
                </div>

                <div class="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
                  <div class="text-muted-foreground flex items-center gap-2 text-xs">
                    <ShieldCheck class="size-4 text-emerald-500" />
                    <span>NDA & IP protection pre-guaranteed.</span>
                  </div>

                  <Button
                    type="submit"
                    :disabled="!canSubmit"
                    class="h-9 w-full gap-1.5 px-5 text-xs font-semibold sm:w-auto"
                  >
                    <span>Dispatch Inquiry</span>
                    <Send class="size-3.5" />
                  </Button>
                </div>
              </form>

              <!-- Success Feedback View -->
              <div v-else class="space-y-5 px-4 py-8 text-center">
                <div
                  class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
                >
                  <Check class="size-6" />
                </div>
                <div class="space-y-1">
                  <p class="text-foreground text-base font-bold">Inquiry Dispatched Successfully</p>
                  <p class="text-muted-foreground mx-auto max-w-sm text-xs">
                    A principal solutions architect has been assigned. You will receive a technical response at
                    <strong class="text-foreground font-mono">{{ email }}</strong> within guaranteed SLA.
                  </p>
                </div>

                <div
                  class="border-border bg-muted/40 mx-auto flex max-w-xs items-center justify-between rounded-lg border p-3"
                >
                  <div class="text-left">
                    <p class="text-muted-foreground font-mono text-xs uppercase">Reference Ticket ID</p>
                    <p class="text-foreground font-mono text-xs font-bold">{{ ticketId }}</p>
                  </div>
                  <Button variant="outline" size="sm" class="h-7 gap-1 font-mono text-xs" @click="copyTicket">
                    <Check v-if="copiedTicket" class="size-3 text-emerald-500" />
                    <Copy v-else class="size-3" />
                    <span>{{ copiedTicket ? 'Copied' : 'Copy' }}</span>
                  </Button>
                </div>

                <Button variant="ghost" size="sm" class="text-muted-foreground text-xs" @click="sent = false">
                  Send Another Inquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
