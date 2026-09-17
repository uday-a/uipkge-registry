<script setup lang="ts">
/**
 * Contact section — two columns. Left: eyebrow, headline, lede, icon-prefixed
 * contact rows, and a live map pinned to your office (pass `access-token` +
 * `location`; falls back to a styled placeholder without a token). Right: a
 * Card-wrapped form (name / email / company / subject / message) that swaps to
 * a success state after submit. Emits "submit" with the payload.
 */
import { computed, ref } from 'vue'
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Map, MapMarker } from '@/components/ui/map'

const props = withDefaults(
  defineProps<{
    /** Mapbox token. Without it the map area shows a styled placeholder. */
    accessToken?: string
    /** Office [lng, lat]. */
    location?: [number, number]
    locationLabel?: string
  }>(),
  {
    accessToken: '',
    location: () => [-122.4194, 37.7749],
    locationLabel: 'San Francisco, CA',
  },
)

const emit = defineEmits<{
  (e: 'submit', payload: { name: string; email: string; company: string; subject: string; message: string }): void
}>()

const name = ref('')
const email = ref('')
const company = ref('')
const subject = ref('sales')
const message = ref('')
const sent = ref(false)

const canSubmit = computed(() => name.value && email.value && message.value)

function submit() {
  if (!canSubmit.value) return
  emit('submit', {
    name: name.value,
    email: email.value,
    company: company.value,
    subject: subject.value,
    message: message.value,
  })
  sent.value = true
}
</script>

<template>
  <section data-slot="contact-us" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
        <!-- Left: copy + contact rows + map -->
        <div class="space-y-6">
          <p class="text-primary text-sm font-medium tracking-widest uppercase">Contact</p>
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">Talk to our team</h2>
          <p class="text-muted-foreground max-w-md">
            Questions about pricing, onboarding, or a custom plan? Send a note and we'll get back within one business
            day.
          </p>

          <ul class="space-y-3">
            <li class="flex items-center gap-3">
              <span class="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg"
                ><Mail class="size-4"
              /></span>
              <span class="text-sm">hello@example.com</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg"
                ><Phone class="size-4"
              /></span>
              <span class="text-sm">+1 (555) 010-2030</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg"
                ><MapPin class="size-4"
              /></span>
              <span class="text-sm">{{ locationLabel }}</span>
            </li>
          </ul>

          <div class="h-56 overflow-hidden rounded-xl border">
            <Map v-if="accessToken" :access-token="accessToken" :center="location" :zoom="11" muted class="size-full">
              <MapMarker :lng-lat="location" anchor="bottom">
                <svg viewBox="0 0 24 24" width="26" height="34" class="text-primary drop-shadow">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <circle cx="12" cy="9" r="2.6" fill="var(--background)" />
                </svg>
              </MapMarker>
            </Map>
            <div v-else class="bg-muted text-muted-foreground flex size-full items-center justify-center gap-2 text-sm">
              <MapPin class="size-4" /> {{ locationLabel }}
            </div>
          </div>
        </div>

        <!-- Right: form -->
        <Card>
          <template v-if="!sent">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We'll route it to the right person.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1.5">
                  <Label for="cu-name">Name</Label>
                  <Input id="cu-name" v-model="name" placeholder="Jane Cooper" />
                </div>
                <div class="space-y-1.5">
                  <Label for="cu-email">Email</Label>
                  <Input id="cu-email" v-model="email" type="email" placeholder="jane@company.com" />
                </div>
              </div>
              <div class="space-y-1.5">
                <Label for="cu-company">Company</Label>
                <Input id="cu-company" v-model="company" placeholder="Acme Inc." />
              </div>
              <div class="space-y-1.5">
                <Label>Subject</Label>
                <Select v-model="subject">
                  <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label for="cu-message">Message</Label>
                <Textarea id="cu-message" v-model="message" :rows="4" placeholder="How can we help?" />
              </div>
              <Button class="w-full" :disabled="!canSubmit" @click="submit">
                <Send class="size-4" /> Send message
              </Button>
            </CardContent>
          </template>

          <CardContent v-else class="flex flex-col items-center gap-3 py-16 text-center">
            <span class="bg-success/10 text-success flex size-12 items-center justify-center rounded-full"
              ><CheckCircle2 class="size-6"
            /></span>
            <p class="text-lg font-semibold">Message sent</p>
            <p class="text-muted-foreground max-w-xs text-sm">
              Thanks, {{ name }} — we'll reply to {{ email }} within one business day.
            </p>
            <Button variant="outline" @click="sent = false">Send another</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
