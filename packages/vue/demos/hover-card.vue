<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { CalendarDays } from 'lucide-vue-next'
</script>

<template>
  <Story title="Default" description="Hover the trigger to reveal a card with avatar and details.">
    <HoverCard>
      <HoverCardTrigger as-child>
        <Button variant="link">@uipkge</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-72">
        <div class="flex gap-3">
          <Avatar><AvatarFallback>UI</AvatarFallback></Avatar>
          <div class="space-y-1">
            <p class="text-sm font-semibold">@uipkge</p>
            <p class="text-muted-foreground text-xs">Open-source UI registry. shadcn-vue compatible.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </Story>

  <Story
    title="Custom delays"
    description="openDelay / closeDelay (ms) tune how quickly the card appears and dismisses."
  >
    <div class="flex flex-wrap items-center gap-4">
      <HoverCard :open-delay="0" :close-delay="0">
        <HoverCardTrigger as-child>
          <Button variant="outline">Instant</Button>
        </HoverCardTrigger>
        <HoverCardContent class="w-56">
          <p class="text-sm">openDelay: 0 — appears immediately on hover.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard :open-delay="700" :close-delay="200">
        <HoverCardTrigger as-child>
          <Button variant="outline">Default-ish</Button>
        </HoverCardTrigger>
        <HoverCardContent class="w-56">
          <p class="text-sm">openDelay: 700 / closeDelay: 200 — feels intentional.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard :open-delay="1500" :close-delay="500">
        <HoverCardTrigger as-child>
          <Button variant="outline">Lazy</Button>
        </HoverCardTrigger>
        <HoverCardContent class="w-56">
          <p class="text-sm">openDelay: 1500 / closeDelay: 500 — slow to surface.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  </Story>

  <Story title="With image content" description="Card with an avatar image, header, body, and metadata footer.">
    <HoverCard>
      <HoverCardTrigger as-child>
        <Button variant="link">@vuejs</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-80">
        <div class="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vuejs.png" alt="@vuejs" />
            <AvatarFallback>VJ</AvatarFallback>
          </Avatar>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">@vuejs</h4>
            <p class="text-sm">The Progressive JavaScript Framework.</p>
            <div class="text-muted-foreground flex items-center gap-1 pt-2 text-xs">
              <CalendarDays class="size-3.5" aria-hidden="true" />
              <span>Joined December 2013</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </Story>

  <Story
    title="Inline mentions in a paragraph"
    description="Multiple HoverCard triggers inline — the @-mention pattern from social tools."
  >
    <p class="max-w-prose text-sm leading-7">
      Big thanks to
      <HoverCard>
        <HoverCardTrigger as-child>
          <Button variant="link" class="h-auto px-0 py-0 align-baseline">@nuxt</Button>
        </HoverCardTrigger>
        <HoverCardContent class="w-64">
          <div class="flex gap-3">
            <Avatar><AvatarFallback>NX</AvatarFallback></Avatar>
            <div>
              <p class="text-sm font-semibold">@nuxt</p>
              <p class="text-muted-foreground text-xs">The Intuitive Vue Framework.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      and
      <HoverCard>
        <HoverCardTrigger as-child>
          <Button variant="link" class="h-auto px-0 py-0 align-baseline">@reka-ui</Button>
        </HoverCardTrigger>
        <HoverCardContent class="w-64">
          <div class="flex gap-3">
            <Avatar><AvatarFallback>RK</AvatarFallback></Avatar>
            <div>
              <p class="text-sm font-semibold">@reka-ui</p>
              <p class="text-muted-foreground text-xs">Unstyled, accessible primitives.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      for the foundations this builds on.
    </p>
  </Story>

  <Story
    title="Placement variants"
    description="HoverCardContent forwards Reka-UI's side and align props — place the card top, right, bottom, or left of the trigger. Defaults to bottom."
  >
    <div class="grid grid-cols-2 place-items-center gap-x-12 gap-y-6 py-12 sm:grid-cols-4">
      <HoverCard v-for="side in ['top', 'right', 'bottom', 'left'] as const" :key="side">
        <HoverCardTrigger as-child>
          <Button variant="outline" class="capitalize">{{ side }}</Button>
        </HoverCardTrigger>
        <HoverCardContent :side="side" class="w-48">
          <p class="text-sm font-medium capitalize">{{ side }} placement</p>
          <p class="text-muted-foreground mt-1 text-xs">side='{{ side }}' on HoverCardContent.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  </Story>
</template>
