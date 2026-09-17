export { default as Stepper } from './Stepper.vue'
export { default as StepperHeader } from './StepperHeader.vue'
export { default as StepperItem } from './StepperItem.vue'
export { default as StepperIndicator } from './StepperIndicator.vue'
export { default as StepperContent } from './StepperContent.vue'
export { default as StepperTitle } from './StepperTitle.vue'
export { default as StepperDescription } from './StepperDescription.vue'
export { default as StepperStep } from './StepperStep.vue'
export type { StepperStep as StepperStepConfig } from './types'
export type { StepperOrientation, StepperSize, StepperStatus } from './context'

// Re-export variant API from the sibling file (kept separate to avoid the
// StepperIndicator.vue <-> index.ts circular import that broke dev SSR).
export { stepperIndicatorVariants, type StepperIndicatorVariants } from './stepper.variants'
