import { getContext, setContext } from 'svelte'

export type NumberFieldSize = 'small' | 'middle' | 'large'
export type NumberFieldStatus = 'error' | 'warning'
export type NumberFieldControlsPosition = 'default' | 'right'

export interface NumberFieldContextValue {
  getValue: () => number | undefined
  setValue: (value: number | undefined) => void
  handleIncrease: (times?: number) => void
  handleDecrease: (times?: number) => void
  handleMinMaxValue: (which: 'min' | 'max') => void
  applyInputValue: (displayValue: string) => void
  formatValue: (value: number | undefined) => string
  getMin: () => number | undefined
  getMax: () => number | undefined
  isDisabled: () => boolean
  isReadonly: () => boolean
  getInputMode: () => 'decimal' | 'numeric'
  isWheelChangeDisabled: () => boolean
  isWheelChangeInverted: () => boolean
  getSize: () => NumberFieldSize
  getStatus: () => NumberFieldStatus | undefined
  getControlsPosition: () => NumberFieldControlsPosition
  isKeyboardEnabled: () => boolean
  getFormatter: () => ((value: number | undefined) => string) | undefined
  getParser: () => ((displayValue: string) => number | undefined) | undefined
  getPrefix: () => string | undefined
  getSuffix: () => string | undefined
  getId: () => string | undefined
  getPlaceholder: () => string | undefined
}

const NumberFieldContextKey = Symbol('NumberFieldContext')

export function setNumberFieldContext(context: NumberFieldContextValue) {
  setContext(NumberFieldContextKey, context)
}

const fallbackContext: NumberFieldContextValue = {
  getValue: () => undefined,
  setValue: () => {},
  handleIncrease: () => {},
  handleDecrease: () => {},
  handleMinMaxValue: () => {},
  applyInputValue: () => {},
  formatValue: (value) => (value === undefined ? '' : String(value)),
  getMin: () => undefined,
  getMax: () => undefined,
  isDisabled: () => false,
  isReadonly: () => false,
  getInputMode: () => 'decimal',
  isWheelChangeDisabled: () => false,
  isWheelChangeInverted: () => false,
  getSize: () => 'middle',
  getStatus: () => undefined,
  getControlsPosition: () => 'default',
  isKeyboardEnabled: () => true,
  getFormatter: () => undefined,
  getParser: () => undefined,
  getPrefix: () => undefined,
  getSuffix: () => undefined,
  getId: () => undefined,
  getPlaceholder: () => undefined,
}

export function getNumberFieldContext(): NumberFieldContextValue {
  return getContext<NumberFieldContextValue>(NumberFieldContextKey) ?? fallbackContext
}
