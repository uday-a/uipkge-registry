import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfiniteScrollProps<T = any> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Rendered list. The component does not mutate it; the parent appends
   *  new items in response to the `onLoadMore` callback. */
  items?: T[];
  /** When false, the sentinel never fires `onLoadMore` (end of data reached). */
  hasMore?: boolean;
  /** True while the parent is fetching. While true the sentinel is paused
   *  so duplicate loads are not emitted. */
  loading?: boolean;
  /** Distance (px) from the boundary at which `onLoadMore` fires. Larger = earlier. */
  distance?: number;
  /** Scroll container. `"window"` listens on the viewport; pass an element
   *  ref (HTMLElement) or a CSS selector string to listen on a scrollable
   *  element instead. */
  scrollTarget?: "window" | HTMLElement | string;
  /** Reverse mode: prepend items at the top. The sentinel is anchored to the
   *  top edge and `onLoadMore` fires when the user scrolls near the top. */
  reverse?: boolean;
  /** Hard pause independent of `loading`/`hasMore`. */
  disabled?: boolean;
  /** Hide the default loading spinner (use the `loadingSlot` prop instead). */
  hideSpinner?: boolean;
  /** Override the default loading spinner. Mirrors the Vue `loading` slot. */
  loadingSlot?: React.ReactNode;
  /** Override the default end-of-list message. Mirrors the Vue `end` slot. */
  endSlot?: React.ReactNode;
  /** List contents. Mirrors the Vue default slot. */
  children?: React.ReactNode;
  /** Fired when the user scrolls near the boundary. Vue `@load` -> React `onLoadMore`. */
  onLoadMore?: () => void;
}

type ScrollEl = HTMLElement | Window | null;

function InfiniteScrollInner<T>(
  props: InfiniteScrollProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    className,
    hasMore = true,
    loading = false,
    distance = 0,
    scrollTarget = "window",
    reverse = false,
    disabled = false,
    hideSpinner = false,
    loadingSlot,
    endSlot,
    children,
    onLoadMore,
    ...rest
  } = props;

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const scrollElRef = React.useRef<ScrollEl>(null);
  // Latest props captured in a ref so the scroll handler never closes over
  // stale values (it is bound once per scroll-target change).
  const stateRef = React.useRef({
    disabled,
    loading,
    hasMore,
    reverse,
    distance,
    onLoadMore,
  });
  stateRef.current = {
    disabled,
    loading,
    hasMore,
    reverse,
    distance,
    onLoadMore,
  };

  const showSpinner = loading && !hideSpinner;

  function getScrollElement(): ScrollEl {
    if (scrollTarget === "window")
      return typeof window === "undefined" ? null : window;
    if (typeof scrollTarget === "string") {
      if (typeof document === "undefined") return null;
      return (
        (document.querySelector(scrollTarget) as HTMLElement | null) ?? window
      );
    }
    return scrollTarget;
  }

  function check() {
    const state = stateRef.current;
    if (
      state.disabled ||
      state.loading ||
      !state.hasMore ||
      !sentinelRef.current
    )
      return;
    const sentinelEl = sentinelRef.current;
    const sentinelRect = sentinelEl.getBoundingClientRect();
    // When listening on a scrollable element, use that element's visible box —
    // not the window — otherwise a short/offset container never (or always)
    // trips the threshold relative to the viewport.
    let edgeTop = 0;
    let edgeBottom =
      window.innerHeight || document.documentElement.clientHeight;
    const scrollEl = scrollElRef.current;
    if (scrollEl && scrollEl !== window) {
      const r = (scrollEl as HTMLElement).getBoundingClientRect();
      edgeTop = r.top;
      edgeBottom = r.bottom;
    }
    if (state.reverse) {
      // Reverse: fire when the sentinel (anchored at top) approaches the top edge.
      if (
        sentinelRect.bottom >= edgeTop - state.distance &&
        sentinelRect.top <= edgeBottom
      ) {
        state.onLoadMore?.();
      }
    } else {
      // Forward: fire when the sentinel approaches the bottom edge.
      if (
        sentinelRect.top <= edgeBottom + state.distance &&
        sentinelRect.bottom >= edgeTop - state.distance
      ) {
        state.onLoadMore?.();
      }
    }
  }

  // Bind the scroll listener; re-bind when the scroll target changes.
  React.useEffect(() => {
    const scrollEl = getScrollElement();
    scrollElRef.current = scrollEl;
    if (!scrollEl) return;
    const onScroll = () => check();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    // Fire once on mount so an initially-empty list starts loading immediately.
    check();
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTarget]);

  // When a load completes (loading flips false) and there is still more data,
  // re-check in case the viewport is still larger than the content (short list).
  React.useEffect(() => {
    if (!loading && hasMore) {
      const raf = requestAnimationFrame(() => check());
      return () => cancelAnimationFrame(raf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  return (
    <div
      data-uipkge=""
      data-slot="infinite-scroll"
      className={cn("w-full", className)}
      ref={ref}
      {...rest}
    >
      {reverse ? (
        <>
          {showSpinner ? (
            <div
              data-slot="infinite-scroll-loading"
              className="flex w-full justify-center py-3"
            >
              {loadingSlot ?? (
                <Loader2
                  className="text-muted-foreground size-5 animate-spin"
                  aria-label="Loading"
                />
              )}
            </div>
          ) : null}
          <div
            ref={sentinelRef}
            data-slot="infinite-scroll-sentinel"
            className="h-px w-full"
            aria-hidden="true"
          />
          {children}
        </>
      ) : (
        <>
          {children}
          <div
            ref={sentinelRef}
            data-slot="infinite-scroll-sentinel"
            className="h-px w-full"
            aria-hidden="true"
          />
          {showSpinner ? (
            <div
              data-slot="infinite-scroll-loading"
              className="flex w-full justify-center py-3"
            >
              {loadingSlot ?? (
                <Loader2
                  className="text-muted-foreground size-5 animate-spin"
                  aria-label="Loading"
                />
              )}
            </div>
          ) : null}
          {!hasMore && !loading ? (
            <div
              data-slot="infinite-scroll-end"
              className="text-muted-foreground w-full py-3 text-center text-xs"
            >
              {endSlot ?? "No more items"}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

const InfiniteScroll = React.forwardRef(InfiniteScrollInner) as (<T = any>(
  props: InfiniteScrollProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };
InfiniteScroll.displayName = "InfiniteScroll";

export { InfiniteScroll };
