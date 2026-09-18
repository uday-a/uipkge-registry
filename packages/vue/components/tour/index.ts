import type { TourTarget } from './use-tour-target'

export interface TourStep {
  target?: TourTarget
  title: string
  description?: string
  cover?: string
  mask?: boolean
  nextButtonText?: string
  prevButtonText?: string
  finishButtonText?: string
}

export type { TourTarget } from './use-tour-target'
export { default as Tour } from './Tour.vue'
