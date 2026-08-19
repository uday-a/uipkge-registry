import * as React from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { backTopVariants, type BackTopVariants } from "./back-top.variants";

export interface BackTopProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "content"
> {
  /** Visibility threshold in pixels. Button appears once scroll passes it. */
  threshold?: number;
  /** Target container. Defaults to the window. Pass a CSS selector or an HTMLElement. */
  target?: string | HTMLElement | Window;
  /** Scroll behavior: 'smooth' or 'auto' (instant). */
  behavior?: ScrollBehavior;
  /** Size variant. */
  size?: BackTopVariants["size"];
  /** Edge anchor position. */
  position?: BackTopVariants["position"];
  /** Distance from the viewport edge (px). */
  offset?: number;
  /** Use absolute positioning (for section-level containers) instead of fixed (viewport). */
  absolute?: boolean;
  /** Accessible label. */
  ariaLabel?: string;
  /** Override the default arrow icon. */
  icon?: React.ReactNode;
  /** Fired whenever visibility toggles. */
  onVisible?: (visible: boolean) => void;
}

type ScrollTarget = HTMLElement | Window | null;

const BackTop = React.forwardRef<HTMLButtonElement, BackTopProps>(
  (
    {
      className,
      threshold = 200,
      target,
      behavior = "smooth",
      size = "default",
      position = "bottom-right",
      offset = 24,
      absolute = false,
      ariaLabel = "Scroll to top",
      icon,
      onVisible,
      onClick,
      style,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(false);
    // Keep the button mounted during the exit animation, then unmount.
    const [mounted, setMounted] = React.useState(false);
    const [dataState, setDataState] = React.useState<"open" | "closed">(
      "closed",
    );
    const currentTargetRef = React.useRef<ScrollTarget>(null);
    const onVisibleRef = React.useRef(onVisible);
    onVisibleRef.current = onVisible;

    function resolveTarget(): ScrollTarget {
      if (typeof window === "undefined") return null;
      if (target === undefined || target === null) return window;
      if (typeof target === "string") {
        const el = document.querySelector<HTMLElement>(target);
        return el ?? window;
      }
      return target;
    }

    function getScrollTop(el: HTMLElement | Window): number {
      if (el === window) {
        return (
          window.scrollY ??
          document.documentElement.scrollTop ??
          document.body.scrollTop ??
          0
        );
      }
      return (el as HTMLElement).scrollTop;
    }

    function scrollToTop(el: HTMLElement | Window) {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const resolvedBehavior: ScrollBehavior = reduceMotion ? "auto" : behavior;
      if (el === window) {
        window.scrollTo({ top: 0, behavior: resolvedBehavior });
      } else {
        (el as HTMLElement).scrollTo({ top: 0, behavior: resolvedBehavior });
      }
    }

    const handleScroll = React.useCallback(() => {
      const current = currentTargetRef.current;
      if (!current) return;
      const scrollTop = getScrollTop(current);
      // `>=` so threshold={0} always shows (size/position demos, forced-visible cases).
      const next = scrollTop >= threshold;
      setVisible((prev) => {
        if (next !== prev) {
          onVisibleRef.current?.(next);
          return next;
        }
        return prev;
      });
    }, [threshold]);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        const current = currentTargetRef.current;
        if (current) scrollToTop(current);
      },
      [onClick, behavior],
    );

    // Mount/unmount with exit animation, mirroring the Vue <Transition name="back-top">.
    React.useEffect(() => {
      if (visible) {
        setMounted(true);
        setDataState("open");
        return;
      }
      if (mounted) {
        setDataState("closed");
        const t = window.setTimeout(() => setMounted(false), 200);
        return () => window.clearTimeout(t);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    // Attach scroll listeners; re-resolve when the target prop changes.
    React.useEffect(() => {
      currentTargetRef.current = resolveTarget();
      const current = currentTargetRef.current;
      if (!current) return;
      current.addEventListener("scroll", handleScroll, { passive: true });
      // If target is a container, also listen to window scroll for safety on resize.
      if (current !== window) {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
      handleScroll();
      return () => {
        current.removeEventListener("scroll", handleScroll);
        if (current !== window) {
          window.removeEventListener("scroll", handleScroll);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, handleScroll]);

    const positionStyle = React.useMemo<React.CSSProperties>(() => {
      const o = `${offset}px`;
      switch (position) {
        case "bottom-left":
          return { left: o, bottom: o };
        case "top-right":
          return { right: o, top: o };
        case "top-left":
          return { left: o, top: o };
        default:
          return { right: o, bottom: o };
      }
    }, [position, offset]);

    if (!mounted) return null;

    return (
      <button
        ref={ref}
        data-uipkge=""
        data-slot="back-top"
        data-state={dataState}
        data-size={size ?? undefined}
        data-position={position ?? undefined}
        type="button"
        aria-label={ariaLabel}
        className={cn(
          backTopVariants({ size, position }),
          absolute ? "absolute" : "fixed",
          className,
        )}
        style={{ ...positionStyle, ...style }}
        onClick={handleClick}
        {...props}
      >
        {icon ?? <ArrowUp aria-hidden="true" />}
      </button>
    );
  },
);
BackTop.displayName = "BackTop";

export { BackTop };
