"use client";

import * as React from "react";

export type TimelineDirection = "vertical" | "horizontal";
export type TimelineAlign = "start" | "center";
export type TimelineSide = "left" | "right" | "top" | "bottom";
export type TimelineStatus =
  "default" | "current" | "success" | "warning" | "error" | "info" | "muted";
export type TimelineDensity = "compact" | "default" | "comfortable";

export interface TimelineContextValue {
  direction: TimelineDirection;
  align: TimelineAlign;
  side: TimelineSide;
  density: TimelineDensity;
  count: number;
  register: (id: string) => void;
  unregister: (id: string) => void;
  indexOf: (id: string) => number;
}

export const TimelineContext = React.createContext<TimelineContextValue | null>(
  null,
);

export interface TimelineItemContextValue {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  side: TimelineSide;
  status: TimelineStatus;
  direction: TimelineDirection;
  density: TimelineDensity;
}

export const TimelineItemContext =
  React.createContext<TimelineItemContextValue | null>(null);
