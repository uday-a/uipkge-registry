import type { InjectionKey, Ref } from "vue";
import type { TreeViewItem } from "./types";

export interface TreeViewContext {
  expandedIds: Ref<Set<string>>;
  selectedId: Ref<string | null>;
  showIcons: Ref<boolean>;
  showCheckboxes: Ref<boolean>;
  toggle: (item: TreeViewItem) => void;
  select: (item: TreeViewItem) => void;
}

export const TREE_VIEW_CONTEXT: InjectionKey<TreeViewContext> =
  Symbol("TreeViewContext");
