<script setup lang="ts">
import { ref } from 'vue'
import { Countdown } from '@/components/ui/countdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const flashSaleEnd = ref(Date.now() + 3_600_000 * 5 + 42_000)
const auctionEnd = ref(Date.now() + 10_000)
const eventStart = ref(Date.now() + 86_400_000 * 2 + 3_600_000 * 4 + 60_000 * 30)
const newYear = ref(new Date(new Date().getFullYear() + 1, 0, 1).getTime())
const pausedTarget = ref(Date.now() + 120_000)
const isPaused = ref(false)
const auctionFinished = ref(false)
const auctionTick = ref(0)

function resetAuction() {
  auctionEnd.value = Date.now() + 10_000
  auctionFinished.value = false
}
</script>

<template>
  <Story
    title="Flash sale"
    description="A 5-hour countdown on a promotional banner — the classic e-commerce urgency pattern."
  >
    <div class="bg-primary text-primary-foreground max-w-md rounded-lg px-5 py-4">
      <p class="text-sm font-medium opacity-90">Flash sale — 40% off all plans</p>
      <Countdown
        :target="flashSaleEnd"
        label="Ends in"
        class="[&_.text-foreground]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70 mt-2"
      />
    </div>
  </Story>

  <Story
    title="Auction ending"
    description="Seconds-only countdown that fires finish when the bidding window closes. Reset to watch it again."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Vintage camera lot</CardTitle>
        <CardDescription>Highest bid: $1,240 · 3 bidders active</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <Countdown
          :target="auctionEnd"
          format="SS"
          label="Bidding closes in"
          @finish="auctionFinished = true"
          @tick="(v) => (auctionTick = v)"
        />
        <div class="flex items-center gap-3">
          <Button size="sm" variant="outline" @click="resetAuction">Reset timer</Button>
          <span class="text-muted-foreground text-xs">
            {{ auctionFinished ? 'Auction ended!' : `Ticking… ${Math.ceil(auctionTick / 1000)}s left` }}
          </span>
        </div>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Event countdown"
    description="Full DD:HH:MM:SS display for a conference or product launch two days away."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>UIPKGE Summit 2025</CardTitle>
        <CardDescription>Doors open in 2 days, 4 hours, 30 minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Countdown :target="eventStart" label="Starts in" />
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Format variants"
    description="DD:HH:MM:SS, HH:MM:SS, MM:SS, and SS — choose the precision your scenario needs."
  >
    <div class="grid max-w-lg gap-4 sm:grid-cols-2">
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">DD:HH:MM:SS</p>
        <Countdown :target="eventStart" />
      </div>
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">HH:MM:SS</p>
        <Countdown :target="eventStart" format="HH:MM:SS" />
      </div>
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">MM:SS</p>
        <Countdown :target="flashSaleEnd" format="MM:SS" />
      </div>
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">SS</p>
        <Countdown :target="auctionEnd" format="SS" />
      </div>
    </div>
  </Story>

  <Story
    title="Custom unit cards"
    description="Named slots let you render each unit as a tile — perfect for hero countdowns and launch pages."
  >
    <Countdown :target="eventStart" :separator="''">
      <template #days="{ days }">
        <div class="flex flex-col items-center">
          <span
            class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >
            {{ String(days).padStart(2, '0') }}
          </span>
          <span class="text-muted-foreground text-xs tracking-wide uppercase">days</span>
        </div>
      </template>
      <template #hours="{ hours }">
        <div class="flex flex-col items-center">
          <span
            class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >
            {{ String(hours).padStart(2, '0') }}
          </span>
          <span class="text-muted-foreground text-xs tracking-wide uppercase">hrs</span>
        </div>
      </template>
      <template #minutes="{ minutes }">
        <div class="flex flex-col items-center">
          <span
            class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >
            {{ String(minutes).padStart(2, '0') }}
          </span>
          <span class="text-muted-foreground text-xs tracking-wide uppercase">min</span>
        </div>
      </template>
      <template #seconds="{ seconds }">
        <div class="flex flex-col items-center">
          <span
            class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >
            {{ String(seconds).padStart(2, '0') }}
          </span>
          <span class="text-muted-foreground text-xs tracking-wide uppercase">sec</span>
        </div>
      </template>
    </Countdown>
  </Story>

  <Story
    title="Paused & styling"
    description="paused freezes the countdown; a custom separator and no-pad give it a distinct look."
  >
    <div class="max-w-md space-y-3">
      <Countdown :target="pausedTarget" :paused="isPaused" label="Paused demo" separator="—" />
      <div class="flex items-center gap-3">
        <Button size="sm" variant="outline" @click="isPaused = !isPaused">
          {{ isPaused ? 'Resume' : 'Pause' }}
        </Button>
        <Countdown :target="eventStart" :pad="false" label="No leading zeros" />
      </div>
    </div>
  </Story>

  <Story title="New year" description="Countdown to January 1st of next year — a perennial landing-page fixture.">
    <Countdown :target="newYear" label="New Year" />
  </Story>
</template>
