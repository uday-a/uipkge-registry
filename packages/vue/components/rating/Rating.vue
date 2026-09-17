<script setup lang="ts">
import { computed, useId } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

export interface RatingProps {
  /** Currently selected value */
  modelValue?: number;
  /** Maximum rating value */
  max?: number;
  /** If true, prevents user interaction */
  readonly?: boolean;
  /** If true, disables the rating */
  disabled?: boolean;
  /** Density of the component */
  density?: "compact" | "default" | "comfortable";
  /** Color of the selected stars */
  color?: string;
  /** If true, clicking the same value clears the rating */
  clearable?: boolean;
  /** If true, stars grow on hover */
  hover?: boolean;
  /** ARIA label for each rating item */
  itemAriaLabel?: string;
  /** Size of the stars */
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  /** Custom class for the component */
  class?: HTMLAttributes["class"];
  /** Show rating count (placeholder for future) */
  showValue?: boolean;
  /** Card variant styling */
  variant?: "outlined" | "filled" | "soft";
  /** If true, creates a half star at 0.5 */
  halfIncrements?: boolean;
  /** If true, displays tooltips on hover */
  tooltips?: string[];
}

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  max: 5,
  readonly: false,
  disabled: false,
  density: "default",
  color: "var(--warning)",
  clearable: false,
  hover: false,
  itemAriaLabel: "rating",
  size: "medium",
  showValue: false,
  variant: "outlined",
  halfIncrements: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const instanceId = useId();

const densityClasses = {
  compact: "rating-density-compact",
  default: "rating-density-default",
  comfortable: "rating-density-comfortable",
};

const variantClasses = {
  outlined: "rating-variant-outlined",
  filled: "rating-variant-filled",
  soft: "rating-variant-soft",
};

const sizeClasses = {
  "x-small": "rating-size-xs",
  small: "rating-size-sm",
  medium: "rating-size-md",
  large: "rating-size-lg",
  "x-large": "rating-size-xl",
};

const componentClasses = computed(() => [
  "rating",
  densityClasses[props.density],
  variantClasses[props.variant],
  sizeClasses[props.size],
  {
    "rating-readonly": props.readonly,
    "rating-disabled": props.disabled,
    "rating-hover": props.hover,
    "rating-clearable": props.clearable,
    "rating-show-value": props.showValue,
  },
  props.class,
]);

function resolveClickValue(event: MouseEvent, star: number): number {
  if (!props.halfIncrements) return star;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const isLeft = event.clientX - rect.left < rect.width / 2;
  const next = isLeft ? star - 0.5 : star;
  return next < 0.5 ? 0.5 : next;
}

function handleClick(event: MouseEvent, star: number) {
  if (props.disabled || props.readonly) return;
  const value = resolveClickValue(event, star);
  if (props.clearable && value === props.modelValue) {
    emit("update:modelValue", 0);
  } else {
    emit("update:modelValue", value);
  }
}

function handleKeydown(event: KeyboardEvent, star: number) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (props.disabled || props.readonly) return;
    const value = star;
    if (props.clearable && value === props.modelValue) {
      emit("update:modelValue", 0);
    } else {
      emit("update:modelValue", value);
    }
    return;
  }
  const step = props.halfIncrements ? 0.5 : 1;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    const next = Math.min(props.max, (props.modelValue ?? 0) + step);
    emit("update:modelValue", next);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    const next = Math.max(0, (props.modelValue ?? 0) - step);
    emit("update:modelValue", next);
  } else if (event.key === "Home") {
    event.preventDefault();
    emit("update:modelValue", props.halfIncrements ? 0.5 : 1);
  } else if (event.key === "End") {
    event.preventDefault();
    emit("update:modelValue", props.max);
  }
}

function getStarClass(index: number): string[] {
  const value = props.modelValue;
  const classes = ["rating-star"];

  if (value >= index + 1) {
    classes.push("rating-star-full");
  } else if (value >= index + 0.5 && props.halfIncrements) {
    classes.push("rating-star-half");
  } else {
    classes.push("rating-star-empty");
  }

  return classes;
}

