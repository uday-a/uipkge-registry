export { default as TreeSelect } from "./TreeSelect.vue";
// The data type gets the canonical `TreeSelectNode` name (consumers type their
// trees with it); the internal row component stays reachable under an alias.
export { default as TreeSelectNodeComponent } from "./TreeSelectNode.vue";
export type { TreeSelectNode } from "./types";
