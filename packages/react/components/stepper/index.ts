export {
  Stepper,
  StepperHeader,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperStep,
  type StepperProps,
  type StepperItemProps,
  type StepperIndicatorProps,
  type StepperContentProps,
  type StepperStepProps,
} from "./stepper";
export type { StepperStep as StepperStepConfig } from "./types";
export type { StepperOrientation, StepperSize, StepperStatus } from "./context";

// Re-export variant API from the sibling file (kept separate to avoid the
// stepper.tsx <-> index.ts circular import that broke dev SSR in the Vue source).
export {
  stepperIndicatorVariants,
  type StepperIndicatorVariants,
} from "./stepper.variants";
