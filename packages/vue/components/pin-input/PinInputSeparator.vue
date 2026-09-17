<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import { Minus } from "lucide-vue-next";
import { Primitive, useForwardProps } from "reka-ui";

const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="pin-input-separator"
    role="separator"
    v-bind="forwardedProps"
  >
    <slot>
      <Minus aria-hidden="true" />
    </slot>
  </Primitive>
</template>
