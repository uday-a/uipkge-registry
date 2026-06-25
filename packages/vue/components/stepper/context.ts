import type { InjectionKey, Ref } from 'vue'
import type { StepperStep } from './types'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperStatus = 'active' | 'completed' | 'pending' | 'error'
export type StepperSize = 'sm' | 'default' | 'lg'

export interface StepperContext {
  orientation: Ref<StepperOrientation>
  size: Ref<StepperSize>
  activeStep: Ref<number>
  steps: Ref<StepperStep[]>
  goToStep: (stepIndex: number) => void
  isClickable: (index: number) => boolean
  getStatus: (index: number) => StepperStatus
}

export const STEPPER_CONTEXT: InjectionKey<StepperContext> = Symbol('StepperContext')
