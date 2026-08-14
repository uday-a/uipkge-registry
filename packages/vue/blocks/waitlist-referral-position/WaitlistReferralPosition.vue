<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy, Users } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const props = withDefaults(defineProps<{ position?: number; nextTierAt?: number }>(), {
  position: 1_284,
  nextTierAt: 1_000,
})

const email = ref('')
const joined = ref(false)
const copied = ref(false)
const referralLink = 'https://northwind.dev/w/8f2a41'

// How far from the current position to the next access tier, as a percentage.
const progress = computed(() => {
  const span = props.position - props.nextTierAt
  if (span <= 0) return 100
  return Math.round(((props.position - span) / props.position) * 100)
})

function join() {
  if (!email.value.trim()) return
  joined.value = true
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(referralLink)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard blocked: the link stays visible and selectable.
  }
}
</script>

<template>
  <section data-slot="waitlist-referral-position" class="bg-background">
    <div class="mx-auto max-w-xl px-6 py-20 text-center lg:py-28">
      <Badge variant="secondary" class="gap-1.5">
        <Users class="size-3" aria-hidden="true" />
        8,400 waiting
      </Badge>

      <h2 class="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Early access opens a cohort at a time
      </h2>
      <p class="text-muted-foreground mt-3 text-lg">
        Join the list, then move up it. Every person who joins through your link moves you forward.
      </p>

      <!-- One card that swaps contents rather than two stacked states, so the
           section height barely changes between before and after. -->
      <Card class="mt-8 text-left">
        <CardContent class="p-6">
          <form v-if="!joined" @submit.prevent="join">
            <label for="waitlist-email" class="text-sm font-medium">Work email</label>
            <div class="mt-2 flex gap-2">
              <Input
                id="waitlist-email"
                v-model="email"
                type="email"
                required
                placeholder="you@company.com"
                autocomplete="email"
              />
              <Button type="submit" class="shrink-0">Join</Button>
            </div>
            <p class="text-muted-foreground mt-2 text-xs">
              No product emails while you wait — one message when your cohort opens.
            </p>
          </form>

          <div v-else aria-live="polite">
            <div class="flex items-baseline justify-between gap-4">
              <div>
                <p class="text-muted-foreground text-xs tracking-wide uppercase">Your position</p>
                <p class="font-display mt-1 text-3xl font-bold tracking-tight">#{{ position.toLocaleString() }}</p>
              </div>
              <p class="text-muted-foreground text-right text-xs">
                Next cohort opens<br />at #{{ nextTierAt.toLocaleString() }}
              </p>
            </div>

            <Progress :model-value="progress" class="mt-4 h-1.5" aria-label="Progress to the next cohort" />

            <Separator class="my-5" />

            <p class="text-sm font-medium">Move up the list</p>
            <p class="text-muted-foreground mt-1 text-xs">Each signup through your link moves you forward 12 places.</p>
            <div class="border-border bg-muted/30 mt-3 flex items-stretch overflow-hidden rounded-md border">
              <code class="min-w-0 flex-1 truncate px-3 py-2 font-mono text-xs">{{ referralLink }}</code>
              <Button
                variant="ghost"
                class="border-border h-auto shrink-0 rounded-none border-l px-3"
                aria-label="Copy referral link"
                @click="copyLink"
              >
                <Check v-if="copied" class="text-success size-4" aria-hidden="true" />
                <Copy v-else class="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
