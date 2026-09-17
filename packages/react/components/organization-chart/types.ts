export interface OrgNode {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  department?: string;
  children?: OrgNode[];
  [key: string]: unknown;
}
