<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, ref } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { passwordInputVariants } from "./password-input.variants";

const inputEl = ref<HTMLInputElement | null>(null);

interface Props {
  modelValue?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outlined" | "filled" | "borderless";
  disabled?: boolean;
  readonly?: boolean;
  showStrength?: boolean;
  showToggle?: boolean;
  minLength?: number;
  maxlength?: number;
  id?: string;
  name?: string;
  autocomplete?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Enter password",
  size: "default",
  variant: "outlined",
  disabled: false,
  readonly: false,
  showStrength: false,
  showToggle: true,
  minLength: 0,
  autocomplete: "current-password",
});

const emits = defineEmits<{
  "update:modelValue": [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const passwordVisible = ref(false);

const computedType = computed(() =>
  passwordVisible.value ? "text" : "password",
);

// Controlled when modelValue is provided; otherwise seed from defaultValue.
const isControlled = computed(() => props.modelValue !== undefined);
const internalValue = ref(props.defaultValue ?? "");

const inputValue = computed({
  get: () =>
    isControlled.value ? (props.modelValue ?? "") : internalValue.value,
  set: (val: string) => {
    if (!isControlled.value) internalValue.value = val;
    emits("update:modelValue", val);
  },
});

interface StrengthResult {
  score: number;
  label: "weak" | "fair" | "good" | "strong";
  color: string;
  barColor: string;
  percent: number;
}

const strength = computed<StrengthResult>(() => {
  const pwd = inputValue.value;
  if (!pwd)
    return {
      score: 0,
      label: "weak",
      color: "",
      barColor: "bg-transparent",
      percent: 0,
    };

  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) {
    return {
      score,
      label: "weak",
      color: "text-destructive",
      barColor: "bg-destructive",
      percent: 25,
    };
  }
  if (score <= 2) {
    return {
      score,
      label: "fair",
      color: "text-warning",
      barColor: "bg-warning",
      percent: 50,
    };
  }
  if (score <= 3) {
    return {
      score,
      label: "good",
      color: "text-info",
      barColor: "bg-info",
      percent: 75,
    };
  }
  return {
    score,
    label: "strong",
    color: "text-success",
    barColor: "bg-success",
    percent: 100,
  };
});

const meetsMinLength = computed(
  () => inputValue.value.length >= props.minLength,
);

function toggleVisibility() {
  if (props.disabled || props.readonly) return;
  passwordVisible.value = !passwordVisible.value;
  inputEl.value?.focus();
}

const wrapperClasses = computed(() =>
  cn(
    passwordInputVariants({ size: props.size, variant: props.variant }),
    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
    props.disabled &&
      "pointer-events-none opacity-50 cursor-not-allowed bg-muted/30",
    props.class,
  ),
);

const inputPadding = computed(() => {
  if (props.size === "sm") return "px-2.5";
  if (props.size === "lg") return "px-4";
  return "px-3";
});

const togglePadding = computed(() => {
  if (props.size === "sm") return "pr-2";
  if (props.size === "lg") return "pr-3";
  return "pr-2.5";
});
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div
      :class="wrapperClasses"
      data-uipkge
      data-slot="password-input"
      :data-size="size"
      :data-variant="variant"
    >
      <input
        ref="inputEl"
        :id="id"
        v-model="inputValue"
        :type="computedType"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :name="name"
        :autocomplete="autocomplete"
        :class="
          cn(
            'placeholder:text-muted-foreground w-full min-w-0 flex-1 bg-transparent outline-none',
            inputPadding,
          )
        "
        @focus="emits('focus', $event)"
        @blur="emits('blur', $event)"
      />
      <div
        v-if="showToggle"
        class="flex shrink-0 items-center"
        :class="togglePadding"
      >
        <button
          type="button"
          :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
          :aria-pressed="passwordVisible"
          :disabled="disabled || readonly"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed"
          @mousedown.prevent
          @click="toggleVisibility"
        >
          <!-- Visible password → EyeOff (click to hide); hidden → Eye (click to show). Matches Input. -->
          <EyeOff v-if="passwordVisible" class="size-4" aria-hidden="true" />
          <Eye v-else class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      v-if="showStrength && inputValue"
      class="flex flex-col gap-1.5"
      role="status"
      aria-live="polite"
      :aria-label="`Password strength: ${strength.label}`"
    >
      <div
        class="bg-muted h-1.5 w-full overflow-hidden rounded-full"
        aria-hidden="true"
      >
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="strength.barColor"
          :style="{ width: `${strength.percent}%` }"
        />
      </div>
      <div class="flex items-center justify-between text-xs">
        <span :class="strength.color" class="font-medium capitalize">{{
          strength.label
        }}</span>
        <span
          v-if="minLength > 0"
          :class="meetsMinLength ? 'text-success' : 'text-muted-foreground'"
        >
          {{ inputValue.length }} / {{ minLength }} chars
        </span>
      </div>
    </div>

    <p
      v-if="minLength > 0 && !showStrength && inputValue"
      class="text-muted-foreground text-xs"
    >
      Minimum {{ minLength }} characters
    </p>
  </div>
</template>
