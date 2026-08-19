export { TreeSelect, type TreeSelectProps } from "./TreeSelect";
// The data type gets the canonical `TreeSelectNode` name (consumers type their
// trees with it); the internal row component stays reachable under an alias.
export {
  TreeSelectNode as TreeSelectNodeComponent,
  type TreeSelectNodeProps,
} from "./TreeSelectNode";
export {
  treeSelectTriggerVariants,
  type TreeSelectVariants,
} from "./tree-select.variants";
export type { TreeSelectNode } from "./types";
