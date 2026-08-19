"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { chipVariants, type ChipVariants } from "./chip.variants";

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClose">, ChipVariants {
  closable?: boolean;
  onClose?: () => void;
}
const STYLE_ID = "chip-motion-styles";
const STYLE_CONTENT = `
@keyframes chip-enter {
  from { opacity: 0; transform: scale(0.88); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes chip-leave {
  to { opacity: 0; transform: scale(0.88); }
}
[data-slot='chip'].chip-enter {
  animation: chip-enter 180ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
[data-slot='chip'].chip-leave {
  animation: chip-leave 160ms ease-in both;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='chip'].chip-enter,
  [data-slot='chip'].chip-leave {
    animation: none !important;
  }
}
`;

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    { className, variant, size, wrap, closable, onClose, children, ...props },
    ref,
  ) => {
    const [leaving, setLeaving] = React.useState(false);

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

    function handleClose(e: React.MouseEvent) {
      e.stopPropagation();
      if (leaving) return;
      setLeaving(true);
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(
        () => {
          onClose?.();
        },
        reduce ? 0 : 160,
      );
    }

    return (
      <span
        ref={ref}
        data-uipkge=""
        data-slot="chip"
        data-leaving={leaving || undefined}
        className={cn(
          chipVariants({ variant, size, wrap }),
          "chip-enter",
          leaving && "chip-leave",
          className,
        )}
        {...props}
      >
        {children}
        {closable ? (
          <button
            type="button"
            aria-label="Remove item"
            className="focus-visible:ring-ring hover:bg-foreground/10 ml-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full transition-transform duration-150 focus-visible:ring-1 focus-visible:outline-none active:scale-90"
            onClick={handleClose}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        ) : null}
      </span>
    );
  },
);
Chip.displayName = "Chip";

export interface ChipGroupRenderProps {
  selected: string[];
  multiple: boolean;
  filter: boolean;
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
}

export interface ChipGroupProps {
  className?: string;
  selected?: string[];
  multiple?: boolean;
  filter?: boolean;
  column?: boolean;
  mandatory?: boolean;
  max?: number;
  disabled?: boolean;
  onSelectedChange?: (value: string[]) => void;
  children?: (props: ChipGroupRenderProps) => React.ReactNode;
}

const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  (
    {
      className,
      selected = [],
      multiple = false,
      filter = false,
      column = false,
      mandatory = false,
      max,
      disabled = false,
      onSelectedChange,
      children,
    },
    ref,
  ) => {
    const isSelected = (value: string) => selected.includes(value);

    const toggle = (value: string) => {
      if (disabled) return;

      let newSelected: string[];

      if (multiple) {
        if (isSelected(value)) {
          newSelected = selected.filter((v) => v !== value);
        } else {
          if (max && selected.length >= max) {
            newSelected = [...selected.slice(1), value];
          } else {
            newSelected = [...selected, value];
          }
        }
      } else {
        if (isSelected(value) && !mandatory) {
          newSelected = [];
        } else {
          newSelected = [value];
        }
      }

      onSelectedChange?.(newSelected);
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn("flex flex-wrap gap-2", column && "flex-col", className)}
        data-chip-group="true"
        data-multiple={multiple || undefined}
        data-filter={filter || undefined}
      >
        {children?.({ selected, multiple, filter, isSelected, toggle })}
      </div>
    );
  },
);
ChipGroup.displayName = "ChipGroup";

export { Chip, ChipGroup };