/** Stagger cascade only for filled stars (0-based index). */
function starDelay(index: number): string {
  if (props.modelValue < index + 1) return "0ms";
  return `${index * 45}ms`;
}
</script>

<template>
  <div
    data-uipkge
    data-slot="rating"
    :class="cn(...componentClasses)"
    role="radiogroup"
    :aria-valuenow="modelValue"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-label="`Rating: ${modelValue} of ${max}`"
  >
    <button
      v-for="n in max"
      :key="n"
      type="button"
      role="radio"
      class="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
      :class="getStarClass(n - 1)"
      :style="{ '--star-delay': starDelay(n - 1) }"
      :disabled="disabled || readonly"
      :aria-label="tooltips?.[n - 1] ?? `${itemAriaLabel} ${n} of ${max}`"
      :aria-checked="Math.ceil(modelValue || 0) === n"
      :title="tooltips?.[n - 1]"
      :tabindex="
        readonly || disabled ? -1 : Math.ceil(modelValue || 1) === n ? 0 : -1
      "
      @click="handleClick($event, n)"
      @keydown="handleKeydown($event, n)"
    >
      <!-- Full Star Icon -->
      <svg
        v-if="modelValue >= n"
        class="star-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        :style="{ color: props.color }"
      >
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
      <!-- Half Star Icon -->
      <svg
        v-else-if="modelValue >= n - 0.5 && halfIncrements"
        class="star-icon star-half"
        viewBox="0 0 24 24"
        aria-hidden="true"
        :style="{ color: props.color }"
      >
        <defs>
          <linearGradient :id="`${instanceId}-half-${n}`">
            <stop offset="50%" stop-color="currentColor" />
            <stop offset="50%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          :fill="`url(#${instanceId}-half-${n})`"
          stroke="currentColor"
          stroke-width="1"
        />
      </svg>
      <!-- Empty Star Icon -->
      <svg
        v-else
        class="star-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </button>
    <span v-if="showValue" class="rating-value">{{ modelValue }}</span>
  </div>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
}

.rating-readonly {
  cursor: default;
}

.rating-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.rating-star {
  transition: transform 0.15s ease-in-out;
}

.rating:not(.rating-disabled):not(.rating-readonly) .rating-star:hover {
  transform: scale(1.12);
}

.rating-hover .rating-star:hover {
  transform: scale(1.18);
}

.rating-clearable .rating-star {
  cursor: pointer;
}

.rating-variant-filled {
  background: var(--muted);
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.rating-variant-soft {
  background: var(--accent);
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.rating-star {
  background: none;
  border: none;
  padding: 0.125rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.rating-star:focus-visible {
  outline: 2px solid v-bind(color);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Density */
.rating-density-compact .rating-star {
  padding: 0;
}

.rating-density-default .rating-star {
  padding: 0.0625rem;
}

.rating-density-comfortable .rating-star {
  padding: 0.125rem;
}

/* Sizes */
.rating-size-xs .star-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.rating-size-sm .star-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.rating-size-md .star-icon {
  width: 1.375rem;
  height: 1.375rem;
}

.rating-size-lg .star-icon {
  width: 1.625rem;
  height: 1.625rem;
}

.rating-size-xl .star-icon {
  width: 2rem;
  height: 2rem;
}

.rating-star-empty {
  color: var(--muted-foreground);
}

.rating-star-full {
  color: v-bind(color);
}

.rating-star-full .star-icon {
  animation: rating-star-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
  animation-delay: var(--star-delay, 0ms);
}

@keyframes rating-star-pop {
  0% {
    opacity: 0.4;
    transform: scale(0.6);
  }
  60% {
    opacity: 1;
    transform: scale(1.18);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rating-star-full .star-icon {
    animation: none !important;
  }
  .rating-star {
    transition: none !important;
  }
}

.rating-star-half .star-icon {
  position: relative;
}

.rating-value {
  margin-left: 0.5rem;
  font-weight: 600;
  color: var(--foreground);
}

.rating-show-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
