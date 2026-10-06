import type { Component } from 'svelte'

/** Loose icon-component type (mirrors Vue's `Component`): any component accepting a class. */
export type IconComponent = Component<Record<string, any>>

export interface StepperStep {
  id: string | number
  title: string
  description?: string
  icon?: IconComponent
  disabled?: boolean
  error?: boolean
}
