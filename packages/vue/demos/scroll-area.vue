<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
const tags = Array.from({ length: 30 }, (_, i) => `tag-${i + 1}`)
const figures = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Figure ${i + 1}`,
  caption: `Photo by Photographer ${i + 1}`,
}))
const grid = Array.from({ length: 80 }, (_, i) => i + 1)
</script>

<template>
  <Story title="Default" description="Fixed-height container with a styled scrollbar for overflowing content.">
    <ScrollArea class="border-border h-48 max-w-xs rounded-md border p-4">
      <h4 class="mb-3 text-sm font-medium">Tags</h4>
      <div class="space-y-1 font-mono text-sm">
        <div v-for="t in tags" :key="t">{{ t }}</div>
      </div>
    </ScrollArea>
  </Story>

  <Story
    title="Horizontal scroll"
    description="Long row of cards. Add a horizontal ScrollBar and let inline content overflow on the x-axis."
  >
    <ScrollArea class="border-border max-w-2xl rounded-md border whitespace-nowrap">
      <div class="flex w-max gap-4 p-4">
        <figure v-for="f in figures" :key="f.id" class="shrink-0">
          <div class="bg-muted text-muted-foreground grid size-32 place-items-center rounded-md text-xs">
            {{ f.title }}
          </div>
          <figcaption class="text-muted-foreground pt-2 text-xs">{{ f.caption }}</figcaption>
        </figure>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </Story>

  <Story
    title="Both axes"
    description="Large grid that overflows on both axes — vertical and horizontal scrollbars combine."
  >
    <ScrollArea class="border-border h-64 max-w-md rounded-md border">
      <div class="grid w-[640px] grid-cols-8 gap-2 p-4 font-mono text-xs">
        <div v-for="n in grid" :key="n" class="bg-muted grid aspect-square place-items-center rounded">{{ n }}</div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </Story>

  <Story
    title="Inside a card"
    description="Constrain a card body to a fixed height and make only the inner list scrollable."
  >
    <Card class="max-w-sm">
      <CardHeader>
        <CardTitle class="text-base">Activity feed</CardTitle>
        <CardDescription>Recent events, scrollable.</CardDescription>
      </CardHeader>
      <CardContent class="px-0">
        <ScrollArea class="h-56 px-6">
          <ul class="space-y-3 text-sm">
            <li v-for="i in 25" :key="i" class="flex items-start gap-3">
              <div class="bg-muted mt-0.5 size-2 shrink-0 rounded-full" />
              <div>
                <p>Event #{{ i }} — something happened.</p>
                <p class="text-muted-foreground text-xs">{{ i * 2 }} minutes ago</p>
              </div>
            </li>
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  </Story>
</template>
