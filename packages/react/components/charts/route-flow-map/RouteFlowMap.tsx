import * as React from "react";
import {
  Map,
  MapMarker,
  MapSource,
  MapLayer,
  type MapVariant,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import { Globe, Plane } from "lucide-react";

export interface RouteHub {
  id: string;
  name: string;
  city?: string;
  lat: number;
  lng: number;
  status?: "optimal" | "busy" | "delayed" | string;
  latency?: string | number;
  color?: string;
}

export interface FlightRoute {
  id: string;
  from: string;
  to: string;
  callsign?: string;
  aircraft?: string;
  speed?: string;
  altitude?: string;
  progress?: number;
  eta?: string;
  status?: "en-route" | "scheduled" | "approaching" | "diverted" | string;
  color?: string;
  vehicleType?: "plane" | "ship" | "packet" | "pulse" | "dot";
  duration?: number;
  curvature?: number;
}

export interface RouteFlowMapProps {
  hubs?: RouteHub[];
  routes?: FlightRoute[];
  selectedRoute?: string;
  onSelectedRouteChange?: (id: string) => void;
  onRouteSelect?: (route: FlightRoute) => void;
  onHubClick?: (hub: RouteHub) => void;
  showHubLabels?: boolean;
  showGraticule?: boolean;
  height?: number | string;
  interactive?: boolean;
  className?: string;
  ariaLabel?: string;
  projection?: "globe" | "mercator";
}

export function RouteFlowMap({
  hubs = [],
  routes = [],
  selectedRoute: controlledRoute,
  onSelectedRouteChange,
  onRouteSelect,
  onHubClick,
  showHubLabels = true,
  showGraticule = true,
  height = 480,
  interactive = true,
  projection: initialProjection = "globe",
  className,
}: RouteFlowMapProps) {
  const [internalRoute, setInternalRoute] = React.useState<string>("");
  const [projection, setProjection] = React.useState<"globe" | "mercator">(
    initialProjection,
  );
  const [hoveredHub, setHoveredHub] = React.useState<RouteHub | null>(null);

  const activeRouteId =
    controlledRoute !== undefined ? controlledRoute : internalRoute;

  const hubMap = React.useMemo(() => {
    const map = new globalThis.Map<string, RouteHub>();
    for (const h of hubs) map.set(h.id, h);
    return map;
  }, [hubs]);

  const routesGeoJson = React.useMemo(() => {
    if (!routes || !routes.length) return null;
    return {
      type: "FeatureCollection",
      features: routes
        .map((r) => {
          const fromHub = hubMap.get(r.from);
          const toHub = hubMap.get(r.to);
          if (!fromHub || !toHub) return null;

          const midLng = (fromHub.lng + toHub.lng) / 2;
          const midLat = (fromHub.lat + toHub.lat) / 2 + 10;

          return {
            type: "Feature",
            id: r.id,
            properties: {
              id: r.id,
              color: r.color || "rgba(56, 189, 248, 0.8)",
              selected: activeRouteId === r.id,
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [fromHub.lng, fromHub.lat],
                [midLng, midLat],
                [toHub.lng, toHub.lat],
              ],
            },
          };
        })
        .filter(Boolean),
    };
  }, [routes, hubMap, activeRouteId]);

  const routeLinePaint = React.useMemo(
    () => ({
      "line-color": [
        "case",
        ["==", ["get", "id"], activeRouteId],
        "#38bdf8",
        ["get", "color"],
      ] as any,
      "line-width": [
        "case",
        ["==", ["get", "id"], activeRouteId],
        3,
        1.5,
      ] as any,
      "line-dasharray": [2, 2],
    }),
    [activeRouteId],
  );

  const activeRoute = React.useMemo(
    () => routes.find((r) => r.id === activeRouteId),
    [routes, activeRouteId],
  );

  const handleSelectRoute = (r: FlightRoute) => {
    if (!interactive) return;
    setInternalRoute(r.id);
    onSelectedRouteChange?.(r.id);
    onRouteSelect?.(r);
  };

  const getVehiclePosition = (r: FlightRoute): [number, number] | null => {
    const fromHub = hubMap.get(r.from);
    const toHub = hubMap.get(r.to);
    if (!fromHub || !toHub) return null;
    const progress = (r.progress ?? 50) / 100;
    const lng = fromHub.lng + (toHub.lng - fromHub.lng) * progress;
    const lat =
      fromHub.lat +
      (toHub.lat - fromHub.lat) * progress +
      Math.sin(progress * Math.PI) * 10;
    return [lng, lat];
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
        variant="dark"
        projection={projection}
        center={[10, 25]}
        zoom={1.6}
        className="size-full"
      >
        {routesGeoJson && (
          <MapSource
            id="flight-routes-source"
            type="geojson"
            data={routesGeoJson}
          >
            <MapLayer
              id="flight-routes-layer"
              type="line"
              paint={routeLinePaint}
            />
          </MapSource>
        )}

        {hubs.map((hub) => (
          <MapMarker
            key={hub.id}
            longitude={hub.lng}
            latitude={hub.lat}
            anchor="center"
            className="cursor-pointer select-none"
          >
            <div
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
              onClick={() => onHubClick?.(hub)}
            >
              <span
                className="size-2 rounded-full shadow-xs ring-2"
                style={{
                  backgroundColor: hub.color || "oklch(0.65 0.20 145)",
                  boxShadow: `0 0 8px ${hub.color || "oklch(0.65 0.20 145)"}`,
                }}
              />
              {showHubLabels && (
                <span className="border-border/80 bg-background/85 py-0.2 text-foreground mt-1 rounded border px-1 font-mono text-[9px] font-bold shadow-xs backdrop-blur-xs">
                  {hub.id}
                </span>
              )}
            </div>
          </MapMarker>
        ))}

        {routes.map((r) => {
          const pos = getVehiclePosition(r);
          if (!pos) return null;
          const isSelected = activeRouteId === r.id;

          return (
            <MapMarker
              key={`vehicle-${r.id}`}
              longitude={pos[0]}
              latitude={pos[1]}
              anchor="center"
              className={cn(
                "cursor-pointer transition-transform select-none",
                isSelected ? "z-30 scale-125" : "z-20 hover:scale-110",
              )}
            >
              <div
                className="flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-950/80 px-1.5 py-0.5 shadow-md backdrop-blur-xs"
                onClick={() => handleSelectRoute(r)}
              >
                <Plane className="size-3 rotate-45 text-sky-400" />
                <span className="font-mono text-[9px] font-semibold text-sky-200">
                  {r.callsign || r.id}
                </span>
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

      {activeRoute && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-sky-400" />
                <span className="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                  {activeRoute.callsign || activeRoute.id}
                </span>
                <span className="py-0.2 rounded bg-sky-500/10 px-1.5 font-mono text-[10px] text-sky-400 capitalize">
                  {activeRoute.status || "En-route"}
                </span>
              </div>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 font-mono text-xs">
                <span>{activeRoute.from}</span>
                <span>→</span>
                <span>{activeRoute.to}</span>
                {activeRoute.aircraft && (
                  <span className="text-[10px]">({activeRoute.aircraft})</span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={() => {
                setInternalRoute("");
                onSelectedRouteChange?.("");
              }}
            >
              ✕
            </button>
          </div>

          <div className="border-border/60 mt-3 grid grid-cols-3 gap-2 border-t pt-2 font-mono text-[11px]">
            <div>
              <span className="text-muted-foreground block text-[9px] uppercase">
                Speed
              </span>
              <span className="text-foreground font-semibold">
                {activeRoute.speed || "480 kts"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[9px] uppercase">
                Altitude
              </span>
              <span className="text-foreground font-semibold">
                {activeRoute.altitude || "FL360"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[9px] uppercase">
                ETA
              </span>
              <span className="text-foreground font-semibold">
                {activeRoute.eta || "02h 15m"}
              </span>
            </div>
          </div>
        </div>
      )}

      {hoveredHub && (
        <div className="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150">
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: hoveredHub.color || "oklch(0.65 0.20 145)",
              }}
            />
            <h5 className="text-foreground text-xs font-semibold">
              {hoveredHub.name} ({hoveredHub.id})
            </h5>
          </div>
          {hoveredHub.latency && (
            <div className="mt-1.5 flex items-baseline justify-between font-mono text-xs">
              <span className="text-muted-foreground">Turnaround</span>
              <span className="text-foreground font-semibold">
                {hoveredHub.latency}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RouteFlowMap;
