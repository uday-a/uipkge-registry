import { getContext, setContext } from 'svelte'
import type { StepperStep } from './types'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperStatus = 'active' | 'completed' | 'pending' | 'error'
export type StepperSize = 'sm' | 'default' | 'lg'

/**
 * Stepper state shared from <Stepper> to its items. Exposed as functions so
 * reads inside child templates/`$derived` track the root's runes state.
 */
export interface StepperContextValue {
  orientation: () => StepperOrientation
  size: () => StepperSize
  activeStep: () => number
  steps: () => StepperStep[]
  goToStep: (stepIndex: number) => void
  isClickable: (index: number) => boolean
  getStatus: (index: number) => StepperStatus
}

const KEY = Symbol.for('uipkge:stepper')

export function setStepperContext(value: StepperContextValue): StepperContextValue {
  setContext(KEY, value)
  return value
}

export function getStepperContext(): StepperContextValue | null {
  return getContext<StepperContextValue | null>(KEY) ?? null
}
