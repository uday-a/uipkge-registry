<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
const animated = ref(0);

onMounted(() => {
  const tick = () => {
    animated.value = animated.value >= 100 ? 0 : animated.value + 5;
  };
  const id = window.setInterval(tick, 600);
  onBeforeUnmount(() => window.clearInterval(id));
});
</script>

<template>
  <Story
    title="With label"
    description="Progress bar paired with label and percentage row above the track."
  >
    <div class="max-w-md space-y-3">
      <div>
        <div class="text-muted-foreground mb-1.5 flex justify-between text-xs">
          <span>Loading…</span>
          <span>33%</span>
        </div>
        <Progress :model-value="33" />
      </div>
      <div>
        <div class="text-muted-foreground mb-1.5 flex justify-between text-xs">
          <span>Almost done</span>
          <span>83%</span>
        </div>
        <Progress :model-value="83" />
      </div>
    </div>
  </Story>

  <Story
    title="Discrete states"
    description="Empty, half, and complete tracks side by side."
  >
    <div class="max-w-md space-y-4">
      <div>
        <div class="text-muted-foreground mb-1.5 text-xs">0%</div>
        <Progress :model-value="0" />
      </div>
      <div>
        <div class="text-muted-foreground mb-1.5 text-xs">50%</div>
        <Progress :model-value="50" />
      </div>
      <div>
        <div class="text-muted-foreground mb-1.5 text-xs">100%</div>
        <Progress :model-value="100" />
      </div>
    </div>
  </Story>

  <Story
    title="Multi-percentage row"
    description="Static showcase across a typical 0–100 range."
  >
    <div class="grid max-w-md gap-3">
      <Progress :model-value="10" />
      <Progress :model-value="30" />
      <Progress :model-value="55" />
      <Progress :model-value="78" />
      <Progress :model-value="95" />
    </div>
  </Story>

  <Story
    title="Animated value"
    description="Reactive modelValue auto-cycles every 600ms; the indicator transitions smoothly."
  >
    <div class="max-w-md space-y-3">
      <div class="text-muted-foreground flex justify-between text-xs">
        <span>Uploading file…</span>
        <span class="tabular-nums">{{ animated }}%</span>
      </div>
      <Progress :model-value="animated" />
    </div>
  </Story>

  <Story
    title="In a card"
    description="Common use inside a card: title, description, and a labeled progress row."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>You're using 6.4 GB of 10 GB.</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress :model-value="64" />
        <p class="text-muted-foreground mt-2 text-xs">
          3.6 GB remaining on your current plan.
        </p>
      </CardContent>
    </Card>
  </Story>
</template>
