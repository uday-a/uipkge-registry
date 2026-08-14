<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselFooter,
  CarouselHeader,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ref } from 'vue'
import { Quote, Star } from 'lucide-vue-next'

const slides = [
  { id: 1, color: 'bg-rose-100 dark:bg-rose-950/40', label: 'Mountains' },
  { id: 2, color: 'bg-sky-100 dark:bg-sky-950/40', label: 'Ocean' },
  { id: 3, color: 'bg-emerald-100 dark:bg-emerald-950/40', label: 'Forest' },
  { id: 4, color: 'bg-amber-100 dark:bg-amber-950/40', label: 'Desert' },
  { id: 5, color: 'bg-violet-100 dark:bg-violet-950/40', label: 'Aurora' },
]

const testimonials = [
  { quote: 'Shipped our dashboard in two days flat.', author: 'Lena · Acme' },
  { quote: 'Cleanest registry I have used. Period.', author: 'Marcus · Northwind' },
  { quote: 'Tokens, blocks, components — all sane defaults.', author: 'Priya · Globex' },
]

const heroIndex = ref(0)
</script>

<template>
  <Story title="Default" description="Five-slide horizontal carousel with previous and next controls.">
    <Carousel class="max-w-md">
      <CarouselContent>
        <CarouselItem v-for="(_, i) in 5" :key="i">
          <Card>
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-bold">{{ i + 1 }}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </Story>

  <Story title="Vertical orientation" description="Stacks slides top-to-bottom with controls on the vertical axis.">
    <Carousel orientation="vertical" class="h-[280px] max-w-xs">
      <CarouselContent class="h-[280px]">
        <CarouselItem v-for="(_, i) in 4" :key="i">
          <Card class="h-[260px]">
            <CardContent class="flex h-full items-center justify-center p-6">
              <span class="text-3xl font-bold">Slide {{ i + 1 }}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </Story>

  <Story title="With loop" description="Wraps from the last slide back to the first when navigating past the end.">
    <Carousel :loop="true" class="max-w-md">
      <CarouselContent>
        <CarouselItem v-for="(_, i) in 4" :key="i">
          <Card>
            <CardContent class="flex aspect-[16/9] items-center justify-center p-6">
              <span class="text-2xl font-semibold">Loop · Slide {{ i + 1 }}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </Story>

  <Story
    title="With indicators"
    description="Dot navigation rendered in the footer keeps the active slide visible at a glance."
  >
    <Carousel v-model="heroIndex" class="max-w-md">
      <CarouselContent>
        <CarouselItem v-for="s in slides" :key="s.id">
          <div :class="['flex aspect-[16/9] items-center justify-center rounded-lg', s.color]">
            <span class="text-2xl font-semibold tracking-tight">{{ s.label }}</span>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselFooter class="justify-center">
        <CarouselIndicators />
      </CarouselFooter>
    </Carousel>
  </Story>

  <Story
    title="Header and footer"
    description="Caption layout with a titled header and grouped controls in the footer."
  >
    <Carousel class="max-w-lg">
      <CarouselHeader>
        <div>
          <p class="text-sm font-semibold">What people say</p>
          <p class="text-muted-foreground text-xs">Recent testimonials</p>
        </div>
        <div class="flex items-center gap-0.5">
          <Star v-for="i in 5" :key="i" class="size-3.5 fill-amber-500 text-amber-500" />
        </div>
      </CarouselHeader>
      <CarouselContent>
        <CarouselItem v-for="(t, i) in testimonials" :key="i">
          <Card>
            <CardContent class="space-y-3 p-6">
              <Quote class="text-primary/60 size-5" />
              <p class="text-sm leading-relaxed">{{ t.quote }}</p>
              <p class="text-muted-foreground text-xs">{{ t.author }}</p>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselFooter>
        <CarouselIndicators />
        <div class="flex gap-2">
          <CarouselPrevious class="static translate-y-0" />
          <CarouselNext class="static translate-y-0" />
        </div>
      </CarouselFooter>
    </Carousel>
  </Story>

  <Story title="Image cards" description="Image-based slide content with overlay caption inside each carousel item.">
    <Carousel :loop="true" class="max-w-md">
      <CarouselContent>
        <CarouselItem v-for="s in slides" :key="s.id">
          <div class="relative overflow-hidden rounded-lg">
            <div :class="['flex aspect-[4/3] items-end p-4', s.color]">
              <div>
                <p class="text-xs font-medium tracking-wider uppercase opacity-70">Landscape</p>
                <p class="text-lg font-semibold">{{ s.label }}</p>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselFooter class="justify-center">
        <CarouselIndicators />
      </CarouselFooter>
    </Carousel>
  </Story>
</template>
