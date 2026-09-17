"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Placeholder = "skeleton" | "none";

export interface ImgProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  aspectRatio?: string | number;
  width?: string | number;
  height?: string | number;
  placeholder?: Placeholder;
  cover?: boolean;
  eager?: boolean;
  fallback?: string;
  transition?: boolean;
  className?: string;
  imgClassName?: string;
  /** Override the default error fallback (React equivalent of the Vue
   *  `#fallback` named slot). */
  fallbackContent?: React.ReactNode;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

function Img({
  src,
  srcSet,
  sizes,
  alt,
  aspectRatio,
  width,
  height,
  placeholder = "skeleton",
  cover = true,
  eager = false,
  fallback,
  transition = true,
  className,
  imgClassName,
  fallbackContent,
  onLoad,
  onError,
}: ImgProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [state, setState] = React.useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [visible, setVisible] = React.useState(eager);

  const aspectStyle: React.CSSProperties = React.useMemo(() => {
    if (aspectRatio === undefined) return {};
    if (typeof aspectRatio === "number")
      return { aspectRatio: String(aspectRatio) };
    return { aspectRatio };
  }, [aspectRatio]);

  const sizeStyle: React.CSSProperties = React.useMemo(() => {
    const out: React.CSSProperties = {};
    if (width !== undefined)
      out.width = typeof width === "number" ? `${width}px` : width;
    if (height !== undefined)
      out.height = typeof height === "number" ? `${height}px` : height;
    return out;
  }, [width, height]);

  const containerStyle = { ...aspectStyle, ...sizeStyle };

  // Reset + (re)observe when the source changes.
  React.useEffect(() => {
    setState("idle");
    if (eager) {
      setVisible(true);
      return;
    }
    setVisible(false);

    if (typeof IntersectionObserver === "undefined" || !rootRef.current) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [src, eager]);

  // Transition idle -> loading once the element becomes visible.
  React.useEffect(() => {
    if (visible) setState((s) => (s === "idle" ? "loading" : s));
  }, [visible]);

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    setState("loaded");
    onLoad?.(e);
  }

  function handleError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    setState("error");
    onError?.(e);
  }

  return (
    <div
      ref={rootRef}
      data-uipkge=""
      data-slot="lazy-image"
      className={cn("bg-muted relative overflow-hidden", className)}
      style={containerStyle}
    >
      {placeholder === "skeleton" &&
        state !== "loaded" &&
        state !== "error" && (
          <Skeleton className="absolute inset-0 size-full rounded-none" />
        )}

      {visible && state !== "error" && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          className={cn(
            "block size-full",
            cover ? "object-cover" : "object-contain",
            transition && "transition-opacity duration-300",
            state === "loaded" ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {state === "error" &&
        (fallbackContent !== undefined ? (
          fallbackContent
        ) : fallback ? (
          <img
            src={fallback}
            alt={alt}
            className={cn(
              "block size-full",
              cover ? "object-cover" : "object-contain",
              imgClassName,
            )}
          />
        ) : (
          <div
            role="img"
            className="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs"
            aria-label="Image failed to load"
          >
            <span aria-hidden="true">Image unavailable</span>
          </div>
        ))}
    </div>
  );
}

export { Img };
