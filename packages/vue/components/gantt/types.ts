export type GanttScale = "day" | "week" | "month" | "quarter" | "year";

export type GanttTaskStatus =
  "todo" | "in-progress" | "done" | "blocked" | "at-risk";

export type GanttTaskPriority = "low" | "medium" | "high" | "urgent";

export interface GanttDependency {
  fromId: string;
  toId: string;
  type?: "finish-to-start" | "start-to-start" | "finish-to-finish";
}

export interface GanttAssignee {
  name: string;
  avatar?: string;
  initials?: string;
  role?: string;
}

export interface GanttTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  progress?: number; // 0 to 100
  color?: string;
  status?: GanttTaskStatus;
  priority?: GanttTaskPriority;
  assignee?: GanttAssignee;
  isMilestone?: boolean;
  isGroup?: boolean;
  parentId?: string | null;
  isExpanded?: boolean;
  dependencies?: string[]; // task IDs
  children?: GanttTask[];
}

export interface GanttColumn {
  key: string;
  label: string;
  width?: string;
}
