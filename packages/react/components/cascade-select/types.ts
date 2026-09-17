export interface CascadeOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascadeOption[];
  [key: string]: unknown;
}
