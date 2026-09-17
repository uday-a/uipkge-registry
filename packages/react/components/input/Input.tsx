"use client";

import * as React from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "small" | "middle" | "large";
type Variant = "outlined" | "filled" | "borderless";
type Status = "error" | "warning";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> {
  size?: Size;
  variant?: Variant;
  status?: Status;
  /** Leading content. A node wins over the `prefixIcon` shorthand. */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Shorthand for an icon at the start/end (e.g. `prefixIcon={<Mail />}`). */
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  allowClear?: boolean;
  showCount?: boolean;
  showPasswordToggle?: boolean;
  /** Wrapper className. Falls through to the bordered control, not the <input>. */
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  small: "h-8 text-xs",
  middle: "h-9 text-base md:text-sm",
  large: "h-11 text-base",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "middle",
      variant = "outlined",
      status,
      prefix,
      suffix,
      prefixIcon,
      suffixIcon,
      addonBefore,
      addonAfter,
      allowClear,
      showCount,
      showPasswordToggle,
      className,
      type = "text",
      disabled,
      readOnly,
      maxLength,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      id,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    // Merge the forwarded ref with our internal ref (needed for focus()).
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

    const [focused, setFocused] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const isPassword = type === "password";
    const hasPrefix = !!prefix || !!prefixIcon;
    const hasSuffix = !!suffix || !!suffixIcon;
    const hasAddonBefore = !!addonBefore;
    const hasAddonAfter = !!addonAfter;

    const hasPasswordToggle = !!showPasswordToggle && isPassword;
    const hasCount = !!showCount && maxLength != null;
    const hasRightConfig = !!allowClear || hasPasswordToggle || hasCount;

    const currentLength = currentValue.length;
    const showClear =
      !!allowClear &&
      currentValue.length > 0 &&
      (focused || hovered) &&
      !disabled &&
      !readOnly;
    const computedType = !isPassword
      ? type
      : passwordVisible
        ? "text"
        : "password";

    const wrapperRounded =
      hasAddonBefore && hasAddonAfter
        ? "rounded-none"
        : hasAddonBefore
          ? "rounded-l-none rounded-r-md"
          : hasAddonAfter
            ? "rounded-r-none rounded-l-md"
            : "rounded-md";

    const variantMap: Record<Variant, string> = {
      outlined: "border-input bg-transparent shadow-xs",
      filled: "border-transparent bg-muted/50 shadow-none",
      borderless: "border-transparent bg-transparent shadow-none",
    };
    const statusMap: Record<Status, string> = {
      error:
        "border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40",
      warning:
        "border-warning focus-within:border-warning focus-within:ring-warning/20",
    };

    const wrapperClasses = cn(
      "flex w-full items-center gap-1.5 overflow-hidden border transition-[color,box-shadow] outline-none",
      sizeClasses[size],
      variantMap[variant],
      status ? statusMap[status] : "",
      !status
        ? "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]"
        : "",
      disabled
        ? "pointer-events-none opacity-50 cursor-not-allowed bg-muted/30"
        : "",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      wrapperRounded,
      className,
    );

    function addonClasses(position: "before" | "after") {
      const roundedClass =
        position === "before"
          ? "rounded-l-md rounded-r-none border-r-0"
          : "rounded-r-md rounded-l-none border-l-0";
      return cn(
        "flex items-center bg-muted px-3 text-sm text-muted-foreground border border-input",
        roundedClass,
        sizeClasses[size],
      );
    }

    const sidePad =
      size === "small"
        ? { l: "pl-2", r: "pr-2" }
        : size === "large"
          ? { l: "pl-3", r: "pr-3" }
          : { l: "pl-2.5", r: "pr-2.5" };

    const hasLeft = hasPrefix;
    const hasRight = hasSuffix || hasRightConfig;
    const inputPadding =
      !hasLeft && !hasRight
        ? cn(sidePad.l, sidePad.r)
        : hasLeft && !hasRight
          ? cn("pl-0", sidePad.r)
          : !hasLeft && hasRight
            ? cn(sidePad.l, "pr-0")
            : "px-0";

    function emit(next: string) {
      if (!isControlled) setInternal(next);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      emit(e.target.value);
      onChange?.(e);
    }

    function handleClear() {
      const node = innerRef.current;
      if (node) {
        // Use the native setter so a controlled parent's onChange fires with a
        // real event (React tracks the value on the DOM node's prototype).
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        setter?.call(node, "");
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.focus();
      }
      emit("");
    }

    function togglePassword() {
      setPasswordVisible((v) => !v);
      innerRef.current?.focus();
    }

    // status=error implies invalid for AT; also set on the native input (not only the wrapper).
    const resolvedAriaInvalid = status === "error" ? true : ariaInvalid;

    return (
      <div className="flex w-full">
        {hasAddonBefore && (
          <div className={addonClasses("before")}>{addonBefore}</div>
        )}

        <div
          className={wrapperClasses}
          data-uipkge=""
          data-slot="input"
          aria-invalid={resolvedAriaInvalid}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => innerRef.current?.focus()}
        >
          {hasPrefix && (
            <span
              className={cn(
                "text-muted-foreground pointer-events-none shrink-0 select-none",
                sidePad.l,
              )}
            >
              {prefixIcon ?? prefix}
            </span>
          )}

          <input
            id={id}
            ref={setRefs}
            value={currentValue}
            type={computedType}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            aria-invalid={resolvedAriaInvalid}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              "w-full min-w-0 flex-1 bg-transparent outline-none",
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
              "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "disabled:cursor-not-allowed",
              inputPadding,
            )}
            {...rest}
          />

          {/* Only mount the right rail when it has content — an empty padded
              flex child steals horizontal space from plain inputs. Built-in
              actions render first, then the user's suffix, so the suffix is
              always rightmost. */}
          {hasRight && (
            <div className={cn("flex shrink-0 items-center gap-1", sidePad.r)}>
              {showClear && (
                <button
                  type="button"
                  aria-label="Clear input"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}

              {hasPasswordToggle && !disabled && !readOnly && (
                <button
                  type="button"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={passwordVisible}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={togglePassword}
                >
                  {passwordVisible ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              )}

              {hasCount && (
                <span className="text-muted-foreground pointer-events-none text-xs select-none">
                  {currentLength}/{maxLength}
                </span>
              )}

              {hasSuffix && (
                <span className="text-muted-foreground pointer-events-none select-none">
                  {suffixIcon ?? suffix}
                </span>
              )}
            </div>
          )}
        </div>

        {hasAddonAfter && (
          <div className={addonClasses("after")}>{addonAfter}</div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
