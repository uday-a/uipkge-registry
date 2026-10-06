// Registers every element: each src/components/<name>/<name>.ts and
// src/blocks/<name>/<name>.ts defines its own custom element(s) on import.
// Globbed so adding a component or block never means editing this file.
import.meta.glob('./components/*/*.ts', { eager: true })
import.meta.glob('./blocks/*/*.ts', { eager: true })

export { UipButton } from './components/button/button'
export { UipDialog } from './components/dialog/dialog'
export { UipSelect } from './components/select/select'
