<script setup lang="ts">
// Astro's plain Vue has no Nuxt auto-import; pull reactivity APIs explicitly.
import { ref, computed } from "vue";

const checked = ref(true);

// Group with options
const options = [
  { label: "Apple", value: "apple" },
  { label: "Pear", value: "pear" },
  { label: "Orange", value: "orange", disabled: true },
];
const selectedOptions = ref<string[]>(["apple"]);

// Check all / Uncheck all
const fruits = ["Apple", "Pear", "Orange"];
const allFruits = fruits.map((f) => f.toLowerCase());
const selectedFruits = ref<string[]>(["apple"]);

const allChecked = computed(
  () => selectedFruits.value.length === fruits.length,
);
const isIndeterminate = computed(
  () =>
    selectedFruits.value.length > 0 &&
    selectedFruits.value.length < fruits.length,
);

function toggleAll() {
  selectedFruits.value = allChecked.value ? [] : [...allFruits];
}

// Group disabled
const disabledGroupValue = ref<string[]>(["b"]);

// Group inline
const inlineValue = ref<string[]>(["a", "c"]);

// Group with name
const namedValue = ref<string[]>(["a"]);
</script>

<template>
  <Story title="States" description="All four interaction states.">
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <Checkbox id="c1" v-model="checked" />
        <Label for="c1"
          >Accept terms (live: <code>{{ checked }}</code
          >)</Label
        >
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="c2" :model-value="false" />
        <Label for="c2">Unchecked</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="c3" disabled />
        <Label for="c3" class="text-muted-foreground">Disabled</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="c4" :model-value="true" disabled />
        <Label for="c4" class="text-muted-foreground">Disabled checked</Label>
      </div>
    </div>
  </Story>

  <Story title="In a list" description="Common pattern for preference toggles.">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Checkbox id="t1" :model-value="true" />
        <Label for="t1">Subscribe to newsletter</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="t2" />
        <Label for="t2">Allow analytics</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="t3" />
        <Label for="t3">Receive marketing emails</Label>
      </div>
    </div>
  </Story>

  <Story
    title="Group with options"
    description="CheckboxGroup renders checkboxes from an options array."
  >
    <CheckboxGroup
      v-model="selectedOptions"
      :options="options"
      label="Select fruits"
    />
  </Story>

  <Story
    title="Check all / Uncheck all"
    description="Master checkbox controls all items with indeterminate state."
  >
    <div class="space-y-2">
      <Checkbox
        :model-value="allChecked"
        :indeterminate="isIndeterminate"
        label="Check all"
        @update:model-value="toggleAll"
      />
      <div class="ml-6 space-y-2">
        <CheckboxGroup v-model="selectedFruits">
          <Checkbox
            v-for="fruit in fruits"
            :key="fruit"
            :value="fruit.toLowerCase()"
            :label="fruit"
          />
        </CheckboxGroup>
      </div>
    </div>
  </Story>

  <Story
    title="Group disabled"
    description="Disabled group prevents interaction with all checkboxes."
  >
    <CheckboxGroup
      v-model="disabledGroupValue"
      disabled
      :options="[
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ]"
      label="Disabled group"
    />
  </Story>

  <Story
    title="Group inline layout"
    description="Horizontal arrangement with the inline prop."
  >
    <CheckboxGroup
      v-model="inlineValue"
      inline
      :options="[
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ]"
    />
  </Story>

  <Story
    title="Group with name"
    description="Name attribute for form submission."
  >
    <CheckboxGroup
      v-model="namedValue"
      name="my-checkbox-group"
      :options="[
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
      ]"
      label="Named group"
    />
  </Story>
</template>
