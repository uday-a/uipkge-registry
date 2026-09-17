"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnchorItem {
  href: string;
  title: string;
  children?: AnchorItem[];
}

interface AnchorContextValue {
  activeHref: string | null;
  setActive: (href: string) => void;
  register: (href: string) => void;
  unregister: (href: string) => void;
  scrollContainerRef: React.MutableRefObject<HTMLElement | Window>;
  offsetTopRef: React.MutableRefObject<number>;
}

const AnchorContext = React.createContext<AnchorContextValue | null>(null);

export interface AnchorProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> {
  items?: AnchorItem[];
  offsetTop?: number;
  /**
   * Pixel leeway for the active-section band (top of the IntersectionObserver
   * rootMargin). Larger values activate a heading slightly earlier as you scroll.
   */
  bounds?: number;
  scrollContainer?: HTMLElement | string | null;
  affix?: boolean;
  onChange?: (href: string) => void;
}

const Anchor = React.forwardRef<HTMLElement, AnchorProps>(
  (
    {
      className,
      items = [],
      offsetTop = 0,
      bounds = 5,
      scrollContainer = null,
      affix = false,
      onChange,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const [activeHref, setActiveHref] = React.useState<string | null>(null);
    const activeHrefRef = React.useRef<string | null>(null);
    const registeredRef = React.useRef<Set<string>>(new Set());
    const observerRef = React.useRef<IntersectionObserver | null>(null);
    const observedRef = React.useRef<Map<string, Element>>(new Map());
    const scrollContainerRef = React.useRef<HTMLElement | Window>(
      typeof window !== "undefined" ? window : (null as unknown as Window),
    );
    const offsetTopRef = React.useRef(offsetTop);
    const boundsRef = React.useRef(bounds);
    const onChangeRef = React.useRef(onChange);

    React.useEffect(() => {
      offsetTopRef.current = offsetTop;
    }, [offsetTop]);
    React.useEffect(() => {
      boundsRef.current = bounds;
    }, [bounds]);
    React.useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    const setActive = React.useCallback((href: string) => {
      activeHrefRef.current = href;
      setActiveHref(href);
      onChangeRef.current?.(href);
    }, []);

    const resolveContainer = React.useCallback((): HTMLElement | Window => {
      if (!scrollContainer) return window;
      if (typeof scrollContainer === "string") {
        return (
          (document.querySelector(scrollContainer) as HTMLElement) ?? window
        );
      }
      return scrollContainer;
    }, [scrollContainer]);

    const rebuildObserver = React.useCallback(() => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observedRef.current.clear();
      }
      const container = scrollContainerRef.current;
      const root = container === window ? null : (container as HTMLElement);
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const intersecting = entries.filter((e) => e.isIntersecting);
          if (intersecting.length === 0) return;
          intersecting.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          const id = "#" + intersecting[0]!.target.id;
          if (id !== activeHrefRef.current) {
            activeHrefRef.current = id;
            setActiveHref(id);
            onChangeRef.current?.(id);
          }
        },
        {
          root,
          // bounds softens the top edge so a section can activate slightly before
          // its heading hits offsetTop exactly (ant-design-style leeway).
          rootMargin: `-${Math.max(0, offsetTopRef.current - boundsRef.current)}px 0px -60% 0px`,
          threshold: [0, 1],
        },
      );
      for (const href of registeredRef.current) {
        const el = document.querySelector(href);
        if (el) {
          observedRef.current.set(href, el);
          observerRef.current.observe(el);
        }
      }
    }, []);

    const register = React.useCallback((href: string) => {
      registeredRef.current.add(href);
      if (!observerRef.current) return;
      const el = document.querySelector(href);
      if (el && !observedRef.current.has(href)) {
        observedRef.current.set(href, el);
        observerRef.current.observe(el);
      }
    }, []);

    const unregister = React.useCallback((href: string) => {
      registeredRef.current.delete(href);
      const el = observedRef.current.get(href);
      if (el && observerRef.current) observerRef.current.unobserve(el);
      observedRef.current.delete(href);
    }, []);

    React.useEffect(() => {
      scrollContainerRef.current = resolveContainer();
      rebuildObserver();
      return () => {
        observerRef.current?.disconnect();
        observerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollContainer, offsetTop, bounds]);

    const ctx = React.useMemo<AnchorContextValue>(
      () => ({
        activeHref,
        setActive,
        register,
        unregister,
        scrollContainerRef,
        offsetTopRef,
      }),
      [activeHref, setActive, register, unregister],
    );

    return (
      <AnchorContext.Provider value={ctx}>
        <nav
          ref={ref}
          data-uipkge=""
          data-slot="anchor"
          aria-label="Table of contents"
          className={cn(
            "border-border flex flex-col gap-1 border-l text-sm",
            affix && "sticky",
            className,
          )}
          style={affix ? { top: `${offsetTop}px`, ...style } : style}
          {...props}
        >
          {items.length
            ? items.map((item) => (
                <AnchorLink key={item.href} href={item.href} title={item.title}>
                  {(item.children ?? []).map((child) => (
                    <AnchorLink
                      key={child.href}
                      href={child.href}
                      title={child.title}
                    />
                  ))}
                </AnchorLink>
              ))
            : children}
        </nav>
      </AnchorContext.Provider>
    );
  },
);
Anchor.displayName = "Anchor";

export interface AnchorLinkProps {
  href: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}

const AnchorLink = React.forwardRef<HTMLDivElement, AnchorLinkProps>(
  ({ href, title, className, children }, ref) => {
    const ctx = React.useContext(AnchorContext);
    if (!ctx) throw new Error("AnchorLink must be used inside <Anchor>.");

    const isActive = ctx.activeHref === href;

    React.useEffect(() => {
      ctx.register(href);
      return () => ctx.unregister(href);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [href]);

    const onClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      const offset = ctx.offsetTopRef.current;
      const container = ctx.scrollContainerRef.current;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
      if (container === window) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior });
      } else {
        const c = container as HTMLElement;
        const top =
          el.getBoundingClientRect().top -
          c.getBoundingClientRect().top +
          c.scrollTop -
          offset;
        c.scrollTo({ top, behavior });
      }
      history.replaceState(null, "", href);
      ctx.setActive(href);
    };

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="anchor-link"
        className="flex flex-col"
      >
        <a
          href={href}
          aria-current={isActive ? "location" : undefined}
          className={cn(
            "text-muted-foreground -ml-px block border-l-2 border-transparent py-2 pl-3 transition-colors",
            "hover:text-foreground",
            "focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            isActive && "border-primary text-foreground font-medium",
            className,
          )}
          onClick={onClick}
        >
          {title}
        </a>
        {children ? <div className="ml-3">{children}</div> : null}
      </div>
    );
  },
);
AnchorLink.displayName = "AnchorLink";

export { Anchor, AnchorLink };
