"use client";

import * as React from "react";
import { Check, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { stepperIndicatorVariants } from "./stepper.variants";
import {
  StepperContext,
  useStepperContext,
  type StepperOrientation,
  type StepperSize,
  type StepperStatus,
} from "./context";
// Aliased: the standalone <StepperStep> component (below) owns the bare name.
import type { StepperStep as StepperStepConfig } from "./types";

/* ------------------------------------------------------------------ */
/* Motion styles (injected once; mirrors Vue <style> blocks)            */
/* ------------------------------------------------------------------ */

const STEPPER_STYLE_ID = "stepper-motion-styles";
const STEPPER_STYLE_CONTENT = `
@keyframes stepper-indicator-pop {
  0% { transform: scale(0.92); }
  55% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes stepper-indicator-fill {
  0% { transform: scale(0.92); }
  55% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes stepper-indicator-error {
  0% { transform: scale(0.92); }
  55% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes stepper-icon-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
/* Distinct names so active→completed restarts the pop. */
[data-slot='stepper-indicator'][data-status='active'] {
  animation: stepper-indicator-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
[data-slot='stepper-indicator'][data-status='completed'] {
  animation: stepper-indicator-fill 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
[data-slot='stepper-indicator'][data-status='error'] {
  animation: stepper-indicator-error 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
[data-slot='stepper-indicator'][data-status='completed'] [data-slot='stepper-indicator-icon'],
[data-slot='stepper-indicator'][data-status='error'] [data-slot='stepper-indicator-icon'],
[data-slot='stepper-indicator'][data-status='active'] [data-slot='stepper-indicator-icon'] {
  animation: stepper-icon-in 220ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
[data-slot='stepper-connector-fill'] {
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-slot='stepper-connector-fill'][data-orientation='horizontal'] {
  transform-origin: left center;
  transform: scaleX(0);
}
[data-slot='stepper-connector-fill'][data-orientation='horizontal'][data-completed='true'] {
  transform: scaleX(1);
}
[data-slot='stepper-connector-fill'][data-orientation='vertical'] {
  transform-origin: center top;
  transform: scaleY(0);
}
[data-slot='stepper-connector-fill'][data-orientation='vertical'][data-completed='true'] {
  transform: scaleY(1);
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='stepper-indicator'],
  [data-slot='stepper-indicator'] [data-slot='stepper-indicator-icon'],
  [data-slot='stepper-indicator'] [data-slot='stepper-indicator-label'],
  [data-slot='stepper-connector-fill'] {
    animation: none !important;
    transition: none !important;
  }
}
`;

function ensureStepperStyles() {
  if (typeof document === "undefined") return;
  let el = document.getElementById(STEPPER_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STEPPER_STYLE_ID;
    document.head.appendChild(el);
  }
  if (el.textContent !== STEPPER_STYLE_CONTENT)
    el.textContent = STEPPER_STYLE_CONTENT;
}

/* ------------------------------------------------------------------ */
/* Stepper (root)                                                      */
/* ------------------------------------------------------------------ */

export interface StepperProps {
  steps?: StepperStepConfig[];
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
  size?: StepperSize;
  className?: string;
  /** Custom header strip. Falls back to the auto-rendered `<ol>` of items. */
  stepsSlot?: React.ReactNode;
  /** Content area. Receives the active step + steps for convenience. */
  children?:
    | React.ReactNode
    | ((args: {
        activeStep: number;
        steps: StepperStepConfig[];
      }) => React.ReactNode);
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps = [],
      value = 1,
      onValueChange,
      orientation = "horizontal",
      size = "default",
      className,
      stepsSlot,
      children,
    },
    ref,
  ) => {
    React.useLayoutEffect(() => {
      ensureStepperStyles();
    }, []);

    const activeStep = value;

    const getStatus = React.useCallback(
      (index: number): StepperStatus => {
        const step = steps[index];
        if (step?.error) return "error";
        if (index + 1 === activeStep) return "active";
        if (index + 1 < activeStep) return "completed";
        return "pending";
      },
      [steps, activeStep],
    );

    const isClickable = React.useCallback(
      (index: number): boolean => index + 1 < activeStep,
      [activeStep],
    );

    const goToStep = React.useCallback(
      (stepIndex: number) => {
        if (stepIndex < 1 || stepIndex > steps.length) return;
        const step = steps[stepIndex - 1];
        if (step?.disabled) return;
        onValueChange?.(stepIndex);
      },
      [steps, onValueChange],
    );

    const ctx = React.useMemo(
      () => ({
        orientation,
        size,
        activeStep,
        steps,
        goToStep,
        isClickable,
        getStatus,
      }),
      [orientation, size, activeStep, steps, goToStep, isClickable, getStatus],
    );

    return (
      <StepperContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn("w-full", className)}
          role="tablist"
          aria-orientation={orientation}
          data-orientation={orientation}
        >
          {/* Header strip with steps */}
          {stepsSlot ??
            (steps.length > 0 && (
              <ol
                className={cn(
                  "flex",
                  orientation === "horizontal"
                    ? "flex-row items-start"
                    : "flex-col items-stretch",
                )}
              >
                {steps.map((step, index) => (
                  <StepperItem key={step.id} step={step} index={index} />
                ))}
              </ol>
            ))}

          {/* Content area */}
          {children != null && (
            <div className="mt-6 flex-1">
              {typeof children === "function"
                ? children({ activeStep, steps })
                : children}
            </div>
          )}
        </div>
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

/* ------------------------------------------------------------------ */
/* StepperIndicator                                                    */
/* ------------------------------------------------------------------ */

export interface StepperIndicatorProps {
  status?: StepperStatus;
  size?: StepperSize;
  index?: number;
  icon?: LucideIcon;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const StepperIndicator = React.forwardRef<
  HTMLButtonElement,
  StepperIndicatorProps
>(
  (
    {
      status = "pending",
      size = "default",
      index,
      icon: Icon,
      clickable = false,
      className,
      onClick,
      children,
    },
    ref,
  ) => {
    const FallbackIcon: LucideIcon | null =
      Icon ?? (status === "completed" ? Check : status === "error" ? X : null);

    return (
      <button
        ref={ref}
        type="button"
        data-slot="stepper-indicator"
        data-status={status}
        className={cn(
          stepperIndicatorVariants({ status, size }),
          "ring-background relative z-10 ring-4 transition-[color,background-color,box-shadow,transform] duration-200 outline-none",
          clickable &&
            "focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none",
          !clickable && "cursor-default",
          className,
        )}
        disabled={!clickable}
        aria-current={status === "active" ? "step" : undefined}
        onClick={onClick}
      >
        {children ??
          (FallbackIcon ? (
            <FallbackIcon
              className="size-4"
              data-slot="stepper-indicator-icon"
              aria-hidden="true"
            />
          ) : index !== undefined ? (
            <span className="font-medium" data-slot="stepper-indicator-label">
              {index}
            </span>
          ) : null)}
      </button>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

/* ------------------------------------------------------------------ */
/* StepperItem                                                         */
/* ------------------------------------------------------------------ */

export interface StepperItemProps {
  step: StepperStepConfig;
  index: number;
  className?: string;
}

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  ({ step, index, className }, ref) => {
    const ctx = useStepperContext();

    const status = ctx.getStatus(index);
    const orientation = ctx.orientation;
    const size = ctx.size;
    const isFirst = index === 0;
    const isLast = index === ctx.steps.length - 1;
    const clickable = ctx.isClickable(index) && !step.disabled;

    // Indicator row must match stepperIndicatorVariants sizes (sm 7 / default 9 / lg 11).
    // Full class strings so Tailwind's scanner keeps them.
    const indicatorAxisClass =
      orientation === "horizontal"
        ? (
            {
              sm: "h-7 w-full items-center justify-center",
              default: "h-9 w-full items-center justify-center",
              lg: "h-11 w-full items-center justify-center",
            } as const
          )[size]
        : (
            {
              sm: "w-7 flex-col items-center justify-start self-stretch",
              default: "w-9 flex-col items-center justify-start self-stretch",
              lg: "w-11 flex-col items-center justify-start self-stretch",
            } as const
          )[size];

    // A connector "segment" is the line drawn between this indicator and the
    // adjacent one. We split it into left/right halves so each item owns its
    // own piece — they butt up at item boundaries for pixel alignment.
    const leftSegmentCompleted = index < ctx.activeStep;
    const rightSegmentCompleted = index < ctx.activeStep - 1;

    function handleNavigate() {
      if (clickable) ctx.goToStep(index + 1);
    }

    return (
      <li
        ref={ref}
        data-slot="stepper-item"
        className={cn(
          "group/stepper-item relative min-w-0",
          orientation === "horizontal"
            ? "flex flex-1 flex-col items-center gap-2"
            : "flex flex-row items-start gap-3 pb-6 last:pb-0",
          step.disabled && "opacity-50",
          className,
        )}
        role="tab"
        aria-selected={status === "active"}
        aria-disabled={step.disabled || undefined}
        data-status={status}
      >
        {/* Indicator row: contains the indicator + connector segments */}
        <div className={cn("relative flex shrink-0", indicatorAxisClass)}>
          {/* Connector segments (absolute, butt up at item boundaries).
            Track is always border; fill scales in when the segment completes. */}
          {!isFirst && (
            <span
              aria-hidden="true"
              data-slot="stepper-connector"
              data-orientation={orientation}
              data-edge={orientation === "horizontal" ? "left" : "top"}
              className={cn(
                "bg-border pointer-events-none absolute overflow-hidden",
                orientation === "horizontal"
                  ? "top-1/2 right-1/2 left-0 h-px -translate-y-1/2"
                  : "top-0 bottom-1/2 left-1/2 w-px -translate-x-1/2",
              )}
            >
              <span
                data-slot="stepper-connector-fill"
                data-completed={leftSegmentCompleted ? "true" : "false"}
                data-orientation={orientation}
                className="bg-primary absolute inset-0"
              />
            </span>
          )}
          {!isLast && (
            <span
              aria-hidden="true"
              data-slot="stepper-connector"
              data-orientation={orientation}
              data-edge={orientation === "horizontal" ? "right" : "bottom"}
              className={cn(
                "bg-border pointer-events-none absolute overflow-hidden",
                orientation === "horizontal"
                  ? "top-1/2 right-0 left-1/2 h-px -translate-y-1/2"
                  : "top-1/2 bottom-0 left-1/2 w-px -translate-x-1/2",
              )}
            >
              <span
                data-slot="stepper-connector-fill"
                data-completed={rightSegmentCompleted ? "true" : "false"}
                data-orientation={orientation}
                className="bg-primary absolute inset-0"
              />
            </span>
          )}

          <StepperIndicator
            status={status}
            size={size}
            index={index + 1}
            icon={step.icon}
            clickable={clickable}
            className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
            onClick={handleNavigate}
          />
        </div>

        {/* Title + description */}
        <div
          data-slot="stepper-item-content"
          className={cn(
            "min-w-0",
            orientation === "horizontal"
              ? "max-w-[12rem] text-center"
              : "flex-1 pt-1.5",
          )}
        >
          <button
            type="button"
            className={cn(
              "text-foreground text-sm font-medium text-balance transition-colors duration-200 outline-none",
              clickable &&
                "hover:text-primary focus-visible:text-primary focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none",
              !clickable && "cursor-default",
              status === "pending" && "text-muted-foreground",
              status === "error" && "text-destructive",
            )}
            disabled={!clickable}
            onClick={handleNavigate}
          >
            {step.title}
          </button>
          {step.description && (
            <p className="text-muted-foreground mt-0.5 text-xs text-balance">
              {step.description}
            </p>
          )}
        </div>
      </li>
    );
  },
);
StepperItem.displayName = "StepperItem";

/* ------------------------------------------------------------------ */
/* StepperHeader                                                       */
/* ------------------------------------------------------------------ */

const StepperHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("stepper-header flex items-center gap-0", className)}
    {...props}
  />
));
StepperHeader.displayName = "StepperHeader";

/* ------------------------------------------------------------------ */
/* StepperContent                                                      */
/* ------------------------------------------------------------------ */

export interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  step?: number;
  activeStep?: number;
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ step = 1, activeStep = 1, className, children, ...props }, ref) => {
    const isActive = step === activeStep;
    return (
      <div
        ref={ref}
        data-slot="stepper-content"
        className={cn(
          "stepper-content motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out",
          className,
        )}
        style={!isActive ? { display: "none" } : undefined}
        role="tabpanel"
        aria-hidden={!isActive}
        {...props}
      >
        {children}
      </div>
    );
  },
);
StepperContent.displayName = "StepperContent";

