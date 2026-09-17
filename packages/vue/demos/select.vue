<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  NativeSelect,
} from "@/components/ui/select";
const fruit = ref<string>();
const nativeFruit = ref<string>("banana");
const country = ref<string>();
const role = ref<string>();
const tz = ref<string>();
const skill = ref<string>();
const disabledTrigger = ref<string>();
const fruits = ref<string[]>([]);
</script>

<template>
  <Story
    title="Default"
    description="Single-select dropdown with a placeholder and basic options."
  >
    <Select v-model="fruit">
      <SelectTrigger class="w-48">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  </Story>

  <Story
    title="Grouped with labels"
    description="Multiple SelectGroups, each with a SelectLabel header."
  >
    <Select v-model="country">
      <SelectTrigger class="w-56">
        <SelectValue placeholder="Choose a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="france">France</SelectItem>
          <SelectItem value="germany">Germany</SelectItem>
          <SelectItem value="spain">Spain</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="japan">Japan</SelectItem>
          <SelectItem value="india">India</SelectItem>
          <SelectItem value="korea">South Korea</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </Story>

  <Story
    title="Disabled item"
    description="Individual items can be disabled via the disabled prop."
  >
    <Select v-model="role">
      <SelectTrigger class="w-48">
        <SelectValue placeholder="Pick a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="admin" disabled>Admin (locked)</SelectItem>
        <SelectItem value="owner">Owner</SelectItem>
      </SelectContent>
    </Select>
  </Story>

  <Story
    title="With separator"
    description="Use SelectSeparator to visually split groups inside the popover."
  >
    <Select v-model="skill">
      <SelectTrigger class="w-56">
        <SelectValue placeholder="Pick a skill level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectSeparator />
        <SelectItem value="advanced">Advanced</SelectItem>
        <SelectItem value="expert">Expert</SelectItem>
      </SelectContent>
    </Select>
  </Story>

  <Story
    title="Long list with scroll buttons"
    description="When content exceeds available height, scroll up/down buttons render automatically."
  >
    <Select v-model="tz">
      <SelectTrigger class="w-64">
        <SelectValue placeholder="Pick a timezone" />
      </SelectTrigger>
      <SelectContent class="max-h-56">
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="utc-08">(UTC-08) Pacific Time</SelectItem>
          <SelectItem value="utc-07">(UTC-07) Mountain Time</SelectItem>
          <SelectItem value="utc-06">(UTC-06) Central Time</SelectItem>
          <SelectItem value="utc-05">(UTC-05) Eastern Time</SelectItem>
          <SelectItem value="utc-04">(UTC-04) Atlantic Time</SelectItem>
          <SelectItem value="utc-03">(UTC-03) Buenos Aires</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="utc+00">(UTC+00) London</SelectItem>
          <SelectItem value="utc+01">(UTC+01) Paris</SelectItem>
          <SelectItem value="utc+02">(UTC+02) Athens</SelectItem>
          <SelectItem value="utc+03">(UTC+03) Moscow</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="utc+05:30">(UTC+05:30) Mumbai</SelectItem>
          <SelectItem value="utc+07">(UTC+07) Bangkok</SelectItem>
          <SelectItem value="utc+08">(UTC+08) Singapore</SelectItem>
          <SelectItem value="utc+09">(UTC+09) Tokyo</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </Story>

  <Story
    title="Disabled trigger"
    description="Pass disabled to the root to lock the entire control."
  >
    <Select v-model="disabledTrigger" disabled>
      <SelectTrigger class="w-48">
        <SelectValue placeholder="Locked" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
        <SelectItem value="b">B</SelectItem>
      </SelectContent>
    </Select>
  </Story>

  <Story
    title="Multi-select"
    description="Pass multiple to the root; modelValue becomes a string[]."
  >
    <div class="space-y-2">
      <Select v-model="fruits" multiple>
        <SelectTrigger class="w-56">
          <SelectValue placeholder="Pick fruits" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="durian">Durian</SelectItem>
          <SelectItem value="elderberry">Elderberry</SelectItem>
        </SelectContent>
      </Select>
      <p class="text-muted-foreground text-xs">
        Selected:
        <code class="text-foreground">{{
          fruits.length ? fruits.join(", ") : "—"
        }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Native Select"
    description="Zero-JS lightweight HTML select styled with tokens and chevron for mobile & fast forms."
  >
    <div class="grid max-w-xs gap-3">
      <NativeSelect
        v-model="nativeFruit"
        :options="[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
          {
            label: 'Dragonfruit (Sold out)',
            value: 'dragonfruit',
            disabled: true,
          },
        ]"
      />
      <p class="text-muted-foreground text-xs">
        Selected: <code class="text-foreground">{{ nativeFruit }}</code>
      </p>
    </div>
  </Story>
</template>
