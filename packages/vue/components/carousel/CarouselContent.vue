<!--
  CarouselContent
  
  The scrollable container for carousel items.
  Uses CSS scroll-snap for smooth sliding behavior.
  
  @example
  <CarouselContent>
    <CarouselItem v-for="slide in slides" :key="slide.id">
      <img :src="slide.src" :alt="slide.alt" />
    </CarouselItem>
  </CarouselContent>
-->
<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();

const carousel = inject<{
  rootRef: { value: HTMLElement | null };
  orientation: { value: "horizontal" | "vertical" };
} | null>("carousel", null);

const isHorizontal = computed(
  () => carousel?.orientation?.value !== "vertical",
);

const scrollClass = computed(() => {
  return isHorizontal.value
    ? "flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
    : "flex flex-col overflow-y-auto snap-y snap-mandatory";
});
</script>

<template>
  <div
    :ref="
      (el) => {
        if (carousel) carousel.rootRef.value = el as HTMLElement;
      }
    "
    data-uipkge
    data-slot="carousel-content"
    :class="
      cn(
        scrollClass,
        'relative h-full w-full',
        '[scrollbar-width:none] [-ms-overflow-style:none]',
        '[&::-webkit-scrollbar]:hidden',
        props.class,
      )
    "
    :aria-orientation="carousel?.orientation?.value"
    role="group"
  >
    <slot />
  </div>
</template>
