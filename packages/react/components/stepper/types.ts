import type { LucideIcon } from "lucide-react";

export interface StepperStep {
  id: string | number;
  title: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  error?: boolean;
}
