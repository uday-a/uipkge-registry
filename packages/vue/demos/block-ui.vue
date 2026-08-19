<script setup lang="ts">
import { ref } from "vue";
import { BlockUi } from "@/components/ui/block-ui";
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
import { CloudUpload, Database, ShieldCheck, RefreshCw } from "lucide-vue-next";

const saving = ref(false);
const fetching = ref(false);
const syncing = ref(false);

async function saveSettings() {
  saving.value = true;
  await new Promise((r) => setTimeout(r, 2200));
  saving.value = false;
}

async function fetchReport() {
  fetching.value = true;
  await new Promise((r) => setTimeout(r, 2500));
  fetching.value = false;
}

async function syncData() {
  syncing.value = true;
  await new Promise((r) => setTimeout(r, 3000));
  syncing.value = false;
}
</script>

<template>
  <Story
    title="Settings form during save"
    description="Block the whole card while a save request is in flight so users can't edit stale fields mid-submit."
  >
    <div class="max-w-md">
      <BlockUi v-model="saving" message="Saving your changes…">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Project settings</CardTitle>
            <CardDescription
              >Changes apply to all team members.</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-1.5">
              <Label>Project name</Label>
              <Input model-value="Acme Website Redesign" />
            </div>
            <div class="space-y-1.5">
              <Label>Owner</Label>
              <Input model-value="sarah.johnson@acme.com" />
            </div>
            <Button class="w-full" :disabled="saving" @click="saveSettings">
              {{ saving ? "Saving…" : "Save changes" }}
            </Button>
          </CardContent>
        </Card>
      </BlockUi>
    </div>
  </Story>

  <Story
    title="Data fetch with blur"
    description="Blur the stale content while fresh data loads — signals that what's behind the overlay is about to change."
  >
    <div class="flex max-w-md flex-col gap-3">
      <Button
        variant="outline"
        class="w-fit"
        :disabled="fetching"
        @click="fetchReport"
      >
        <RefreshCw
          class="mr-2 size-4"
          :class="fetching ? 'animate-spin' : ''"
        />
        Refresh report
      </Button>
      <BlockUi v-model="fetching" blur message="Loading report…">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Q3 revenue summary</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Total revenue</span>
              <span class="font-medium tabular-nums">$1,284,500</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">New customers</span>
              <span class="font-medium tabular-nums">342</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Churn rate</span>
              <span class="font-medium tabular-nums">2.1%</span>
            </div>
          </CardContent>
        </Card>
      </BlockUi>
    </div>
  </Story>

  <Story
    title="Custom overlay icon"
    description="Swap the spinner for a context-relevant icon — here a cloud upload glyph during a file sync."
  >
    <div class="flex max-w-md flex-col gap-3">
      <Button
        variant="outline"
        class="w-fit"
        :disabled="syncing"
        @click="syncData"
      >
        <CloudUpload class="mr-2 size-4" />
        {{ syncing ? "Syncing…" : "Sync to cloud" }}
      </Button>
      <BlockUi
        v-model="syncing"
        :show-spinner="false"
        message="Uploading 14 files…"
      >
        <Card>
          <CardContent class="p-5">
            <p class="text-sm font-medium">Cloud storage</p>
            <p class="text-muted-foreground mt-1 text-xs">
              3.2 GB of 10 GB used · 14 files pending
            </p>
          </CardContent>
        </Card>
        <template #icon>
          <CloudUpload class="text-primary size-8 animate-pulse" />
        </template>
      </BlockUi>
    </div>
  </Story>

  <Story
    title="Rich message slot"
    description="Replace the plain text message with a two-line status — title plus a reassuring subtitle."
  >
    <BlockUi :model-value="true" :show-spinner="false" class="max-w-md">
      <Card>
        <CardContent class="p-6">
          <p class="text-sm font-medium">Compliance check</p>
          <p class="text-muted-foreground mt-1 text-xs">
            Running 42 rules against the current schema…
          </p>
        </CardContent>
      </Card>
      <template #icon>
        <ShieldCheck class="text-primary size-8" />
      </template>
      <template #message>
        <div class="text-center">
          <p class="text-sm font-medium">Auditing schema</p>
          <p class="text-muted-foreground text-xs">
            This usually takes a few seconds
          </p>
        </div>
      </template>
    </BlockUi>
  </Story>

  <Story
    title="Overlay appearance"
    description="Tune opacity and overlay color — a lower opacity keeps content visible, a dark tint reads as a hard block."
  >
    <div class="grid max-w-md gap-4 sm:grid-cols-2">
      <BlockUi
        :model-value="true"
        :opacity="0.3"
        message="Light veil"
        :show-spinner="false"
      >
        <Card>
          <CardContent class="p-5">
            <p class="text-sm">30% opacity</p>
            <p class="text-muted-foreground text-xs">
              Subtle — content stays readable.
            </p>
          </CardContent>
        </Card>
      </BlockUi>
      <BlockUi
        :model-value="true"
        overlay-color="#0a0a0a"
        :opacity="0.7"
        message="Hard block"
        :show-spinner="false"
      >
        <Card>
          <CardContent class="p-5">
            <p class="text-sm">Dark overlay</p>
            <p class="text-muted-foreground text-xs">
              Opaque — focus is forced to the message.
            </p>
          </CardContent>
        </Card>
      </BlockUi>
    </div>
  </Story>

  <Story
    title="Database migration panel"
    description="A realistic always-blocked state — the kind you show while a long-running migration is in progress."
  >
    <BlockUi
      :model-value="true"
      message="Running migration 0042…"
      class="max-w-md"
    >
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-base">
            <Database class="size-4" />
            Database migrations
          </CardTitle>
          <CardDescription
            >Applied migrations are listed below.</CardDescription
          >
        </CardHeader>
        <CardContent class="space-y-1.5">
          <p class="text-muted-foreground text-xs">
            0039 · add_users_table · ✓
          </p>
          <p class="text-muted-foreground text-xs">0040 · add_audit_log · ✓</p>
          <p class="text-muted-foreground text-xs">0041 · index_trails · ✓</p>
          <p class="text-xs">0042 · split_orgs · running…</p>
        </CardContent>
      </Card>
    </BlockUi>
  </Story>
</template>
