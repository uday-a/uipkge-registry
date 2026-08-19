"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "checked" | "defaultChecked"
> {
  /** The controlled checked state of the checkbox. */
  checked?: boolean | "indeterminate";
  /** The default checked state when uncontrolled. */
  defaultChecked?: boolean | "indeterminate";
  /** The value given as data when submitted with a name. */
  value?: string;
  /** Id of the element */
  id?: string;
  /** Size of the checkbox */
  size?: "sm" | "md" | "lg";
  /** Custom color for the checked state - matches Vuetify color system */
  color?:
    "primary" | "secondary" | "success" | "warning" | "error" | "info" | string;
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Hint text shown below the checkbox */
  hint?: string;
  /** Error message to display */
  errorMessages?: string | string[];
  /** Whether to show error state */
  error?: boolean;
  /** When `true`, prevents the user from interacting with the checkbox */
  disabled?: boolean;
  /** When `true`, shows an indeterminate state */
  indeterminate?: boolean;
  /** Density of the checkbox - affects spacing */
  density?: "compact" | "default" | "comfortable";
  /** When `true`, the icon is hidden */
  hideIcon?: boolean;
  /** Loading state - shows a spinner */
  loading?: boolean;
  /** Label position - before or after the checkbox */
  labelPosition?: "before" | "after";
  /** Whether the checkbox appears flat (no elevation) */
  flat?: boolean;
  /** Inline text style */
  inline?: boolean;
  /** Name attribute for form submission */
  name?: string;
}

// Size classes
const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const iconSizes = {
  sm: "size-2.5",
  md: "size-3.5",
  lg: "size-4",
};

// Color classes for checked state
const colorClasses: Record<string, string> = {
  primary:
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary",
  secondary:
    "data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary",
  success:
    "data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success",
  warning:
    "data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning",
  error:
    "data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:border-destructive",
  info: "data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info",
};

// Density classes
const densityClasses = {
  compact: "gap-1",
  default: "gap-2",
  comfortable: "gap-3",
};

