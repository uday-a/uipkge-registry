<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    selected?: string[];
    multiple?: boolean;
    filter?: boolean;
    column?: boolean;
    mandatory?: boolean;
    max?: number;
    disabled?: boolean;
  }>(),
  {
    selected: () => [],
    multiple: false,
    filter: false,
    column: false,
    mandatory: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:selected": [value: string[]];
}>();

function isSelected(value: string) {
  return props.selected.includes(value);
}

function toggle(value: string) {
  if (props.disabled) return;

  let newSelected: string[];

  if (props.multiple) {
    if (isSelected(value)) {
      newSelected = props.selected.filter((v) => v !== value);
    } else {
      if (props.max && props.selected.length >= props.max) {
        newSelected = [...props.selected.slice(1), value];
      } else {
        newSelected = [...props.selected, value];
      }
    }
  } else {
    if (isSelected(value) && !props.mandatory) {
      newSelected = [];
    } else {
      newSelected = [value];
    }
  }

  emit("update:selected", newSelected);
}
</script>

<template>
  <div
    role="group"
    :class="['flex flex-wrap gap-2', column ? 'flex-col' : '', props.class]"
    :data-chip-group="true"
    :data-multiple="multiple || undefined"
    :data-filter="filter || undefined"
  >
    <slot
      :selected="selected"
      :multiple="multiple"
      :filter="filter"
      :is-selected="isSelected"
      :toggle="toggle"
    />
  </div>
</template>
