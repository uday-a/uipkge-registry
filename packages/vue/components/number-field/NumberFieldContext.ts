import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

export type NumberFieldSize = 'small' | 'middle' | 'large'
export type NumberFieldStatus = 'error' | 'warning'
export type NumberFieldControlsPosition = 'default' | 'right'

export interface NumberFieldContext {
  size: Ref<NumberFieldSize>
  status: Ref<NumberFieldStatus | undefined>
  controlsPosition: Ref<NumberFieldControlsPosition>
  keyboard: Ref<boolean>
  formatter: Ref<((value: number | undefined) => string) | undefined>
  parser: Ref<((displayValue: string) => number | undefined) | undefined>
  prefix: Ref<string | undefined>
  suffix: Ref<string | undefined>
}

export const NumberFieldContextKey: InjectionKey<NumberFieldContext> = Symbol('NumberFieldContext')

export function provideNumberFieldContext(context: NumberFieldContext) {
  provide(NumberFieldContextKey, context)
}

export function injectNumberFieldContext(): NumberFieldContext {
  return inject(NumberFieldContextKey, {
    size: ref('middle'),
    status: ref(undefined),
    controlsPosition: ref('default'),
    keyboard: ref(true),
    formatter: ref(undefined),
    parser: ref(undefined),
    prefix: ref(undefined),
    suffix: ref(undefined),
  })
}
