import * as React from "react";
import { cn } from "@/lib/utils";
import { circularProgressVariants } from "./circular-progress.variants";

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value 0-100. Ignored when indeterminate is true. */
  value?: number;
  /** Diameter in pixels. */
  size?: "sm" | "default" | "lg" | number;
  /** Stroke thickness in pixels. */
  thickness?: number;
  /** Progress arc color. Defaults to primary. */
  color?: string;
  /** Track (background ring) color. */
  trackColor?: string;
  /** Indeterminate spinning mode. */
  indeterminate?: boolean;
  /** Show the numeric value in the center. */
  showValue?: boolean;
  /** Suffix appended to the value (e.g. '%'). */
  suffix?: string;
  /** Accessible label. */
  ariaLabel?: string;
}

const sizePxMap = {
  sm: 40,
  default: 56,
  lg: 80,
} as const;

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      className,
      value = 0,
      size = "default",
      thickness = 8,
      color,
      trackColor,
      indeterminate = false,
      showValue = false,
      suffix = "%",
      ariaLabel = "Progress",
      children,
      ...props
    },
    ref,
  ) => {
    const sizePx = React.useMemo(() => {
      if (typeof size === "number") return size;
      return sizePxMap[size] ?? 56;
    }, [size]);

    const normalizedValue = React.useMemo(
      () => Math.min(100, Math.max(0, value)),
      [value],
    );
    const isComplete = !indeterminate && normalizedValue >= 100;

    /** One-shot pulse only when value crosses into complete — not on static 100 mounts. */
    const [pulseComplete, setPulseComplete] = React.useState(false);
    const prevValueRef = React.useRef<number | undefined>(undefined);

    React.useEffect(() => {
      if (indeterminate || normalizedValue < 100) {
        setPulseComplete(false);
        prevValueRef.current = normalizedValue;
        return;
      }

      const prev = prevValueRef.current;
      prevValueRef.current = normalizedValue;

      if (prev === undefined) return;
      if (normalizedValue >= 100 && prev < 100) {
        setPulseComplete(false);
        const raf = requestAnimationFrame(() => {
          setPulseComplete(true);
        });
        const timer = window.setTimeout(() => setPulseComplete(false), 600);
        return () => {
          cancelAnimationFrame(raf);
          window.clearTimeout(timer);
        };
      }
    }, [indeterminate, normalizedValue]);

    const radius = React.useMemo(
      () => (sizePx - thickness) / 2,
      [sizePx, thickness],
    );
    const circumference = React.useMemo(() => 2 * Math.PI * radius, [radius]);
    const strokeDashoffset = React.useMemo(() => {
      if (indeterminate) return circumference * 0.25;
      return circumference * (1 - normalizedValue / 100);
    }, [indeterminate, circumference, normalizedValue]);

    const resolvedColor = React.useMemo(
      () => color || "var(--primary)",
      [color],
    );
    const resolvedTrackColor = React.useMemo(
      () => trackColor || "var(--muted)",
      [trackColor],
    );

    const viewBox = React.useMemo(() => `0 0 ${sizePx} ${sizePx}`, [sizePx]);
    const center = React.useMemo(() => sizePx / 2, [sizePx]);

    const fontSize = React.useMemo(() => {
      const s = sizePx;
      if (s <= 40) return "text-xs";
      if (s <= 56) return "text-sm";
      return "text-base";
    }, [sizePx]);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="circular-progress"
        data-size={typeof size === "string" ? size : "custom"}
        data-indeterminate={indeterminate ? "true" : "false"}
        data-complete={isComplete ? "true" : "false"}
        className={cn(circularProgressVariants(), className)}
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : normalizedValue}
        aria-busy={indeterminate ? true : undefined}
        aria-label={ariaLabel}
        {...props}
      >
        <style>{`
@media (prefers-reduced-motion: no-preference) {
  .animate-spin-circular {
    animation: spin-circular 1.4s linear infinite;
  }

  /* Soft acknowledge when the arc lands on 100 — one shot per enter. */
  .animate-circular-complete {
    animation: circular-progress-complete 0.55s ease-out 1;
  }
}

@keyframes spin-circular {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes circular-progress-complete {
  0%,
  100% {
    opacity: 1;
  }
  45% {
    opacity: 0.72;
  }
}
`}</style>
        <svg width={sizePx} height={sizePx} viewBox={viewBox} className="block">
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={resolvedTrackColor}
            strokeWidth={thickness}
          />
          {/* Progress arc */}
          <g
            transform={
              indeterminate ? undefined : `rotate(-90 ${center} ${center})`
            }
            className={indeterminate ? "animate-spin-circular" : ""}
            style={
              indeterminate
                ? { transformBox: "fill-box", transformOrigin: "center" }
                : undefined
            }
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={resolvedColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn(
                !indeterminate &&
                  "transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none",
                pulseComplete && "animate-circular-complete",
              )}
            />
          </g>
        </svg>

        {showValue || children ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {children ? (
              children
            ) : (
              <span
                className={cn(
                  "text-foreground font-medium tabular-nums",
                  fontSize,
                )}
              >
                {Math.round(normalizedValue)}
                {suffix}
              </span>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
