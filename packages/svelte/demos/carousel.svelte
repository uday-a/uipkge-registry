<script lang="ts">
  import { Card, CardContent } from '@svelte-registry/card'
  import {
    Carousel,
    CarouselContent,
    CarouselFooter,
    CarouselHeader,
    CarouselIndicators,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from '@svelte-registry/carousel'
  import { Quote, Star } from '@lucide/svelte'

  let { story }: { story: string } = $props()

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

  let heroIndex = $state(0)
</script>

{#if story === 'Default'}
  <Carousel class="max-w-md">
    <CarouselContent>
      {#each Array.from({ length: 5 }) as _, i (i)}
        <CarouselItem>
          <Card>
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-bold">{i + 1}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
{/if}

{#if story === 'Vertical orientation'}
  <Carousel orientation="vertical" class="h-[280px] max-w-xs">
    <CarouselContent class="h-[280px]">
      {#each Array.from({ length: 4 }) as _, i (i)}
        <CarouselItem>
          <Card class="h-[260px]">
            <CardContent class="flex h-full items-center justify-center p-6">
              <span class="text-3xl font-bold">Slide {i + 1}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
{/if}

{#if story === 'With loop'}
  <Carousel loop class="max-w-md">
    <CarouselContent>
      {#each Array.from({ length: 4 }) as _, i (i)}
        <CarouselItem>
          <Card>
            <CardContent class="flex aspect-[16/9] items-center justify-center p-6">
              <span class="text-2xl font-semibold">Loop · Slide {i + 1}</span>
            </CardContent>
          </Card>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
{/if}

{#if story === 'With indicators'}
  <Carousel bind:value={heroIndex} class="max-w-md">
    <CarouselContent>
      {#each slides as s (s.id)}
        <CarouselItem>
          <div class={`flex aspect-[16/9] items-center justify-center rounded-lg ${s.color}`}>
            <span class="text-2xl font-semibold tracking-tight">{s.label}</span>
          </div>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselFooter class="justify-center">
      <CarouselIndicators />
    </CarouselFooter>
  </Carousel>
{/if}

{#if story === 'Header and footer'}
  <Carousel class="max-w-lg">
    <CarouselHeader>
      <div>
        <p class="text-sm font-semibold">What people say</p>
        <p class="text-muted-foreground text-xs">Recent testimonials</p>
      </div>
      <div class="flex items-center gap-0.5">
        {#each Array.from({ length: 5 }) as _, i (i)}
          <Star class="size-3.5 fill-amber-500 text-amber-500" />
        {/each}
      </div>
    </CarouselHeader>
    <CarouselContent>
      {#each testimonials as t, i (i)}
        <CarouselItem>
          <Card>
            <CardContent class="space-y-3 p-6">
              <Quote class="text-primary/60 size-5" />
              <p class="text-sm leading-relaxed">{t.quote}</p>
              <p class="text-muted-foreground text-xs">{t.author}</p>
            </CardContent>
          </Card>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselFooter>
      <CarouselIndicators />
      <div class="flex gap-2">
        <CarouselPrevious class="static translate-y-0" />
        <CarouselNext class="static translate-y-0" />
      </div>
    </CarouselFooter>
  </Carousel>
{/if}

{#if story === 'Image cards'}
  <Carousel loop class="max-w-md">
    <CarouselContent>
      {#each slides as s (s.id)}
        <CarouselItem>
          <div class="relative overflow-hidden rounded-lg">
            <div class={`flex aspect-[4/3] items-end p-4 ${s.color}`}>
              <div>
                <p class="text-xs font-medium tracking-wider uppercase opacity-70">Landscape</p>
                <p class="text-lg font-semibold">{s.label}</p>
              </div>
            </div>
          </div>
        </CarouselItem>
      {/each}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
    <CarouselFooter class="justify-center">
      <CarouselIndicators />
    </CarouselFooter>
  </Carousel>
{/if}
