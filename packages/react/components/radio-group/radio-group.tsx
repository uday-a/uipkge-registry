"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type RadioOption =
  string | { label: string; value: string; disabled?: boolean };

// Make group-level config (disabled / size / optionType / buttonVariant /
// orientation) reachable from items without manual prop drilling — the React
// equivalent of the Vue provide('radioGroup').
type RadioGroupContextValue = {
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  optionType?: "default" | "button";
  buttonVariant?: "outline" | "solid";
  orientation?: "horizontal" | "vertical";
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

function normalizeOption(option: RadioOption): {
  label: string;
  value: string;
  disabled?: boolean;
} {
  if (typeof option === "string") {
    return { label: option, value: option };
  }
  return option;
}

export interface RadioGroupProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "defaultValue" | "dir"
> {
  /** The controlled value of the radio items to check. */
  value?: string;
  /** The value of the radio items that should be checked when initially rendered. */
  defaultValue?: string;
  /** When `true`, prevents the user from interacting with the radio group */
  disabled?: boolean;
  /** The orientation of the radio items */
  orientation?: "horizontal" | "vertical";
  /** When `true`, keyboard navigation will loop from last item to first, and vice versa */
  loop?: boolean;
  /** Label for the radio group */
  label?: string;
  /** Hint text for the radio group */
  hint?: string;
  /** Error messages to display */
  errorMessages?: string | string[];
  /** Whether to show error state */
  error?: boolean;
  /** Density of the radio items */
  density?: "compact" | "default" | "comfortable";
  /** Whether the radio group appears flat */
  flat?: boolean;
  /** Whether to show a border around the group */
  bordered?: boolean;
  /** The reading direction */
  dir?: "ltr" | "rtl";
  /** Array of options to render automatically */
  options?: RadioOption[];
  /** Size of button-style radios */
  size?: "small" | "middle" | "large";
  /** Type of options to render */
  optionType?: "default" | "button";
  /** Visual variant for button-style radios */
  buttonVariant?: "outline" | "solid";
}

// Density classes
const groupDensityClasses = {
  compact: "gap-1",
  default: "gap-3",
  comfortable: "gap-4",
};

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      value,
      defaultValue,
      disabled = false,
      orientation = "vertical",
      loop = true,
      label,
      hint,
      errorMessages,
      error,
      density = "default",
      flat = false,
      bordered = false,
      dir,
      options,
      size = "middle",
      optionType = "default",
      buttonVariant = "outline",
      children,
      ...props
    },
    ref,
  ) => {
    const hasError =
      Boolean(error) ||
      Boolean(
        errorMessages &&
        (typeof errorMessages === "string"
          ? errorMessages
          : errorMessages.length > 0),
      );

    return (
      <RadioGroupContext.Provider
        value={{ disabled, size, optionType, buttonVariant, orientation }}
      >
        {/*
          `className` is forwarded ONLY to RadioGroupRoot below (per shadcn
          convention). Applying it on the outer wrapper as well caused grid-*
          utilities to fight the wrapper's `flex flex-col`, so consumers had
          to fall back to column-count hacks. Forwarding to one element keeps
          layout intent unambiguous.
        */}
        <div className="flex flex-col gap-2">
          {label && <label className="text-sm font-medium">{label}</label>}

          {hint && !hasError && (
            <p className="text-muted-foreground text-xs">{hint}</p>
          )}

          <RadioGroupPrimitive.Root
            ref={ref}
            data-slot="radio-group"
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            orientation={orientation}
            loop={loop}
            dir={dir}
            className={cn(
              "grid gap-3",
              orientation === "horizontal" &&
                "flex flex-row items-center gap-4",
              optionType === "button" &&
                orientation === "horizontal" &&
                "flex flex-row items-stretch gap-0",
              optionType === "button" &&
                orientation === "vertical" &&
                "flex flex-col items-stretch gap-0",
              optionType !== "button" && groupDensityClasses[density],
              bordered && "rounded-lg border p-4",
              className,
            )}
            {...props}
          >
            {options && options.length > 0
              ? optionType === "button"
                ? options.map((option) => {
                    const opt = normalizeOption(option);
                    return (
                      <RadioButton
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        label={opt.label}
                      />
                    );
                  })
                : options.map((option) => {
                    const opt = normalizeOption(option);
                    return (
                      <div key={opt.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          id={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                        />
                        <label
                          htmlFor={opt.value}
                          className={cn(
                            "cursor-pointer text-sm font-medium select-none",
                            opt.disabled && "cursor-not-allowed opacity-50",
                          )}
                        >
                          {opt.label}
                        </label>
                      </div>
                    );
                  })
              : children}
          </RadioGroupPrimitive.Root>

          {hasError && (
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
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "children"
> {
  /** Size of the radio item */
  size?: "sm" | "md" | "lg";
  /** Custom color for the checked state */
  color?:
    "primary" | "secondary" | "success" | "warning" | "error" | "info" | string;
  /** Label text displayed next to the radio item */
  label?: string;
  /** Hint text shown below the radio item */
  hint?: string;
  /** Error message to display */
  errorMessages?: string | string[];
  /** Whether to show error state */
  error?: boolean;
  /** Density of the radio item */
  density?: "compact" | "default" | "comfortable";
  /** Label position - before or after the radio */
  labelPosition?: "before" | "after";
  /** Loading state */
  loading?: boolean;
  /** Hide the indicator icon */
  hideIcon?: boolean;
  children?: React.ReactNode;
}

// Size classes
const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const indicatorSizes = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

// Color classes
const colorClasses: Record<string, string> = {
  primary: "data-[state=checked]:border-primary",
  secondary: "data-[state=checked]:border-secondary",
  success:
    "data-[state=checked]:border-success data-[state=checked]:text-success",
  warning:
    "data-[state=checked]:border-warning data-[state=checked]:text-warning",
  error:
    "data-[state=checked]:border-destructive data-[state=checked]:text-destructive",
  info: "data-[state=checked]:border-info data-[state=checked]:text-info",
};

// Density classes
const itemDensityClasses = {
  compact: "gap-1",
  default: "gap-2",
  comfortable: "gap-3",
};

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    {
      className,
      id,
      value,
      disabled,
      size = "md",
      color = "primary",
      label,
      hint,
      errorMessages,
      error,
      density = "default",
      labelPosition = "after",
      loading,
      hideIcon = false,
      children,
      ...props
    },
    ref,
  ) => {
    const groupContext = React.useContext(RadioGroupContext);
    const effectiveDisabled =
      Boolean(loading) || Boolean(disabled ?? groupContext.disabled ?? false);

    const hasError =
      Boolean(error) ||
      Boolean(
        errorMessages &&
        (typeof errorMessages === "string"
          ? errorMessages
          : errorMessages.length > 0),
      );

    const labelClasses = cn(
      "cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      hasError ? "text-destructive" : "",
      effectiveDisabled && "cursor-not-allowed opacity-50",
    );

    return (
      <div className={cn("flex flex-col", itemDensityClasses[density])}>
        <div className="flex items-center">
          {label && labelPosition === "before" && (
            <label htmlFor={id} className={cn("mr-2", labelClasses)}>
              {label}
            </label>
          )}

          <RadioGroupPrimitive.Item
            ref={ref}
            id={id}
            data-uipkge=""
            data-slot="radio-group-item"
            value={value!}
            disabled={effectiveDisabled}
            aria-busy={loading || undefined}
            aria-invalid={hasError || undefined}
            className={cn(
              "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square shrink-0 rounded-full border shadow-sm transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              colorClasses[color] || colorClasses.primary,
              hasError && "border-destructive",
              loading && "opacity-50",
              className,
            )}
            {...props}
          >
            <RadioGroupPrimitive.Indicator
              data-uipkge=""
              data-slot="radio-group-indicator"
              className="relative flex items-center justify-center"
            >
              {children ??
                (!hideIcon ? (
                  <Circle
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current text-current",
                      indicatorSizes[size],
                    )}
                  />
                ) : null)}
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>

          {label && labelPosition === "after" && (
            <label htmlFor={id} className={cn("ml-2", labelClasses)}>
              {label}
            </label>
          )}
        </div>

        {hint && !hasError && (
          <p className="text-muted-foreground ml-6 text-xs">{hint}</p>
        )}

        {hasError && (
          <div className="ml-6 flex flex-col gap-0.5">
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
RadioGroupItem.displayName = "RadioGroupItem";

export interface RadioButtonProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "children"
> {
  /** Size of the button radio */
  size?: "small" | "middle" | "large";
  /** Visual variant */
  variant?: "outline" | "solid";
  /** Label text */
  label?: string;
  children?: React.ReactNode;
}

const buttonSizeClasses = {
  small: "h-7 px-2.5 text-xs",
  middle: "h-8 px-4 text-sm",
  large: "h-10 px-4.5 text-base",
};

const buttonVariantClasses = {
  outline: cn(
    "border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50",
    "data-[state=checked]:border-primary data-[state=checked]:text-primary",
    "disabled:hover:bg-transparent",
  ),
  solid: cn(
    "border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50",
    "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    "disabled:hover:bg-transparent",
  ),
};

const RadioButton = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioButtonProps
>(
  (
    { className, value, disabled, size, variant, label, children, ...props },
    ref,
  ) => {
    const context = React.useContext(RadioGroupContext);
    const effectiveSize = size ?? context.size ?? "middle";
    const effectiveVariant = variant ?? context.buttonVariant ?? "outline";
    const effectiveDisabled = disabled ?? context.disabled ?? false;

    const groupClasses =
      context.orientation === "vertical"
        ? "rounded-md w-full justify-start"
        : cn(
            "rounded-none first:rounded-l-md last:rounded-r-md",
            "border-l-0 first:border-l",
            "-ml-px first:ml-0",
          );

    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        data-uipkge=""
        data-slot="radio-button"
        value={value!}
        disabled={effectiveDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-200",
          "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          buttonSizeClasses[effectiveSize],
          buttonVariantClasses[effectiveVariant],
          groupClasses,
          className,
        )}
        {...props}
      >
        {children ?? label ?? value}
      </RadioGroupPrimitive.Item>
    );
  },
);
RadioButton.displayName = "RadioButton";

export { RadioGroup, RadioGroupItem, RadioButton };
