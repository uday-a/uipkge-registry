"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Clamp so out-of-range value cannot push the indicator past the track.
  const clamped = Math.min(100, Math.max(0, value ?? 0));
  // A progressbar needs an accessible name; fall back to a generic one so the
  // control is never announced as unlabelled when a caller forgets to name it.
  const labelled =
    props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-uipkge=""
      data-slot="progress"
      aria-label={labelled ? undefined : "Progress"}
      value={clamped}
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-uipkge=""
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = "Progress";

export { Progress };
