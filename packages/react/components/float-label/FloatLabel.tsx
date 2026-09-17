"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  required?: boolean;
  disabled?: boolean;
}

const FloatLabel = React.forwardRef<HTMLDivElement, FloatLabelProps>(
  (
    {
      label,
      required = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const fallbackId = React.useId();
    const [controlId, setControlId] = React.useState(fallbackId);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const isFloating = isFocused || hasValue;

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    function checkValue(target: EventTarget | null) {
      const el = target as HTMLElement | null;
      if (!el) return;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      ) {
        setHasValue(!!el.value);
      } else {
        const input = el.querySelector?.("input, textarea, select") as
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
        if (input) setHasValue(!!input.value);
      }
    }

    // Prefill detection + associate the floating label with the nested control.
    React.useLayoutEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const input = wrapper.querySelector("input, textarea, select") as
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!input) return;
      setHasValue(!!input.value);
      if (input.id) {
        setControlId(input.id);
      } else {
        input.id = fallbackId;
        setControlId(fallbackId);
      }
    }, [fallbackId]);

    function handleFocusIn(event: React.FocusEvent<HTMLDivElement>) {
      setIsFocused(true);
      checkValue(event.target);
    }

    function handleFocusOut(event: React.FocusEvent<HTMLDivElement>) {
      setIsFocused(false);
      checkValue(event.target);
    }

    function handleInput(event: React.FormEvent<HTMLDivElement>) {
      checkValue(event.target);
    }

    const wrapperClasses = cn(
      "relative flex flex-col",
      disabled && "opacity-50 cursor-not-allowed",
      className,
    );

    const labelClasses = cn(
      "text-muted-foreground pointer-events-none absolute left-3 z-10 bg-transparent px-1 text-sm transition-[color,background-color,top,translate,scale] duration-200",
      !isFloating && "top-1/2 -translate-y-1/2",
      isFloating &&
        "top-0 -translate-y-1/2 scale-75 bg-background text-foreground",
      isFocused && "text-ring",
      required && "after:text-destructive after:ml-0.5 after:content-['*']",
    );

    return (
      <div
        ref={setRefs}
        className={wrapperClasses}
        data-uipkge=""
        data-slot="float-label"
        data-floating={isFloating}
        onFocus={handleFocusIn}
        onBlur={handleFocusOut}
        onInput={handleInput}
        onChange={handleInput}
        {...props}
      >
        <label htmlFor={controlId} className={labelClasses}>
          {label}
        </label>
        {children}
      </div>
    );
  },
);
FloatLabel.displayName = "FloatLabel";

export { FloatLabel };
