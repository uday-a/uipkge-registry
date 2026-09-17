"use client";

import * as React from "react";
import type { LineLayerSpecification } from "mapbox-gl";
import {
  Map,
  MapMarker,
  MapSource,
  MapLayer,
  type MapVariant,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export interface MapPin {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  description?: string;
  value?: string | number;
  status?: string;
}

export interface MapRoute {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  color?: string;
  width?: number;
  curvature?: number;
  animated?: boolean;
  dashed?: boolean;
  duration?: number;
  label?: string;
}

export interface DottedMapChartProps {
  pins?: MapPin[];
  routes?: MapRoute[];
  map?: "world" | "usa";
  grid?: "vertical" | "diagonal";
  shape?: "circle" | "hexagon";
  dotColor?: string;
  pulse?: boolean;
  height?: number | string;
  className?: string;
  ariaLabel?: string;
  interactive?: boolean;
  variant?: MapVariant;
  projection?: "globe" | "mercator";
  /** Fired when a pin is clicked. */
  onPinClick?: (pin: MapPin) => void;
  /** Fired with the hovered pin, or null when the pointer leaves it. */
  onPinHover?: (pin: MapPin | null) => void;
}

export function DottedMapChart({
  pins = [],
  routes = [],
  map = "world",
  grid = "vertical",
  shape = "circle",
  dotColor = "rgba(255, 255, 255, 0.22)",
  pulse = true,
  height = 420,
  interactive = true,
  variant = "dark",
  projection: initialProjection = "globe",
  className,
  onPinClick,
  onPinHover,
}: DottedMapChartProps) {
  const [projection, setProjection] = React.useState<"globe" | "mercator">(
    initialProjection,
  );
  const [hoveredPin, setHoveredPin] = React.useState<MapPin | null>(null);

  const mapCenter: [number, number] = React.useMemo(() => {
    return map === "usa" ? [-98, 39] : [0, 20];
  }, [map]);

  const mapZoom = React.useMemo(() => {
    return map === "usa" ? 3.5 : 1.5;
  }, [map]);

  const dotGridGeoJson = React.useMemo(() => {
    const features: any[] = [];
    const step = map === "usa" ? 3 : 6;
    const latMin = map === "usa" ? 25 : -55;
    const latMax = map === "usa" ? 50 : 70;
    const lngMin = map === "usa" ? -125 : -170;
    const lngMax = map === "usa" ? -66 : 170;

    for (let lat = latMin; lat <= latMax; lat += step) {
      for (let lng = lngMin; lng <= lngMax; lng += step) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        });
      }
    }

    return {
      type: "FeatureCollection",
      features,
    };
  }, [map]);

  const routesGeoJson = React.useMemo(() => {
    if (!routes || !routes.length) return null;
    return {
      type: "FeatureCollection",
      features: routes.map((r, i) => ({
        type: "Feature",
        id: i,
        properties: {
          color: r.color || "rgba(56, 189, 248, 0.75)",
          dashed: r.dashed ?? true,
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [r.from.lng, r.from.lat],
            [(r.from.lng + r.to.lng) / 2, (r.from.lat + r.to.lat) / 2 + 5],
            [r.to.lng, r.to.lat],
          ],
        },
      })),
    };
  }, [routes]);

  const dotPaint = React.useMemo(
    () => ({
      "circle-radius": 1.5,
      "circle-color": dotColor || "rgba(255, 255, 255, 0.22)",
      "circle-opacity": 0.4,
    }),
    [dotColor],
  );

  // mapbox reads a data-driven paint value as an expression tuple; without the
  // annotation TS widens ['get', 'color'] to string[] and the layer rejects it.
  const routeLinePaint: LineLayerSpecification["paint"] = {
    "line-color": ["get", "color"],
    "line-width": 1.5,
    "line-dasharray": [2, 2],
  };

  const toggleProjection = () => {
    setProjection((prev) => (prev === "globe" ? "mercator" : "globe"));
  };

  return (
    <div
      className={cn(
        "border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs",
        className,
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <Map
        variant={variant}
        projection={projection}
        center={mapCenter}
        zoom={mapZoom}
        className="size-full"
      >
        <MapSource id="dot-grid-source" type="geojson" data={dotGridGeoJson}>
          <MapLayer id="dot-grid-layer" type="circle" paint={dotPaint} />
        </MapSource>

        {routesGeoJson && (
          <MapSource id="routes-source" type="geojson" data={routesGeoJson}>
            <MapLayer id="routes-layer" type="line" paint={routeLinePaint} />
          </MapSource>
        )}

        {pins.map((pin, i) => (
          <MapMarker
            key={i}
            longitude={pin.lng}
            latitude={pin.lat}
            anchor="center"
            className="cursor-pointer select-none"
          >
            <div
              className="relative flex size-6 items-center justify-center"
              onMouseEnter={() => {
                setHoveredPin(pin);
                onPinHover?.(pin);
              }}
              onMouseLeave={() => {
                setHoveredPin(null);
                onPinHover?.(null);
              }}
              onClick={() => onPinClick?.(pin)}
            >
              {pulse && (
                <span
                  className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                  style={{
                    backgroundColor: pin.color || "oklch(0.65 0.20 145)",
                  }}
                />
              )}
              <span
                className="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
                style={{
                  backgroundColor: pin.color || "oklch(0.65 0.20 145)",
                  boxShadow: `0 0 10px ${pin.color || "oklch(0.65 0.20 145)"}`,
                }}
              />
            </div>
          </MapMarker>
        ))}
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

      {hoveredPin && interactive && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: hoveredPin.color || "oklch(0.65 0.20 145)",
              }}
            />
            <h5 className="text-foreground text-xs font-semibold">
              {hoveredPin.label || "Telemetry Node"}
            </h5>
          </div>
          {hoveredPin.description && (
            <p className="text-muted-foreground mt-1 text-xs">
              {hoveredPin.description}
            </p>
          )}
          {hoveredPin.value !== undefined && (
            <div className="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs">
              <span className="text-muted-foreground">Value</span>
              <span className="text-foreground font-semibold">
                {hoveredPin.value}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DottedMapChart;
