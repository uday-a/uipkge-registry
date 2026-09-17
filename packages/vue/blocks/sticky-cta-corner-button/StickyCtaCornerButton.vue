<script setup lang="ts">
import { ref } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Expands on focus as well as hover: a keyboard user should be able to read the
// label before deciding whether to activate it.
const expanded = ref(false)
</script>

<template>
  <div data-slot="sticky-cta-corner-button" class="fixed right-5 bottom-5 z-50">
    <Button
      size="lg"
      class="group h-12 gap-0 rounded-full pr-4 pl-4 shadow-lg transition-all"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
      @focus="expanded = true"
      @blur="expanded = false"
    >
      <MessageSquare class="size-5 shrink-0" aria-hidden="true" />
      <!-- Width, not display: a hidden label would not animate, and a label that
           pops in shifts the button under the cursor mid-click. -->
      <span
        class="overflow-hidden whitespace-nowrap transition-all duration-200"
        :class="expanded ? 'ml-2 max-w-[10rem] opacity-100' : 'max-w-0 opacity-0'"
      >
        Ask an engineer
      </span>
    </Button>

    <Badge
      variant="secondary"
      class="border-background pointer-events-none absolute -top-1 -right-1 size-5 justify-center rounded-full border-2 p-0 text-[10px]"
    >
      1
    </Badge>
  </div>
</template>
