"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NativeSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: (NativeSelectOption | string)[];
  sizeVariant?: "sm" | "md" | "lg";
  selectClassName?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "h-8 text-xs pl-2.5 pr-8",
  md: "h-9 text-sm pl-3 pr-9",
  lg: "h-11 text-base pl-4 pr-10",
};

const iconSizes: Record<string, string> = {
  sm: "size-3.5 right-2.5",
  md: "size-4 right-3",
  lg: "size-5 right-3.5",
};

export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(
  (
    {
      className,
      selectClassName,
      options,
      sizeVariant = "md",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        data-uipkge=""
        data-slot="native-select-wrapper"
        className={cn("relative inline-flex w-full items-center", className)}
      >
        <select
          ref={ref}
          data-slot="native-select"
          disabled={disabled}
          className={cn(
            "border-input bg-background w-full appearance-none rounded-md border shadow-xs transition-[color,box-shadow]",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
            "disabled:bg-muted/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[sizeVariant],
            selectClassName,
          )}
          {...props}
        >
          {options && options.length > 0
            ? options.map((opt) => {
                const isString = typeof opt === "string";
                const value = isString ? opt : opt.value;
                const label = isString ? opt : opt.label;
                const isDisabled = !isString && opt.disabled;
                return (
                  <option
                    key={String(value)}
                    value={value}
                    disabled={isDisabled}
                  >
                    {label}
                  </option>
                );
              })
            : children}
        </select>
        <ChevronDown
          data-slot="native-select-icon"
          aria-hidden="true"
          className={cn(
            "text-muted-foreground pointer-events-none absolute transition-opacity",
            disabled && "opacity-50",
            iconSizes[sizeVariant],
          )}
        />
      </div>
    );
  },
);

NativeSelect.displayName = "NativeSelect";
