import * as React from "react";
import { Map, MapMarker, type MapVariant } from "@/components/ui/map";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export interface MapBubble {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  formattedValue?: string;
  category?: string;
  status?: "optimal" | "warning" | "destructive" | "neutral" | "active";
  color?: string;
  pulse?: boolean;
  description?: string;
}

export interface BubbleMapProps {
  bubbles?: MapBubble[];
  minRadius?: number;
  maxRadius?: number;
  showLegend?: boolean;
  legendTitle?: string;
  selectedId?: string;
  onSelectedIdChange?: (id: string | undefined) => void;
  onSelect?: (bubble: MapBubble) => void;
  interactive?: boolean;
  projection?: "globe" | "mercator";
  variant?: MapVariant;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  optimal: "oklch(0.65 0.20 145)",
  active: "oklch(0.60 0.20 250)",
  warning: "oklch(0.75 0.18 65)",
  destructive: "oklch(0.60 0.22 25)",
  neutral: "oklch(0.65 0.05 240)",
};

function getBubbleColor(b: MapBubble): string {
  if (b.color) return b.color;
  if (b.status && STATUS_COLORS[b.status]) return STATUS_COLORS[b.status];
  return "oklch(0.60 0.20 250)";
}

export function BubbleMap({
  bubbles = [],
  minRadius = 10,
  maxRadius = 42,
  showLegend = true,
  legendTitle = "Scale by Magnitude",
  selectedId: controlledSelectedId,
  onSelectedIdChange,
  onSelect,
  interactive = true,
  projection: initialProjection = "globe",
  variant = "dark",
  center = [0, 20],
  zoom = 1.5,
  className,
}: BubbleMapProps) {
  const [internalSelectedId, setInternalSelectedId] = React.useState<
    string | undefined
  >(controlledSelectedId);
  const [projection, setProjection] = React.useState<"globe" | "mercator">(
    initialProjection,
  );

  const activeId =
    controlledSelectedId !== undefined
      ? controlledSelectedId
      : internalSelectedId;

  const values = React.useMemo(() => bubbles.map((b) => b.value), [bubbles]);
  const minValue = React.useMemo(
    () => (values.length ? Math.min(...values) : 1),
    [values],
  );
  const maxValue = React.useMemo(
    () => (values.length ? Math.max(...values) : 100),
    [values],
  );

  const getRadius = React.useCallback(
    (val: number): number => {
      if (maxValue === minValue) return (minRadius + maxRadius) / 2;
      const ratio = Math.sqrt(
        Math.max(0, val - minValue) / (maxValue - minValue),
      );
      return Math.round(minRadius + ratio * (maxRadius - minRadius));
    },
    [minValue, maxValue, minRadius, maxRadius],
  );

  const activeBubble = React.useMemo(
    () => bubbles.find((b) => b.id === activeId),
    [bubbles, activeId],
  );

  const handleSelect = (b: MapBubble) => {
    if (!interactive) return;
    setInternalSelectedId(b.id);
    onSelectedIdChange?.(b.id);
    onSelect?.(b);
  };

  const toggleProjection = () => {
    setProjection((prev) => (prev === "globe" ? "mercator" : "globe"));
  };

  return (
    <div
      className={cn(
        "border-border bg-card group relative h-[420px] w-full overflow-hidden rounded-xl border shadow-xs",
        className,
      )}
    >
      <Map
        variant={variant}
        projection={projection}
        center={center}
        zoom={zoom}
        className="size-full"
      >
        {bubbles.map((b) => {
          const radius = getRadius(b.value);
          const isSelected = activeId === b.id;
          const color = getBubbleColor(b);

          return (
            <MapMarker
              key={b.id}
              longitude={b.lng}
              latitude={b.lat}
              anchor="center"
              className={cn(
                "cursor-pointer transition-transform select-none",
                isSelected ? "z-30 scale-110" : "z-20 hover:scale-105",
              )}
            >
              <div
                className="relative flex items-center justify-center"
                style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                onClick={() => handleSelect(b)}
              >
                {b.pulse && (
                  <span
                    className="absolute inline-flex size-full animate-ping rounded-full opacity-40"
                    style={{ backgroundColor: color }}
                  />
                )}

                <div
                  className="absolute inset-0 rounded-full opacity-25"
                  style={{ backgroundColor: color }}
                />

                <div
                  className="relative flex size-4/5 items-center justify-center rounded-full border border-white/40 shadow-sm backdrop-blur-[1px] transition-all"
                  style={{
                    backgroundColor: color,
                    boxShadow: isSelected ? `0 0 16px ${color}` : "none",
                  }}
                >
                  {radius >= 20 ? (
                    <span className="px-1 text-center font-mono text-[10px] font-bold text-white drop-shadow-xs">
                      {b.formattedValue || b.value}
                    </span>
                  ) : (
                    <span className="size-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </div>
              </div>
            </MapMarker>
          );
        })}
      </Map>

      <div className="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md">
        <button
          type="button"
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
          onClick={toggleProjection}
        >
          <Globe className="size-3.5" />
          <span className="capitalize">{projection}</span>
        </button>
      </div>

      {activeBubble && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full ring-2 ring-white/20"
                  style={{ backgroundColor: getBubbleColor(activeBubble) }}
                />
                <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {activeBubble.category || "Node"}
                </span>
              </div>
              <h4 className="text-foreground mt-0.5 text-sm font-semibold">
                {activeBubble.name}
              </h4>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={() => {
                setInternalSelectedId(undefined);
                onSelectedIdChange?.(undefined);
              }}
            >
              ✕
            </button>
          </div>

          <div className="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
            <span className="text-muted-foreground">Magnitude</span>
            <span className="text-foreground font-semibold">
              {activeBubble.formattedValue ||
                activeBubble.value.toLocaleString()}
            </span>
          </div>

          {activeBubble.description && (
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {activeBubble.description}
            </p>
          )}
        </div>
      )}

      {showLegend && bubbles.length > 0 && (
        <div className="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-3 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex">
          <span className="text-muted-foreground font-mono text-[11px]">
            {legendTitle}
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-muted-foreground/40 size-2 rounded-full" />
            <span className="text-muted-foreground font-mono text-[10px]">
              {minValue.toLocaleString()}
            </span>
            <span className="bg-muted-foreground/60 size-4 rounded-full" />
            <span className="text-foreground font-mono text-[10px] font-semibold">
              {maxValue.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function projectPoint(
  lat: number,
  lng: number,
): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

export const CONTINENT_LANDMASSES: Array<{
  id: string;
  name: string;
  d: string;
}> = [];
export default BubbleMap;
