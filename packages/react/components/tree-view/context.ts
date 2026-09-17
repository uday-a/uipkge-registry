"use client";

import * as React from "react";
import type { TreeViewItem } from "./types";

export interface TreeViewContextValue {
  expandedIds: Set<string>;
  selectedId: string | null;
  showIcons: boolean;
  showCheckboxes: boolean;
  toggle: (item: TreeViewItem) => void;
  select: (item: TreeViewItem) => void;
}

// The Vue source threads the tree state from <TreeView> down to each
// <TreeViewNode> via provide/inject. React's equivalent is context — the Root
// sets it, every recursing node reads it. `null` default lets a node throw if
// rendered outside a <TreeView>.
export const TreeViewContext = React.createContext<TreeViewContextValue | null>(
  null,
);
