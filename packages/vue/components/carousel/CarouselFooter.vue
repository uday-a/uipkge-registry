<!--
  CarouselFooter
  
  Wrapper for carousel footer content (pagination, indicators).
  
  @example
  <CarouselFooter>
    <CarouselIndicators />
  </CarouselFooter>
-->
<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    data-uipkge
    data-slot="carousel-footer"
    :class="cn('flex items-center justify-between px-1 pt-2', props.class)"
  >
    <slot />
  </div>
</template>
