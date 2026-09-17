"use client";

import * as React from "react";
import type { StepperStep } from "./types";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperStatus = "active" | "completed" | "pending" | "error";
export type StepperSize = "sm" | "default" | "lg";

export interface StepperContextValue {
  orientation: StepperOrientation;
  size: StepperSize;
  activeStep: number;
  steps: StepperStep[];
  goToStep: (stepIndex: number) => void;
  isClickable: (index: number) => boolean;
  getStatus: (index: number) => StepperStatus;
}

export const StepperContext = React.createContext<StepperContextValue | null>(
  null,
);

export function useStepperContext(): StepperContextValue {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("StepperItem must be used inside <Stepper>");
  return ctx;
}
