export interface TreeSelectNode {
  value: string;
  label: string;
  disabled?: boolean;
  children?: TreeSelectNode[];
  [key: string]: unknown;
}
