"use client";

import * as React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- qrcode ships no types unless @types/qrcode (a devDependency) is installed; @ts-ignore stays valid either way
import QRCodeLib from "qrcode";
import { Loader2, RotateCcw, Check, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

export type QRCodeType = "canvas" | "svg";
export type QRCodeStatus = "active" | "expired" | "loading" | "scanned";
export type QRCodeErrorLevel = "L" | "M" | "Q" | "H";

export interface QrCodeProps {
  value: string;
  type?: QRCodeType;
  size?: number;
  color?: string;
  bgColor?: string;
  icon?: string;
  iconSize?: number | { width: number; height: number };
  errorLevel?: QRCodeErrorLevel;
  bordered?: boolean;
  status?: QRCodeStatus;
  marginSize?: number;
  className?: string;
  /** Fired when the "Refresh" action of the expired overlay is clicked. */
  onRefresh?: () => void;
  /** Overrides the default download button (parity with the Vue `extra` slot). */
  extra?: React.ReactNode;
}

const QrCode = React.forwardRef<HTMLDivElement, QrCodeProps>(
  (
    {
      value,
      type = "canvas",
      size = 160,
      color = "#000000",
      bgColor = "#ffffff",
      icon,
      iconSize,
      errorLevel = "M",
      bordered = true,
      status = "active",
      marginSize = 0,
      className,
      onRefresh,
      extra,
    },
    ref,
  ) => {
    const [qrDataUrl, setQrDataUrl] = React.useState("");
    const [qrSvg, setQrSvg] = React.useState("");

    const iconDimensions =
      typeof iconSize === "number"
        ? { width: iconSize, height: iconSize }
        : (iconSize ?? { width: 40, height: 40 });

    React.useEffect(() => {
      let cancelled = false;
      async function generateQR() {
        if (!value || status === "loading") return;
        try {
          const options = {
            width: size,
            margin: marginSize,
            color: { dark: color, light: bgColor },
            errorCorrectionLevel: errorLevel,
          };
          if (type === "svg") {
            const svg = await QRCodeLib.toString(value, {
              type: "svg",
              ...options,
            });
            if (!cancelled) setQrSvg(svg);
          } else {
            const url = await QRCodeLib.toDataURL(value, options);
            if (!cancelled) setQrDataUrl(url);
          }
        } catch (e) {
          console.error("QR Code generation failed:", e);
        }
      }
      generateQR();
      return () => {
        cancelled = true;
      };
    }, [value, type, size, color, bgColor, errorLevel, marginSize, status]);

    function downloadQR() {
      const link = document.createElement("a");
      link.download = `qrcode-${value.slice(0, 20)}.png`;
      link.href = qrDataUrl;
      link.click();
    }

    const statusOverlay = (() => {
      switch (status) {
        case "expired":
          return {
            Icon: RotateCcw,
            text: "Expired",
            action: onRefresh ?? null,
          };
        case "scanned":
          return { Icon: Check, text: "Scanned", action: null };
        case "loading":
          return { Icon: Loader2, text: "Loading...", action: null };
        default:
          return null;
      }
    })();

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="qr-code"
        aria-busy={status === "loading" || undefined}
        className={cn(
          "inline-flex flex-col items-center gap-2",
          bordered && "bg-background rounded-lg border p-4",
          className,
        )}
      >
        <div
          className="relative inline-flex items-center justify-center overflow-hidden"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {/* QR Code */}
          {type === "svg" && qrSvg ? (
            <div
              className="size-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${value}`}
              className="size-full"
            />
          ) : null}

          {/* Icon overlay */}
          {icon && status === "active" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="bg-background overflow-hidden rounded-md shadow-sm"
                style={{
                  width: `${iconDimensions.width}px`,
                  height: `${iconDimensions.height}px`,
                }}
              >
                <img src={icon} alt="" className="size-full object-cover" />
              </div>
            </div>
          )}

          {/* Status overlay */}
          {statusOverlay && (
            <div className="bg-background/90 absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
              <statusOverlay.Icon
                className={cn("size-8", status === "loading" && "animate-spin")}
              />
              <span className="text-foreground text-sm font-medium">
                {statusOverlay.text}
              </span>
              {statusOverlay.action && (
                <button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
                  onClick={statusOverlay.action}
                >
                  <ScanLine className="size-3" />
                  Refresh
                </button>
              )}
            </div>
          )}
        </div>

        {/* Download button (overridable via the `extra` prop) */}
        {extra !== undefined
          ? extra
          : type === "canvas" &&
            status === "active" &&
            qrDataUrl && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                onClick={downloadQR}
              >
                Download
              </button>
            )}
      </div>
    );
  },
);
QrCode.displayName = "QrCode";

export { QrCode };
