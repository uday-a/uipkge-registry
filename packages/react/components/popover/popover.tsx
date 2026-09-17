"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export type PopoverCloseBehavior =
  "auto" | "click-outside" | "esc" | "manual" | "none";

interface PopoverContextValue {
  closeBehavior: PopoverCloseBehavior;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  closeBehavior: "auto",
});

export interface PopoverProps extends React.ComponentProps<
  typeof PopoverPrimitive.Root
> {
  /** Persist open state in localStorage. `true` uses an auto-generated key,
   *  a string uses that key verbatim, `false` (default) disables. */
  persist?: string | boolean;
  /** Controls how the popover may be dismissed. */
  closeBehavior?: PopoverCloseBehavior;
}

function Popover({
  persist = false,
  closeBehavior = "auto",
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: PopoverProps) {
  const autoId = React.useId();
  const storageKey = React.useMemo(() => {
    if (persist === false) return null;
    if (persist === true) return `uipkge-popover-${autoId}`;
    return persist;
  }, [persist, autoId]);

  const isControlled = open !== undefined;
  const [localOpen, setLocalOpen] = React.useState<boolean>(
    defaultOpen ?? false,
  );

  // Hydrate from localStorage on mount.
  React.useEffect(() => {
    if (!storageKey || typeof localStorage === "undefined") return;
    if (localStorage.getItem(storageKey) === "1") {
      setLocalOpen(true);
      if (!isControlled) onOpenChange?.(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist current open state.
  const effectiveOpen = isControlled ? open : localOpen;
  React.useEffect(() => {
    if (!storageKey || typeof localStorage === "undefined") return;
    if (effectiveOpen) localStorage.setItem(storageKey, "1");
    else localStorage.removeItem(storageKey);
  }, [storageKey, effectiveOpen]);

  function handleOpenChange(value: boolean) {
    setLocalOpen(value);
    onOpenChange?.(value);
  }

  return (
    <PopoverContext.Provider value={{ closeBehavior }}>
      <PopoverPrimitive.Root
        data-uipkge=""
        data-slot="popover"
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    data-uipkge=""
    data-slot="popover-trigger"
    {...props}
  />
));
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>((props, ref) => (
  <PopoverPrimitive.Anchor
    ref={ref}
    data-uipkge=""
    data-slot="popover-anchor"
    {...props}
  />
));
PopoverAnchor.displayName = PopoverPrimitive.Anchor.displayName;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      onPointerDownOutside,
      onEscapeKeyDown,
      ...props
    },
    ref,
  ) => {
    const { closeBehavior } = React.useContext(PopoverContext);

    // Compose so closeBehavior still applies when consumers pass their own handlers
    // (handlers listed after {...props} would otherwise be overwritten).
    function handlePointerDownOutside(
      e: Parameters<
        NonNullable<
          React.ComponentPropsWithoutRef<
            typeof PopoverPrimitive.Content
          >["onPointerDownOutside"]
        >
      >[0],
    ) {
      if (
        closeBehavior === "esc" ||
        closeBehavior === "manual" ||
        closeBehavior === "none"
      ) {
        e.preventDefault();
      }
      onPointerDownOutside?.(e);
    }

    function handleEscapeKeyDown(e: KeyboardEvent) {
      if (
        closeBehavior === "click-outside" ||
        closeBehavior === "manual" ||
        closeBehavior === "none"
      ) {
        e.preventDefault();
      }
      onEscapeKeyDown?.(e);
    }

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          data-uipkge=""
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          onPointerDownOutside={handlePointerDownOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          className={cn(
            "bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
