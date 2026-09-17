<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { useFormField } from "./useFormField";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { error, formMessageId } = useFormField();
</script>

<template>
  <p
    v-if="error"
    :id="formMessageId"
    data-uipkge
    data-slot="form-message"
    role="alert"
    :class="cn('text-destructive text-sm', props.class)"
  >
    {{ error }}
  </p>
</template>
