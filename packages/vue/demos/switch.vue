<script setup lang="ts">
// Astro's plain Vue has no Nuxt auto-import; pull reactivity APIs explicitly.
import { ref } from "vue";
import { Check, X } from "lucide-vue-next";

const enabled = ref(true);
</script>

<template>
  <Story
    title="Default"
    description="Two-way bound boolean. Click toggles the state."
  >
    <div class="flex items-center gap-2">
      <Switch id="airplane" v-model="enabled" />
      <Label for="airplane"
        >Airplane mode {{ enabled ? "(on)" : "(off)" }}</Label
      >
    </div>
  </Story>

  <Story
    title="States"
    description="On / off / disabled / disabled-on combinations."
  >
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <Switch id="s1" :model-value="true" />
        <Label for="s1">Default on</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch id="s2" :model-value="false" />
        <Label for="s2">Default off</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch id="s3" disabled />
        <Label for="s3" class="text-muted-foreground">Disabled</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch id="s4" :model-value="true" disabled />
        <Label for="s4" class="text-muted-foreground">Disabled on</Label>
      </div>
    </div>
  </Story>

  <Story
    title="With text"
    description="Checked and unchecked text labels inside the track."
  >
    <div class="flex flex-wrap items-center gap-4">
      <Switch
        checked-children="ON"
        un-checked-children="OFF"
        :model-value="true"
      />
      <Switch
        checked-children="ON"
        un-checked-children="OFF"
        :model-value="false"
      />
      <Switch
        checked-children="Yes"
        un-checked-children="No"
        size="lg"
        :model-value="true"
      />
      <Switch
        checked-children="Yes"
        un-checked-children="No"
        size="lg"
        :model-value="false"
      />
    </div>
  </Story>

  <Story
    title="With icons"
    description="Slots for checked and unchecked children support icons."
  >
    <div class="flex flex-wrap items-center gap-4">
      <Switch :model-value="true">
        <template #checked-children>
          <Check class="size-3" />
        </template>
        <template #unchecked-children>
          <X class="size-3" />
        </template>
      </Switch>
      <Switch :model-value="false">
        <template #checked-children>
          <Check class="size-3" />
        </template>
        <template #unchecked-children>
          <X class="size-3" />
        </template>
      </Switch>
      <Switch size="lg" :model-value="true">
        <template #checked-children>
          <Check class="size-3.5" />
        </template>
        <template #unchecked-children>
          <X class="size-3.5" />
        </template>
      </Switch>
    </div>
  </Story>

  <Story
    title="Loading"
    description="Loading state shows a spinner and disables interaction."
  >
    <div class="flex flex-wrap items-center gap-4">
      <Switch loading :model-value="true" />
      <Switch loading :model-value="false" />
      <Switch loading size="lg" :model-value="true" />
      <Switch
        loading
        size="lg"
        checked-children="ON"
        un-checked-children="OFF"
        :model-value="true"
      />
    </div>
  </Story>

  <Story title="Sizes" description="Three sizes with and without inner labels.">
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-4">
        <Switch size="sm" :model-value="true" />
        <Switch size="default" :model-value="true" />
        <Switch size="lg" :model-value="true" />
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Switch
          size="sm"
          checked-children="1"
          un-checked-children="0"
          :model-value="true"
        />
        <Switch
          size="default"
          checked-children="ON"
          un-checked-children="OFF"
          :model-value="true"
        />
        <Switch
          size="lg"
          checked-children="ON"
          un-checked-children="OFF"
          :model-value="true"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Colors"
    description="Custom track colors beyond the default primary."
  >
    <div class="flex flex-wrap items-center gap-4">
      <Switch color="success" :model-value="true" />
      <Switch color="warning" :model-value="true" />
      <Switch color="error" :model-value="true" />
      <Switch color="info" :model-value="true" />
      <Switch color="secondary" :model-value="true" />
      <Switch color="#8b5cf6" :model-value="true" />
    </div>
  </Story>
</template>
