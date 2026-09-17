"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  passwordInputVariants,
  type PasswordInputVariants,
} from "./password-input.variants";

export interface PasswordInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    PasswordInputVariants {
  defaultValue?: string;
  showStrength?: boolean;
  showToggle?: boolean;
  minLength?: number;
  /** Wrapper className. Falls through to the bordered control, not the <input>. */
  className?: string;
}

interface StrengthResult {
  score: number;
  label: "weak" | "fair" | "good" | "strong";
  color: string;
  barColor: string;
  percent: number;
}

function computeStrength(pwd: string): StrengthResult {
  if (!pwd)
    return {
      score: 0,
      label: "weak",
      color: "",
      barColor: "bg-transparent",
      percent: 0,
    };

  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) {
    return {
      score,
      label: "weak",
      color: "text-destructive",
      barColor: "bg-destructive",
      percent: 25,
    };
  }
  if (score <= 2) {
    return {
      score,
      label: "fair",
      color: "text-warning",
      barColor: "bg-warning",
      percent: 50,
    };
  }
  if (score <= 3) {
    return {
      score,
      label: "good",
      color: "text-info",
      barColor: "bg-info",
      percent: 75,
    };
  }
  return {
    score,
    label: "strong",
    color: "text-success",
    barColor: "bg-success",
    percent: 100,
  };
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value,
      defaultValue,
      placeholder = "Enter password",
      size = "default",
      variant = "outlined",
      disabled = false,
      readOnly = false,
      showStrength = false,
      showToggle = true,
      minLength = 0,
      maxLength,
      id,
      name,
      autoComplete = "current-password",
      className,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
      },
      [ref],
    );

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string>(
      defaultValue != null ? String(defaultValue) : "",
    );
    const currentValue = isControlled ? String(value ?? "") : internal;

    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const computedType = passwordVisible ? "text" : "password";

    const strength = React.useMemo<StrengthResult>(
      () => computeStrength(currentValue),
      [currentValue],
    );
    const meetsMinLength = currentValue.length >= minLength;

    function toggleVisibility() {
      if (disabled || readOnly) return;
      setPasswordVisible((v) => !v);
      innerRef.current?.focus();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    }

    const wrapperClasses = cn(
      passwordInputVariants({ size, variant }),
      "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
      disabled &&
        "pointer-events-none opacity-50 cursor-not-allowed bg-muted/30",
      className,
    );

    const inputPadding =
      size === "sm" ? "px-2.5" : size === "lg" ? "px-4" : "px-3";
    const togglePadding =
      size === "sm" ? "pr-2" : size === "lg" ? "pr-3" : "pr-2.5";

    return (
      <div className="flex w-full flex-col gap-2">
        <div
          className={wrapperClasses}
          data-uipkge=""
          data-slot="password-input"
          data-size={size}
          data-variant={variant}
        >
          <input
            id={id}
            ref={setRefs}
            value={currentValue}
            type={computedType}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            placeholder={placeholder}
            name={name}
            autoComplete={autoComplete}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={cn(
              "placeholder:text-muted-foreground w-full min-w-0 flex-1 bg-transparent outline-none",
              inputPadding,
            )}
            {...rest}
          />
          {showToggle && (
            <div className={cn("flex shrink-0 items-center", togglePadding)}>
              <button
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                disabled={disabled || readOnly}
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleVisibility}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed"
              >
                {/* Visible password → EyeOff (click to hide); hidden → Eye (click to show). Matches Input. */}
                {passwordVisible ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>

        {showStrength && currentValue && (
          <div
            className="flex flex-col gap-1.5"
            role="status"
            aria-live="polite"
            aria-label={`Password strength: ${strength.label}`}
          >
            <div
              className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
              aria-hidden="true"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300",
                  strength.barColor,
                )}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={cn("font-medium capitalize", strength.color)}>
                {strength.label}
              </span>
              {minLength > 0 && (
                <span
                  className={
                    meetsMinLength ? "text-success" : "text-muted-foreground"
                  }
                >
                  {currentValue.length} / {minLength} chars
                </span>
              )}
            </div>
          </div>
        )}

        {minLength > 0 && !showStrength && currentValue && (
          <p className="text-muted-foreground text-xs">
            Minimum {minLength} characters
          </p>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
