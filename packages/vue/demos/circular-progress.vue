<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Upload, Loader2 } from "lucide-vue-next";

const uploadProgress = ref(0);
let uploadTimer: number | undefined;

onMounted(() => {
  uploadTimer = window.setInterval(() => {
    uploadProgress.value =
      uploadProgress.value >= 100 ? 0 : uploadProgress.value + 4;
  }, 400);
});

onBeforeUnmount(() => {
  if (uploadTimer) window.clearInterval(uploadTimer);
});
</script>

<template>
  <Story
    title="Dashboard stat card"
    description="A KPI tile in a metrics dashboard — the ring makes the headline number scannable at a glance."
  >
    <div class="grid max-w-md grid-cols-2 gap-4">
      <Card>
        <CardContent class="flex items-center gap-4 p-5">
          <CircularProgress :value="78" size="lg" show-value />
          <div>
            <p class="text-2xl font-semibold tabular-nums">78%</p>
            <p class="text-muted-foreground text-xs">Monthly target</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="flex items-center gap-4 p-5">
          <CircularProgress
            :value="42"
            size="lg"
            color="#3b82f6"
            track-color="#dbeafe"
            show-value
          />
          <div>
            <p class="text-2xl font-semibold tabular-nums">42%</p>
            <p class="text-muted-foreground text-xs">Quarterly goal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </Story>

  <Story
    title="File upload progress"
    description="A live upload indicator — the ring fills as bytes transfer, then swaps to a check on completion."
  >
    <Card class="max-w-md">
      <CardContent class="flex items-center gap-4 p-5">
        <CircularProgress
          :value="uploadProgress"
          size="lg"
          :color="uploadProgress >= 100 ? '#22c55e' : undefined"
        >
          <Check v-if="uploadProgress >= 100" class="size-7 text-emerald-500" />
          <Loader2 v-else class="text-muted-foreground size-6 animate-spin" />
        </CircularProgress>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <Upload class="text-muted-foreground size-4" />
            <p class="truncate text-sm font-medium">quarterly-report.xlsx</p>
          </div>
          <p class="text-muted-foreground mt-1 text-xs">
            {{
              uploadProgress >= 100
                ? "Upload complete"
                : `Uploading… ${uploadProgress}%`
            }}
          </p>
        </div>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Size variants"
    description="sm (40px), default (56px), and lg (80px) — pick the size that fits the surrounding density."
  >
    <div class="flex items-end gap-8">
      <div class="flex flex-col items-center gap-2">
        <CircularProgress :value="60" size="sm" show-value />
        <span class="text-muted-foreground text-xs">sm</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <CircularProgress :value="60" size="default" show-value />
        <span class="text-muted-foreground text-xs">default</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <CircularProgress :value="60" size="lg" show-value />
        <span class="text-muted-foreground text-xs">lg</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <CircularProgress :value="60" :size="120" :thickness="12" show-value />
        <span class="text-muted-foreground text-xs">custom 120px</span>
      </div>
    </div>
  </Story>

  <Story
    title="Status colors"
    description="Color the arc to match the outcome — green for success, red for warning, blue for info."
  >
    <div class="flex items-center gap-8">
      <div class="flex flex-col items-center gap-2">
        <CircularProgress
          :value="100"
          color="#22c55e"
          track-color="#dcfce7"
          show-value
        />
        <span class="text-muted-foreground text-xs">Complete</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <CircularProgress
          :value="35"
          color="#ef4444"
          track-color="#fee2e2"
          show-value
        />
        <span class="text-muted-foreground text-xs">At risk</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <CircularProgress
          :value="65"
          color="#3b82f6"
          track-color="#dbeafe"
          show-value
        />
        <span class="text-muted-foreground text-xs">In progress</span>
      </div>
    </div>
  </Story>

  <Story
    title="Indeterminate spinner"
    description="When the total is unknown, indeterminate mode spins a partial arc — useful while waiting on a server."
  >
    <div class="flex items-center gap-8">
      <CircularProgress indeterminate size="sm" />
      <CircularProgress indeterminate size="default" />
      <CircularProgress indeterminate size="lg" />
    </div>
  </Story>

  <Story
    title="Task checklist"
    description="Use the default slot to render a fraction label instead of a percentage — great for step counters."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle class="text-base">Onboarding progress</CardTitle>
      </CardHeader>
      <CardContent class="flex items-center gap-5">
        <CircularProgress :value="67" size="lg">
          <span class="text-foreground text-sm font-semibold tabular-nums"
            >4/6</span
          >
        </CircularProgress>
        <ul class="text-muted-foreground flex-1 space-y-1.5 text-sm">
          <li class="text-foreground flex items-center gap-2">
            <Check class="size-4 text-emerald-500" /> Create account
          </li>
          <li class="text-foreground flex items-center gap-2">
            <Check class="size-4 text-emerald-500" /> Verify email
          </li>
          <li class="text-foreground flex items-center gap-2">
            <Check class="size-4 text-emerald-500" /> Set up workspace
          </li>
          <li class="text-foreground flex items-center gap-2">
            <Check class="size-4 text-emerald-500" /> Invite teammates
          </li>
          <li>Connect calendar</li>
          <li>Complete profile</li>
        </ul>
      </CardContent>
    </Card>
  </Story>
</template>
