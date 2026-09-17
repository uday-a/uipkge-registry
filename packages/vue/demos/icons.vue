<script setup lang="ts">
import { Icon } from "@/components/ui/icons";
import { Home, Settings, User } from "lucide-vue-next";
</script>

<template>
  <Story
    title="Sizes"
    description="Icon component in different sizes using Lucide icons via slot."
  >
    <div class="flex items-center gap-4">
      <Icon size="xs"><Home class="size-3" aria-hidden="true" /></Icon>
      <Icon size="sm"><Home class="size-4" aria-hidden="true" /></Icon>
      <Icon size="md"><Home class="size-5" aria-hidden="true" /></Icon>
      <Icon size="lg"><Home class="size-6" aria-hidden="true" /></Icon>
      <Icon size="xl"><Home class="size-8" aria-hidden="true" /></Icon>
    </div>
  </Story>

  <Story
    title="Color & rotation"
    description="Custom color and rotation applied to the icon wrapper."
  >
    <div class="flex items-center gap-4">
      <Icon color="var(--destructive)" :rotation="0">
        <Settings class="size-5" aria-hidden="true" />
      </Icon>
      <Icon color="var(--info)" :rotation="45">
        <Settings class="size-5" aria-hidden="true" />
      </Icon>
      <Icon color="var(--success)" :rotation="90">
        <Settings class="size-5" aria-hidden="true" />
      </Icon>
    </div>
  </Story>

  <Story
    title="Flip"
    description="Horizontal and vertical flip transformations."
  >
    <div class="flex items-center gap-4">
      <Icon><User class="size-5" aria-hidden="true" /></Icon>
      <Icon flip="horizontal"><User class="size-5" aria-hidden="true" /></Icon>
      <Icon flip="vertical"><User class="size-5" aria-hidden="true" /></Icon>
    </div>
  </Story>
</template>
