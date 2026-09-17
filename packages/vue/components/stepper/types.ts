import type { Component } from 'vue'

export interface StepperStep {
  id: string | number
  title: string
  description?: string
  icon?: Component
  disabled?: boolean
  error?: boolean
}
