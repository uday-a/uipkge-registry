<script setup lang="ts">
import { ref } from "vue";
import { LoadingBar, useLoadingBar } from "@/components/ui/loading-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle } from "lucide-vue-next";

const pageBar = useLoadingBar();
const formBar = useLoadingBar();
const bottomBar = useLoadingBar();

const manualValue = ref(40);
const formStatus = ref<"idle" | "saving" | "done" | "error">("idle");

async function simulatePageLoad() {
  pageBar.start();
  await new Promise((r) => setTimeout(r, 1800));
  pageBar.finish();
}

async function simulateApiError() {
  pageBar.start();
  await new Promise((r) => setTimeout(r, 1400));
  pageBar.error();
}

async function submitForm() {
  formStatus.value = "saving";
  formBar.start();
  await new Promise((r) => setTimeout(r, 2000));
  formBar.finish();
  formStatus.value = "done";
  setTimeout(() => (formStatus.value = "idle"), 1500);
}

async function runBottomBar() {
  bottomBar.start();
  await new Promise((r) => setTimeout(r, 1800));
  bottomBar.finish();
}
</script>

<template>
  <div class="space-y-8">
    <LoadingBar :ref="pageBar.setRef" />
    <LoadingBar :ref="formBar.setRef" color="#22c55e" />
    <LoadingBar :ref="bottomBar.setRef" position="bottom" color="#6366f1" />

    <Story
      title="Page navigation"
      description="The classic top-of-viewport bar that fills while a route or heavy page loads. Click to simulate a 1.8s navigation."
    >
      <div class="flex flex-wrap gap-2">
        <Button @click="simulatePageLoad">
          <Loader2
            class="mr-2 size-4 animate-spin"
            :class="pageBar.loading.value ? 'opacity-100' : 'opacity-0'"
          />
          Load dashboard
        </Button>
        <Button variant="destructive" @click="simulateApiError">
          <AlertCircle class="mr-2 size-4" />
          Failing request
        </Button>
        <Button variant="outline" @click="pageBar.inc(15)">Nudge +15%</Button>
      </div>
      <p class="text-muted-foreground mt-3 text-xs">
        The bar auto-hides when finished. The error variant tints the bar
        destructive so users know something went wrong.
      </p>
    </Story>

    <Story
      title="Form submission"
      description="Block the submit button and run a green bar while the save request is in flight, then clear on success."
    >
      <Card class="max-w-md">
        <CardHeader>
          <CardTitle class="text-base">Billing details</CardTitle>
          <CardDescription
            >Updates are saved to your account instantly.</CardDescription
          >
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-1.5">
            <Label>Company name</Label>
            <Input model-value="Acme Inc." />
          </div>
          <div class="space-y-1.5">
            <Label>Billing email</Label>
            <Input model-value="billing@acme.com" />
          </div>
          <Button
            class="w-full"
            :disabled="formStatus === 'saving'"
            @click="submitForm"
          >
            <Save class="mr-2 size-4" />
            {{
              formStatus === "saving"
                ? "Saving…"
                : formStatus === "done"
                  ? "Saved!"
                  : "Save changes"
            }}
          </Button>
          <p v-if="formStatus === 'done'" class="text-xs text-emerald-600">
            Your billing details were updated.
          </p>
        </CardContent>
      </Card>
    </Story>

    <Story
      title="Manual control"
      description="Bind v-model when you know the exact progress — e.g. a file upload reporting bytes transferred."
    >
      <div class="max-w-md space-y-3">
        <LoadingBar v-model="manualValue" :height="4" />
        <input
          v-model.number="manualValue"
          type="range"
          min="0"
          max="100"
          class="w-full"
        />
        <div class="text-muted-foreground flex justify-between text-xs">
          <span>Transferred</span>
          <span class="tabular-nums">{{ manualValue }}%</span>
        </div>
      </div>
    </Story>

    <Story
      title="Indeterminate fetching"
      description="When you can't estimate the remaining work, indeterminate slides a segment across the viewport top."
    >
      <div class="flex items-center gap-3">
        <LoadingBar indeterminate spinner :height="3" />
        <span class="text-muted-foreground text-xs whitespace-nowrap"
          >Fetching results…</span
        >
      </div>
    </Story>

    <Story
      title="Bottom-anchored bar"
      description="position='bottom' pins the bar to the lower viewport edge — handy for background sync tasks that shouldn't distract from content."
    >
      <Button variant="outline" @click="runBottomBar">
        <Loader2
          class="mr-2 size-4 animate-spin"
          :class="bottomBar.loading.value ? 'opacity-100' : 'opacity-0'"
        />
        Sync in background
      </Button>
      <p class="text-muted-foreground mt-3 text-xs">
        Watch the bottom of the viewport after clicking.
      </p>
    </Story>

    <Story
      title="Appearance options"
      description="Color, height, and error state — the building blocks for matching the bar to your theme."
    >
      <div class="grid max-w-md gap-4">
        <div class="space-y-1.5">
          <span class="text-muted-foreground text-xs"
            >Custom color + height</span
          >
          <LoadingBar :model-value="70" color="#10b981" :height="6" />
        </div>
        <div class="space-y-1.5">
          <span class="text-muted-foreground text-xs">Error state</span>
          <LoadingBar :model-value="85" error :height="6" />
        </div>
        <div class="space-y-1.5">
          <span class="text-muted-foreground text-xs"
            >Indeterminate + spinner</span
          >
          <LoadingBar indeterminate spinner color="#f59e0b" :height="4" />
        </div>
      </div>
    </Story>
  </div>
</template>
