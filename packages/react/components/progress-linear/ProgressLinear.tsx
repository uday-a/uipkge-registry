import * as React from "react";
import { cn } from "@/lib/utils";
import {
  progressLinearVariants,
  type ProgressLinearVariants,
} from "./progress-linear.variants";

export interface ProgressLinearProps {
  className?: string;
  value?: number;
  bgColor?: string;
  buffer?: number;
  color?: string;
  height?: number | string;
  indeterminate?: boolean;
  reverse?: boolean;
  rounded?: ProgressLinearVariants["rounded"];
  stream?: boolean;
  striped?: boolean;
  active?: boolean;
}

// Keyframes are scoped in the Vue SFC via <style scoped>; React has no
// scoped styles, so we inline the same keyframes + animation utilities once.
// The class names (animate-indeterminate*, animate-stream) are referenced
// from the markup below and match the Vue source 1:1.
const styles = `
@media (prefers-reduced-motion: no-preference) {
  .uipkge-pl .animate-indeterminate {
    animation: uipkge-pl-indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .uipkge-pl .animate-indeterminate1 {
    animation: uipkge-pl-indeterminate1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .uipkge-pl .animate-indeterminate2 {
    animation: uipkge-pl-indeterminate2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .uipkge-pl .animate-stream {
    animation: uipkge-pl-stream 1s linear infinite;
  }
}
@keyframes uipkge-pl-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes uipkge-pl-indeterminate1 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes uipkge-pl-indeterminate2 {
  0% { transform: translateX(-100%); opacity: 1; }
  100% { transform: translateX(400%); opacity: 0; }
}
@keyframes uipkge-pl-stream {
  0% { transform: translateX(0); }
  100% { transform: translateX(40px); }
}
`;

function ProgressLinear({
  className,
  value = 0,
  bgColor,
  buffer,
  color,
  height,
  indeterminate = false,
  reverse = false,
  rounded,
  stream = false,
  striped = false,
  active = true,
}: ProgressLinearProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const normalizedBuffer = Math.min(100, Math.max(0, buffer || 0));

  const heightValue =
    typeof height === "number"
      ? `${height}px`
      : typeof height === "string"
        ? height
        : "4px";

  const bgColorValue = bgColor || "currentColor";
  const progressColorValue = color || "currentColor";

  const containerClasses = cn(
    "uipkge-pl",
    progressLinearVariants({ rounded }),
    className,
  );

  return (
    <div
      data-uipkge=""
      data-slot="progress-linear"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : normalizedValue}
      className={containerClasses}
      style={{ height: heightValue }}
    >
      <style>{styles}</style>

      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-300",
          striped
            ? "bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]"
            : "",
          !indeterminate && normalizedBuffer > 0 ? "opacity-30" : "opacity-100",
        )}
        style={{
          backgroundColor: bgColorValue,
          width: normalizedBuffer > 0 ? `${normalizedBuffer}%` : "100%",
        }}
      />

      {/* Buffer (if buffer > 0) */}
      {!indeterminate && normalizedBuffer > 0 && normalizedBuffer < 100 && (
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            reverse ? "right-0 left-auto" : "right-auto left-0",
            striped
              ? "bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.15)_8px,rgba(255,255,255,0.15)_16px)]"
              : "",
          )}
          style={{
            backgroundColor: bgColorValue,
            width: `${normalizedBuffer}%`,
            opacity: 0.3,
          }}
        />
      )}

      {/* Stream lines (when stream is true) */}
      {stream && !indeterminate && active && (
        <div
          className={cn(
            "absolute inset-0 overflow-hidden",
            reverse ? "right-0 left-auto" : "right-auto left-0",
          )}
        >
          <div
            className="animate-stream absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)] bg-[length:40px_40px]"
            style={{ width: `${normalizedBuffer || 100}%` }}
          />
        </div>
      )}

      {/* Progress bar */}
      <div
        className={cn(
          "absolute inset-y-0 transition-colors duration-300",
          reverse ? "right-0 left-auto" : "right-auto left-0",
          indeterminate ? "motion-safe:animate-indeterminate" : "",
          striped && !indeterminate
            ? "bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.25)_8px,rgba(255,255,255,0.25)_16px)]"
            : "",
        )}
        style={{
          width: indeterminate ? "100%" : `${normalizedValue}%`,
          backgroundColor: indeterminate ? undefined : progressColorValue,
        }}
      >
        {/* Indeterminate animations */}
        {indeterminate && (
          <>
            <div
              className="motion-safe:animate-indeterminate1 absolute inset-y-0 w-full bg-inherit"
              style={{ backgroundColor: progressColorValue }}
            />
            <div
              className="motion-safe:animate-indeterminate2 absolute inset-y-0 w-full bg-inherit"
              style={{ backgroundColor: progressColorValue }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export { ProgressLinear };
