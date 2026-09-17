export { default as RangeSlider } from "./RangeSlider.vue";

export interface RangeSliderProps {
  /** The controlled value of the range slider. Can be binded with v-model. */
  modelValue?: [number, number];
  /** The value of the range slider that should be checked when initially rendered. */
  defaultValue?: [number, number];
  /** When `true`, prevents the user from interacting with the range slider */
  disabled?: boolean;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
  /** Label for the range slider */
  label?: string;
  /** Hint text for the range slider */
  hint?: string;
  /** Error messages to display */
  errorMessages?: string | string[];
  /** Whether to show error state */
  error?: boolean;
  /** Custom color for the track fill */
  color?:
    "primary" | "secondary" | "success" | "warning" | "error" | "info" | string;
  /** Thumb size */
  thumbSize?: "sm" | "md" | "lg";
  /** Track height */
  trackHeight?: "sm" | "md" | "lg";
  /** Show ticks */
  showTicks?: boolean;
  /** Tick interval */
  tickInterval?: number;
  /** Show thumb labels */
  thumbLabel?: boolean;
  /** Invert the slider */
  inverted?: boolean;
  /** Format thumb label */
  thumbLabelFormat?: (value: number) => string;
}
