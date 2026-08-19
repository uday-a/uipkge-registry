"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";
import { toggleVariants, type ToggleVariants } from "../toggle/toggle.variants";

// Make variant/size/spacing reachable from items without each consumer having
// to pass it manually — the React equivalent of the Vue provide('toggleGroup').
type ToggleGroupContextValue = {
  variant?: ToggleVariants["variant"];
  size?: ToggleVariants["size"];
  spacing?: number;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({});

export type ToggleGroupProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  ToggleVariants & {
    spacing?: number;
    /** Sliding selection indicator for single-select (default true). Multi-select keeps item chrome. */
    animated?: boolean;
  };

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    {
      className,
      variant,
      size,
      spacing = 0,
      animated = true,
      children,
      type,
      ...props
    },
    ref,
  ) => {
    // Sliding pill only for single-select. Multi-select paints per-item surfaces.
    const indicatorActive = animated !== false && type !== "multiple";
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const firstPosition = React.useRef(true);
    const [indicatorStyle, setIndicatorStyle] =
      React.useState<React.CSSProperties>({ opacity: 0 });

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const motionSafeTransition = React.useCallback(() => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return "none";
      }
      return firstPosition.current
        ? "none"
        : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 220ms cubic-bezier(0.22, 1, 0.36, 1)";
    }, []);

    const updateIndicator = React.useCallback(() => {
      if (!indicatorActive) return;
      const root = listRef.current;
      if (!root) return;
      const active = root.querySelector<HTMLElement>(
        '[data-slot="toggle-group-item"][data-state="on"]',
      );
      if (!active) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      const listRect = root.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const left = activeRect.left - listRect.left + root.scrollLeft;
      const top = activeRect.top - listRect.top + root.scrollTop;
      const transition = motionSafeTransition();

      setIndicatorStyle({
        width: activeRect.width,
        height: activeRect.height,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        borderRadius: getComputedStyle(active).borderRadius,
        opacity: 1,
        transition,
      });
      firstPosition.current = false;
    }, [indicatorActive, motionSafeTransition]);

    // Bind observers once per animated mode / layout props — NOT on every children
    // identity change (controlled groups re-render parents constantly).
    React.useLayoutEffect(() => {
      firstPosition.current = true;
      if (!indicatorActive) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }
      updateIndicator();
      const root = listRef.current;
      if (!root) return;

      const ro = new ResizeObserver(() => updateIndicator());
      ro.observe(root);
      root
        .querySelectorAll('[data-slot="toggle-group-item"]')
        .forEach((el) => ro.observe(el));

      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "childList") {
            root
              .querySelectorAll('[data-slot="toggle-group-item"]')
              .forEach((el) => ro.observe(el));
          }
        }
        updateIndicator();
      });
      mo.observe(root, {
        attributes: true,
        attributeFilter: ["data-state"],
        subtree: true,
        childList: true,
      });

      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }, [indicatorActive, size, spacing, updateIndicator, variant]);

    return (
      <ToggleGroupPrimitive.Root
        ref={setRefs}
        {...(type === "multiple"
          ? ({
              type: "multiple",
              ...props,
            } as ToggleGroupPrimitive.ToggleGroupMultipleProps)
          : ({
              type: "single",
              ...props,
            } as ToggleGroupPrimitive.ToggleGroupSingleProps))}
        data-uipkge=""
        data-slot="toggle-group"
        data-size={size}
        data-variant={variant}
        data-spacing={spacing}
        data-animated={indicatorActive ? "true" : "false"}
        style={{ "--gap": spacing } as React.CSSProperties}
        className={cn(
          "group/toggle-group relative flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
          className,
        )}
      >
        {indicatorActive && (
          <span
            data-slot="toggle-group-indicator"
            aria-hidden="true"
            className="bg-accent pointer-events-none absolute top-0 left-0 z-0 shadow-xs will-change-transform"
            style={indicatorStyle}
          />
        )}
        <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  },
);
ToggleGroup.displayName = "ToggleGroup";

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> &
  ToggleVariants;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, children, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-uipkge=""
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // z-10 keeps label/icons above the sliding indicator. When the parent
        // has data-animated=true (single-select), on-state surface lives on the
        // indicator — suppress item bg so the pill can slide cleanly.
        "relative z-10 w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "group-data-[animated=true]/toggle-group:data-[state=on]:bg-transparent group-data-[animated=true]/toggle-group:data-[state=on]:hover:bg-transparent",
        // first/last-of-type (not first/last-child): sliding indicator is a sibling span
        // and must not steal end-cap rounding or the outline left border.
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first-of-type:rounded-l-md data-[spacing=0]:last-of-type:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first-of-type:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
