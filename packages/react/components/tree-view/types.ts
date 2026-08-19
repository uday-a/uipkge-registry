import type { LucideIcon } from "lucide-react";

export interface TreeViewItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  children?: TreeViewItem[];
  disabled?: boolean;
  selected?: boolean;
  expanded?: boolean;
  [key: string]: unknown;
}
