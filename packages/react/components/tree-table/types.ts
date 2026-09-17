import type { ReactNode } from "react";

export interface TreeTableColumn<T = any> {
  /** Unique key matching a field on the row data. */
  key: string;
  /** Header label. */
  label: string;
  /** Optional class for the header cell. */
  headerClass?: string;
  /** Optional class for body cells in this column. */
  cellClass?: string;
  /** Custom cell renderer: receives the row and returns a React node. */
  render?: (row: T) => ReactNode;
}

export interface TreeTableRow<T = any> {
  /** Unique id for the row. */
  id: string;
  /** Row data fields keyed by column key. */
  [key: string]: any;
  /** Child rows. */
  children?: TreeTableRow<T>[];
}