/* ------------------------------------------------------------------ */
/* StepperTitle                                                        */
/* ------------------------------------------------------------------ */

const StepperTitle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-foreground text-sm font-medium", className)}
    {...props}
  />
));
StepperTitle.displayName = "StepperTitle";

/* ------------------------------------------------------------------ */
/* StepperDescription                                                  */
/* ------------------------------------------------------------------ */

const StepperDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-muted-foreground text-xs", className)}
    {...props}
  />
));
StepperDescription.displayName = "StepperDescription";

/* ------------------------------------------------------------------ */
/* StepperStep (standalone, slot-driven)                               */
/* ------------------------------------------------------------------ */

export interface StepperStepProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  completed?: boolean;
  active?: boolean;
  error?: boolean;
  disabled?: boolean;
  status?: "active" | "completed" | "pending" | "error";
  index?: number;
  className?: string;
  titleSlot?: React.ReactNode;
  descriptionSlot?: React.ReactNode;
  iconSlot?: React.ReactNode;
}

const StepperStep = React.forwardRef<HTMLDivElement, StepperStepProps>(
  (
    {
      title,
      description,
      completed = false,
      active = false,
      error = false,
      disabled = false,
      status,
      index,
      className,
      titleSlot,
      descriptionSlot,
      iconSlot,
    },
    ref,
  ) => {
    const computedStatus: StepperStatus = status
      ? status
      : error
        ? "error"
        : active
          ? "active"
          : completed
            ? "completed"
            : "pending";

    return (
      <div
        ref={ref}
        className={cn("stepper-step flex gap-3", className)}
        role="tab"
        aria-selected={active}
        aria-disabled={disabled}
      >
        {/* Indicator */}
        <div
          data-slot="stepper-indicator"
          data-status={computedStatus}
          className={cn(
            stepperIndicatorVariants({
              status: computedStatus,
              size: "default",
            }),
          )}
        >
          {iconSlot ??
            (computedStatus === "completed" ? (
              <Check
                className="size-4"
                data-slot="stepper-indicator-icon"
                aria-hidden="true"
              />
            ) : index ? (
              <span data-slot="stepper-indicator-label">{index}</span>
            ) : null)}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 pt-1">
          {titleSlot ?? <span className="text-sm font-medium">{title}</span>}
          {descriptionSlot ??
            (description && (
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            ))}
        </div>
      </div>
    );
  },
);
StepperStep.displayName = "StepperStep";

export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperHeader,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperStep,
};