// Ported 1:1 from the Vue stylesheet. React has no SFC styles, so inject once.
const STYLE_ID = "checkbox-motion-styles";
const STYLE_CONTENT = `
@keyframes checkbox-check-in {
  0% { opacity: 0; transform: scale(0.55); }
  70% { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}
[data-slot='checkbox-indicator'] .checkbox-indicator-icon {
  animation: checkbox-check-in 200ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='checkbox-indicator'] .checkbox-indicator-icon {
    animation: none !important;
  }
}
`;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      checked,
      defaultChecked,
      value,
      id,
      size = "md",
      color = "primary",
      label,
      hint,
      errorMessages,
      error,
      disabled,
      indeterminate,
      density = "default",
      hideIcon = false,
      loading,
      labelPosition = "after",
      flat = false,
      inline = false,
      name,
      children,
      ...props
    },
    ref,
  ) => {
    React.useLayoutEffect(() => {
      if (typeof document === "undefined") return;
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = STYLE_ID;
        document.head.appendChild(el);
      }
      if (el.textContent !== STYLE_CONTENT) el.textContent = STYLE_CONTENT;
    }, []);

    const autoId = React.useId();
    // When `label` is provided without an explicit `id`, generate one so the
    // associated <label htmlFor> actually toggles the control.
    const resolvedId = id ?? (label ? autoId : undefined);

    const hasError =
      Boolean(error) ||
      Boolean(
        errorMessages &&
        (typeof errorMessages === "string"
          ? errorMessages
          : errorMessages.length > 0),
      );

    // Determine if the checkbox is in an indeterminate state
    const isIndeterminate =
      Boolean(indeterminate) || checked === "indeterminate";

    const resolvedChecked: boolean | "indeterminate" | undefined =
      isIndeterminate ? "indeterminate" : checked;

    const checkboxClasses = cn(
      "peer border-input data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      sizeClasses[size],
      colorClasses[color] || colorClasses.primary,
      hasError &&
        "border-destructive data-[state=checked]:!bg-destructive data-[state=checked]:!border-destructive data-[state=indeterminate]:!bg-destructive data-[state=indeterminate]:!border-destructive",
      flat && "shadow-none",
      className,
    );

    const labelClasses = cn(
      "cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      hasError ? "text-destructive" : "",
      disabled && "cursor-not-allowed opacity-50",
    );

    return (
      <div
        className={cn(
          "flex items-start",
          densityClasses[density],
          inline ? "inline-flex" : "flex-col",
        )}
      >
        {label && labelPosition === "before" && (
          <label htmlFor={resolvedId} className={cn("mr-2", labelClasses)}>
            {label}
          </label>
        )}

        <div className="flex items-center">
          <CheckboxPrimitive.Root
            ref={ref}
            data-slot="checkbox"
            id={resolvedId}
            value={value}
            name={name}
            disabled={disabled}
            checked={resolvedChecked}
            defaultChecked={defaultChecked}
            aria-invalid={hasError || undefined}
            className={checkboxClasses}
            {...props}
          >
            <CheckboxPrimitive.Indicator
              data-uipkge=""
              data-slot="checkbox-indicator"
              forceMount={isIndeterminate || hideIcon ? true : undefined}
              className="grid place-content-center text-current transition-none"
            >
              {children ?? (
                <>
                  {loading ? (
                    <Loader2 className={cn(iconSizes[size], "animate-spin")} />
                  ) : isIndeterminate ? (
                    <Minus
                      className={cn(iconSizes[size], "checkbox-indicator-icon")}
                    />
                  ) : !hideIcon ? (
                    <Check
                      className={cn(iconSizes[size], "checkbox-indicator-icon")}
                    />
                  ) : null}
                </>
              )}
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {label && labelPosition === "after" && (
            <label htmlFor={resolvedId} className={cn("ml-2", labelClasses)}>
              {label}
            </label>
          )}
        </div>

        {hint && !hasError && (
          <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        )}

        {hasError && (
          <div className="mt-1 flex flex-col gap-0.5">
            {typeof errorMessages === "string" ? (
              <p className="text-destructive text-xs">{errorMessages}</p>
            ) : (
              errorMessages?.map((msg, i) => (
                <p key={i} className="text-destructive text-xs">
                  {msg}
                </p>
              ))
            )}
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> {
  /** The value of the checkbox items that should be checked when initially rendered. */
  defaultValue?: string[];
  /** The controlled value of checked items. */
  value?: string[];
  /** Called when the checked items change. */
  onValueChange?: (value: string[]) => void;
  /** When `true`, prevents the user from interacting with the checkboxes. */
  disabled?: boolean;
  /** Specifies whether the checkbox group is in an error state */
  error?: boolean;
  /** Error messages to display */
  errorMessages?: string | string[];
  /** Label for the group */
  label?: string;
  /** Hint text for the group */
  hint?: string;
  /** The orientation of the checkboxes */
  orientation?: "horizontal" | "vertical";
  /** Whether to show a border around the group */
  bordered?: boolean;
  /** Density of the checkboxes */
  density?: "compact" | "default" | "comfortable";
  /** Options to render as checkboxes automatically */
  options?: (string | CheckboxOption)[];
  /** Name attribute for all checkboxes in the group */
  name?: string;
  /** Inline layout (alias for horizontal) */
  inline?: boolean;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      defaultValue,
      value,
      onValueChange,
      disabled,
      error,
      errorMessages,
      label,
      hint,
      orientation = "vertical",
      bordered = false,
      density = "default",
      options,
      name,
      inline,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(
      defaultValue ?? [],
    );
    const isControlled = value !== undefined;
    const selected = isControlled ? value : internalValue;

    const setSelected = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const toggle = React.useCallback(
      (optionValue: string, checked: boolean | "indeterminate") => {
        const isChecked = checked === true;
        const next = isChecked
          ? [...selected, optionValue]
          : selected.filter((v) => v !== optionValue);
        setSelected(next);
      },
      [selected, setSelected],
    );

    const actualOrientation = inline ? "horizontal" : orientation;

    return (
      <div
        ref={ref}
        data-slot="checkbox-group"
        role="group"
        data-orientation={actualOrientation}
        className={cn(
          "flex flex-col gap-2",
          actualOrientation === "horizontal"
            ? "flex-row items-center"
            : "flex-col",
          bordered && "rounded-lg border p-4",
          className,
        )}
        {...props}
      >
        {label && <label className="text-sm font-medium">{label}</label>}

        {hint && !error && (
          <p className="text-muted-foreground text-xs">{hint}</p>
        )}

        <div
          className={cn(
            "flex gap-4",
            actualOrientation === "horizontal"
              ? "flex-row flex-wrap items-center"
              : "flex-col",
          )}
        >
          {options && options.length > 0
            ? options.map((option, i) => {
                const optValue =
                  typeof option === "string" ? option : option.value;
                const optLabel =
                  typeof option === "string" ? option : option.label;
                const optDisabled =
                  typeof option === "string" ? undefined : option.disabled;
                return (
                  <Checkbox
                    key={i}
                    value={optValue}
                    label={optLabel}
                    disabled={disabled || optDisabled}
                    name={name}
                    density={density}
                    checked={selected.includes(optValue)}
                    onCheckedChange={(checked) => toggle(optValue, checked)}
                  />
                );
              })
            : children}
        </div>

        {(error || errorMessages) && (
          <div className="flex flex-col gap-0.5">
            {typeof errorMessages === "string" ? (
              <p className="text-destructive text-xs">{errorMessages}</p>
            ) : (
              errorMessages?.map((msg, i) => (
                <p key={i} className="text-destructive text-xs">
                  {msg}
                </p>
              ))
            )}
          </div>
        )}
      </div>
    );
  },
);
CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
