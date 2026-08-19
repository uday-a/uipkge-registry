"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  /** Currently selected value */
  value?: number;
  /** Default value when uncontrolled */
  defaultValue?: number;
  /** Emitted when the value changes */
  onValueChange?: (value: number) => void;
  /** Maximum rating value */
  max?: number;
  /** If true, prevents user interaction */
  readonly?: boolean;
  /** If true, disables the rating */
  disabled?: boolean;
  /** Density of the component */
  density?: "compact" | "default" | "comfortable";
  /** Color of the selected stars */
  color?: string;
  /** If true, clicking the same value clears the rating */
  clearable?: boolean;
  /** If true, stars grow on hover */
  hover?: boolean;
  /** ARIA label for each rating item */
  itemAriaLabel?: string;
  /** Size of the stars */
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  /** Custom class for the component */
  className?: string;
  /** Show rating count */
  showValue?: boolean;
  /** Card variant styling */
  variant?: "outlined" | "filled" | "soft";
  /** If true, creates a half star at 0.5 */
  halfIncrements?: boolean;
  /** Optional per-star tooltip labels (native title + aria-label) */
  tooltips?: string[];
}

// Star path shared by all three icon states.
const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

// Ported 1:1 from the Vue scoped stylesheet. React has no scoped styles, so the
// per-size star dimensions and per-variant container chrome live inline here.
const variantClasses: Record<NonNullable<RatingProps["variant"]>, string> = {
  outlined: "",
  filled: "bg-muted p-1 rounded-lg",
  soft: "bg-accent p-1 rounded-lg",
};

const sizeIcon: Record<
  NonNullable<RatingProps["size"]>,
  React.CSSProperties
> = {
  "x-small": { width: "0.875rem", height: "0.875rem" },
  small: { width: "1.125rem", height: "1.125rem" },
  medium: { width: "1.375rem", height: "1.375rem" },
  large: { width: "1.625rem", height: "1.625rem" },
  "x-large": { width: "2rem", height: "2rem" },
};

const densityPad: Record<NonNullable<RatingProps["density"]>, string> = {
  compact: "0",
  default: "0.0625rem",
  comfortable: "0.125rem",
};

const STYLE_ID = "rating-star-styles";
const STYLE_CONTENT = `
@keyframes rating-star-pop {
  0% { opacity: 0.4; transform: scale(0.6); }
  60% { opacity: 1; transform: scale(1.18); }
  100% { opacity: 1; transform: scale(1); }
}
[data-slot='rating'] .rating-star-full-icon {
  animation: rating-star-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
  animation-delay: var(--star-delay, 0ms);
}
[data-slot='rating'] button:not(:disabled):hover {
  transform: scale(1.12);
  transition: transform 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='rating'] .rating-star-full-icon {
    animation: none !important;
  }
  [data-slot='rating'] button:not(:disabled):hover {
    transition: none !important;
    transform: none !important;
  }
}
`;

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue = 0,
      onValueChange,
      max = 5,
      readonly = false,
      disabled = false,
      density = "default",
      color = "var(--warning)",
      clearable = false,
      hover = false,
      itemAriaLabel = "rating",
      size = "medium",
      className,
      showValue = false,
      variant = "outlined",
      halfIncrements = false,
      tooltips,
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value! : internal;

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

    function emit(next: number) {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    }

    const reactId = React.useId();

    function resolveClickValue(e: React.MouseEvent, star: number): number {
      if (!halfIncrements) return star;
      const rect = e.currentTarget.getBoundingClientRect();
      const isLeft = e.clientX - rect.left < rect.width / 2;
      const next = isLeft ? star - 0.5 : star;
      return next < 0.5 ? 0.5 : next;
    }

    function handleClick(e: React.MouseEvent, star: number) {
      if (disabled || readonly) return;
      const next = resolveClickValue(e, star);
      if (clearable && next === current) emit(0);
      else emit(next);
    }

    function handleKeydown(e: React.KeyboardEvent, star: number) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (disabled || readonly) return;
        if (clearable && star === current) emit(0);
        else emit(star);
        return;
      }
      const step = halfIncrements ? 0.5 : 1;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        emit(Math.min(max, current + step));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        emit(Math.max(0, current - step));
      } else if (e.key === "Home") {
        e.preventDefault();
        emit(halfIncrements ? 0.5 : 1);
      } else if (e.key === "End") {
        e.preventDefault();
        emit(max);
      }
    }

    const iconStyle = sizeIcon[size];
    const focusStar = Math.ceil(current || 1);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="rating"
        className={cn(
          "inline-flex items-center gap-0.5",
          variantClasses[variant],
          disabled && "cursor-not-allowed opacity-50",
          readonly && "cursor-default",
          showValue && "flex items-center gap-1",
          className,
        )}
        role="radiogroup"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Rating: ${current} of ${max}`}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const filled = current >= n;
          const halfId = `${reactId}-half-${n}`;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              disabled={disabled || readonly}
              aria-label={
                tooltips?.[n - 1] ?? `${itemAriaLabel} ${n} of ${max}`
              }
              aria-checked={Math.ceil(current || 0) === n}
              title={tooltips?.[n - 1]}
              tabIndex={readonly || disabled ? -1 : focusStar === n ? 0 : -1}
              onClick={(e) => handleClick(e, n)}
              onKeyDown={(e) => handleKeydown(e, n)}
              style={
                {
                  padding: densityPad[density],
                  outlineColor: color,
                  "--star-delay": filled ? `${(n - 1) * 45}ms` : "0ms",
                } as React.CSSProperties
              }
              className={cn(
                "inline-flex items-center justify-center border-none bg-none leading-none transition-transform duration-150",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                clearable && "cursor-pointer",
                hover && "hover:scale-[1.15]",
              )}
            >
              {filled ? (
                <svg
                  key={`full-${n}`}
                  className="rating-star-full-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ ...iconStyle, color }}
                >
                  <path d={STAR_PATH} />
                </svg>
              ) : current >= n - 0.5 && halfIncrements ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ ...iconStyle, color }}
                >
                  <defs>
                    <linearGradient id={halfId}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path
                    d={STAR_PATH}
                    fill={`url(#${halfId})`}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  style={{ ...iconStyle, color: "var(--muted-foreground)" }}
                >
                  <path d={STAR_PATH} />
                </svg>
              )}
            </button>
          );
        })}
        {showValue && (
          <span className="text-foreground ml-2 font-semibold">{current}</span>
        )}
      </div>
    );
  },
);
Rating.displayName = "Rating";

export { Rating };
