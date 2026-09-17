"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function coverScale(vw: number, vh: number, nw: number, nh: number) {
  if (!nw || !nh) return 1;
  return Math.max(vw / nw, vh / nh);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export interface ImageCropperProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  src: string;
  alt?: string;
  aspectRatio?: number;
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
  disabled?: boolean;
  showZoom?: boolean;
  rounded?: "lg" | "full";
}

export interface ImageCropperHandle {
  getCroppedCanvas: () => HTMLCanvasElement | null;
  getCroppedBlob: (type?: string, quality?: number) => Promise<Blob | null>;
}

const ImageCropper = React.forwardRef<ImageCropperHandle, ImageCropperProps>(
  (
    {
      src,
      alt = "",
      aspectRatio = 1,
      zoom: zoomProp,
      defaultZoom = 1,
      onZoomChange,
      minZoom = 1,
      maxZoom = 4,
      disabled = false,
      showZoom = false,
      rounded = "lg",
      className,
      ...props
    },
    ref,
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const [uncontrolledZoom, setUncontrolledZoom] = React.useState(defaultZoom);
    const zoom = zoomProp ?? uncontrolledZoom;
    const [pan, setPan] = React.useState({ x: 0, y: 0 });
    const [natural, setNatural] = React.useState({ w: 0, h: 0 });
    const dragging = React.useRef(false);
    const lastPointer = React.useRef({ x: 0, y: 0 });
    const panRef = React.useRef(pan);
    panRef.current = pan;

    const setZoom = React.useCallback(
      (value: number) => {
        const next = clamp(value, minZoom, maxZoom);
        onZoomChange?.(next);
        if (zoomProp === undefined) setUncontrolledZoom(next);
      },
      [maxZoom, minZoom, onZoomChange, zoomProp],
    );

    const clampPan = React.useCallback(
      (next = panRef.current) => {
        const el = viewportRef.current;
        if (!el || !natural.w) return next;
        const vw = el.clientWidth;
        const vh = el.clientHeight;
        const scale = coverScale(vw, vh, natural.w, natural.h) * zoom;
        const dw = natural.w * scale;
        const dh = natural.h * scale;
        const maxX = Math.abs(vw - dw) / 2;
        const maxY = Math.abs(vh - dh) / 2;
        return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) };
      },
      [natural.h, natural.w, zoom],
    );

    React.useEffect(() => {
      setPan((p) => clampPan(p));
    }, [clampPan, zoom]);

    const imgStyle = React.useMemo(() => {
      const el = viewportRef.current;
      if (!el || !natural.w) return { transform: "translate(-50%, -50%)" };
      const scale =
        coverScale(el.clientWidth, el.clientHeight, natural.w, natural.h) *
        zoom;
      return {
        width: `${natural.w * scale}px`,
        height: `${natural.h * scale}px`,
        transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`,
      };
    }, [natural.h, natural.w, pan.x, pan.y, zoom]);

    const cropCanvas = React.useCallback(() => {
      const el = viewportRef.current;
      const img = imgRef.current;
      if (!el || !img || !natural.w) return null;
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      const scale = coverScale(vw, vh, natural.w, natural.h) * zoom;
      const dw = natural.w * scale;
      const dh = natural.h * scale;
      const left = (vw - dw) / 2 + pan.x;
      const top = (vh - dh) / 2 + pan.y;
      const sw = vw / scale;
      const sh = vh / scale;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(sw));
      canvas.height = Math.max(1, Math.round(sh));
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(
        img,
        -left / scale,
        -top / scale,
        sw,
        sh,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      return canvas;
    }, [natural.h, natural.w, pan.x, pan.y, zoom]);

    React.useImperativeHandle(
      ref,
      () => ({
        getCroppedCanvas: cropCanvas,
        getCroppedBlob(type = "image/png", quality?: number) {
          return new Promise((resolve) => {
            const canvas = cropCanvas();
            if (!canvas) {
              resolve(null);
              return;
            }
            canvas.toBlob((blob) => resolve(blob), type, quality);
          });
        },
      }),
      [cropCanvas],
    );

    return (
      <div
        data-uipkge=""
        data-slot="image-cropper"
        className={cn("flex w-full max-w-md flex-col gap-3", className)}
        {...props}
      >
        <div
          ref={viewportRef}
          data-slot="image-cropper-viewport"
          role="application"
          aria-label="Image crop viewport"
          tabIndex={0}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            "bg-muted relative w-full overflow-hidden select-none",
            rounded === "full" ? "rounded-full" : "rounded-lg",
            disabled
              ? "pointer-events-none opacity-60"
              : "cursor-grab active:cursor-grabbing",
          )}
          style={{ aspectRatio: String(aspectRatio) }}
          onPointerDown={(e) => {
            if (disabled) return;
            dragging.current = true;
            lastPointer.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            const next = {
              x: panRef.current.x + (e.clientX - lastPointer.current.x),
              y: panRef.current.y + (e.clientY - lastPointer.current.y),
            };
            lastPointer.current = { x: e.clientX, y: e.clientY };
            setPan(clampPan(next));
          }}
          onPointerUp={(e) => {
            dragging.current = false;
            try {
              e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
              /* already released */
            }
          }}
          onWheel={(e) => {
            if (disabled) return;
            e.preventDefault();
            setZoom(zoom + (e.deltaY > 0 ? -0.12 : 0.12));
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            const step = 8;
            if (e.key === "ArrowLeft")
              setPan((p) => clampPan({ ...p, x: p.x - step }));
            if (e.key === "ArrowRight")
              setPan((p) => clampPan({ ...p, x: p.x + step }));
            if (e.key === "ArrowUp")
              setPan((p) => clampPan({ ...p, y: p.y - step }));
            if (e.key === "ArrowDown")
              setPan((p) => clampPan({ ...p, y: p.y + step }));
            if (e.key === "+" || e.key === "=") setZoom(zoom + 0.2);
            if (e.key === "-" || e.key === "_") setZoom(zoom - 0.2);
          }}
        >
          <img
            ref={imgRef}
            data-slot="image-cropper-image"
            src={src}
            alt={alt}
            draggable={false}
            className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
            style={imgStyle}
            onLoad={(e) => {
              const img = e.currentTarget;
              setNatural({ w: img.naturalWidth, h: img.naturalHeight });
              setPan({ x: 0, y: 0 });
            }}
          />
        </div>
        {showZoom ? (
          <label
            data-slot="image-cropper-zoom"
            className="text-muted-foreground flex items-center gap-3 text-xs"
          >
            <span className="w-10">Zoom</span>
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step={0.05}
              value={zoom}
              className="accent-primary h-1.5 w-full cursor-pointer"
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span className="w-10 tabular-nums">{zoom.toFixed(1)}×</span>
          </label>
        ) : null}
      </div>
    );
  },
);
ImageCropper.displayName = "ImageCropper";

export { ImageCropper };
