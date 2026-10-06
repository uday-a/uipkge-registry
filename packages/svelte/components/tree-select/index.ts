export { default as TreeSelect, type TreeSelectProps } from './TreeSelect.svelte'
// The data type gets the canonical `TreeSelectNode` name (consumers type their
// trees with it); the internal row component stays reachable under an alias.
export {
  default as TreeSelectNodeComponent,
  type TreeSelectNodeRowProps,
  type TreeSelectNodeRowProps as TreeSelectNodeProps,
} from './TreeSelectNode.svelte'
export { treeSelectTriggerVariants, type TreeSelectVariants } from './tree-select.variants'
export type { TreeSelectNode } from './types'
