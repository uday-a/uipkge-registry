import * as React from 'react'
import type mapboxgl from 'mapbox-gl'
import Map, {
  Marker as MapboxMarker,
  Popup as MapboxPopup,
  Source as MapboxSource,
  Layer as MapboxLayer,
  NavigationControl as MapboxNavigationControl,
  FullscreenControl as MapboxFullscreenControl,
  type MapRef,
  type MapProps as MapboxMapProps,
  type MarkerProps as MapboxMarkerProps,
  type PopupProps as MapboxPopupProps,
  type SourceProps as MapboxSourceProps,
  type LayerProps as MapboxLayerProps,
} from 'react-map-gl/mapbox'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { mapVariants, MAPBOX_STYLES, type MapVariant, type MapVariants } from './map.variants'
import 'mapbox-gl/dist/mapbox-gl.css'
import './map.css'

export interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mapbox access token. */
  accessToken?: string
  /** Named Mapbox basemap variant preset ('streets' | 'outdoors' | 'satellite' | 'satellite-streets' | 'light' | 'dark' | 'navigation-day' | 'navigation-night' | 'standard' | 'muted' | 'default'). */
  variant?: MapVariant
  /** Height preset. Omit to size via `className` (blocks typically pass `size-full`). */
  size?: MapVariants['size']
  /** Override the base style with a custom style URL. Defaults to variant or theme-aware light/dark style. */
  mapStyle?: string
  /** Initial [lng, lat]. */
  center?: [number, number]
  zoom?: number
  /** Camera pitch tilt angle in degrees (0 - 85). */
  pitch?: number
  /** Camera bearing rotation angle in degrees (0 - 360). */
  bearing?: number
  /** Automatically add 3D extruded building footprints. */
  buildings3d?: boolean
  /** Enable 3D digital elevation model terrain mesh. */
  terrain3d?: boolean
  /** 'mercator' (flat) or 'globe'. */
  projection?: string
  /** Show the zoom/compass control. */
  navigation?: boolean
  /** Placement position of the navigation control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). Defaults to 'bottom-right'. */
  navigationPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Explicitly show/hide compass in navigation control. Defaults to true when pitch > 0. */
  showCompass?: boolean
  /** Explicitly show/hide zoom buttons in navigation control. Defaults to true. */
  showZoom?: boolean
  /** Show the HTML5 fullscreen toggle control button. */
  fullscreen?: boolean
  /** Placement position of the fullscreen control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). Defaults to 'top-right'. */
  fullscreenPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Repaint the basemap to a quiet, desaturated canvas. */
  muted?: boolean
  /** Hands you the raw mapbox-gl Map instance once the style has loaded. */
  onCreated?: (map: mapboxgl.Map) => void
}

/** Desaturate the basemap to a quiet canvas. Each op is guarded — style layer
 *  ids drift between style versions and the wrong property for a layer type
 *  throws. */
function applyMuted(map: mapboxgl.Map, dark: boolean) {
  let styleLayers: any[]
  try {
    styleLayers = map.getStyle()?.layers ?? []
  } catch {
    return // style not loaded yet
  }
  const P = dark
    ? {
        land: 'rgb(23,24,29)',
        water: 'rgb(17,18,22)',
        use: 'rgb(31,32,38)',
        road: 'rgb(50,52,60)',
        label: 'rgb(150,152,165)',
        halo: 'rgb(23,24,29)',
        admin: 'rgb(50,52,60)',
      }
    : {
        land: 'rgb(246,247,249)',
        water: 'rgb(226,230,235)',
        use: 'rgb(238,240,243)',
        road: 'rgb(221,224,229)',
        label: 'rgb(120,124,134)',
        halo: 'rgb(246,247,249)',
        admin: 'rgb(213,216,221)',
      }
  for (const l of styleLayers) {
    const id = l.id
    try {
      if (id === 'background' || id === 'land') map.setPaintProperty(id, 'background-color', P.land)
      else if (/water/.test(id) && l.type === 'fill') map.setPaintProperty(id, 'fill-color', P.water)
      else if (/landuse|landcover|national-park/.test(id) && l.type === 'fill')
        map.setPaintProperty(id, 'fill-color', P.use)
      else if (/^road-(motorway|trunk|primary)/.test(id) && l.type === 'line') {
        map.setPaintProperty(id, 'line-color', P.road)
        map.setPaintProperty(id, 'line-opacity', 0.55)
      } else if (/^road-(secondary|tertiary|street|minor|service|path|pedestrian)/.test(id)) {
        map.setLayoutProperty(id, 'visibility', 'none')
      } else if (/poi|transit|airport|natural-point|water-point|waterway-label|building/.test(id)) {
        map.setLayoutProperty(id, 'visibility', 'none')
      } else if (
        /road-label|settlement-major-label|settlement-minor-label|state-label/.test(id) &&
        l.type === 'symbol'
      ) {
        map.setPaintProperty(id, 'text-color', P.label)
        map.setPaintProperty(id, 'text-halo-color', P.halo)
        map.setPaintProperty(id, 'text-opacity', 0.6)
      } else if (id === 'admin-1-boundary' && l.type === 'line') {
        map.setPaintProperty(id, 'line-color', P.admin)
        map.setPaintProperty(id, 'line-opacity', 0.6)
      } else if (id === 'admin-1-boundary-bg') map.setPaintProperty(id, 'line-opacity', 0)
    } catch {
      /* skip */
    }
  }
}

function apply3DBuildings(map: mapboxgl.Map, dark: boolean) {
  if (map.getLayer('3d-buildings')) return
  const layers = map.getStyle()?.layers
  let labelLayerId: string | undefined
  if (layers) {
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && (layers[i].layout as any)?.['text-field']) {
        labelLayerId = layers[i].id
        break
      }
    }
  }
  try {
    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': dark ? '#27272a' : '#d4d4d8',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.8,
        },
      },
      labelLayerId,
    )
  } catch {
    /* building layer not present in raster styles */
  }
}

function apply3DTerrain(map: mapboxgl.Map) {
  try {
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
  } catch {
    /* terrain not supported in current projection */
  }
}

const DEFAULT_MAPBOX_TOKEN = ''

const MapComponent = React.forwardRef<MapRef, MapProps>(
  (
    {
      className,
      accessToken,
      variant = 'default',
      size,
      mapStyle,
      center = [0, 20],
      zoom = 1.4,
      pitch = 0,
      bearing = 0,
      buildings3d = false,
      terrain3d = false,
      projection = 'mercator',
      navigation = true,
      navigationPosition = 'bottom-right',
      showCompass,
      showZoom = true,
      fullscreen = false,
      fullscreenPosition = 'top-right',
      muted = false,
      onCreated,
      children,
      ...props
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme()
    const [htmlDark, setHtmlDark] = React.useState(false)
    const isDark = resolvedTheme === 'dark' || htmlDark
    const isMuted = muted || variant === 'muted'

    const resolvedToken =
      accessToken === ''
        ? ''
        : accessToken ||
          (typeof process !== 'undefined' &&
            (process.env?.NEXT_PUBLIC_MAPBOX_TOKEN || process.env?.PUBLIC_MAPBOX_TOKEN)) ||
          (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_MAPBOX_TOKEN) ||
          DEFAULT_MAPBOX_TOKEN

    const resolvedStyle = React.useMemo(() => {
      if (mapStyle) return mapStyle
      if (
        variant &&
        variant !== 'default' &&
        variant !== 'muted' &&
        MAPBOX_STYLES[variant as keyof typeof MAPBOX_STYLES]
      ) {
        return MAPBOX_STYLES[variant as keyof typeof MAPBOX_STYLES]
      }
      return isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
    }, [mapStyle, variant, isDark])

    const [mounted, setMounted] = React.useState(false)
    const [inView, setInView] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
      const root = document.documentElement
      const sync = () => setHtmlDark(root.classList.contains('dark'))
      sync()
      setMounted(true)
      const obs = new MutationObserver(sync)
      obs.observe(root, { attributes: true, attributeFilter: ['class'] })
      return () => obs.disconnect()
    }, [])
    React.useEffect(() => {
      const el = containerRef.current
      if (!el) {
        setInView(true)
        return
      }
      if (typeof IntersectionObserver === 'undefined') {
        setInView(true)
        return
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting)
        },
        { rootMargin: '160px', threshold: 0.01 },
      )
      io.observe(el)
      return () => io.disconnect()
    }, [])

    const mapRef = React.useRef<MapRef | null>(null)
    // react-map-gl fills its ref only once the map instance exists, which is
    // after this component's imperative handle has already published. Without a
    // re-render the caller's ref would stay null forever and every ref-driven
    // camera move (flyTo, fitBounds) would silently no-op.
    const [mapReady, setMapReady] = React.useState(false)

    const onLoad = React.useCallback(() => {
      setMapReady(true)
      const map = mapRef.current?.getMap()
      if (!map) return
      try {
        ;(map as any).setProjection(projection)
      } catch {
        /* older api */
      }
      if (pitch) {
        try {
          map.setPitch(pitch)
        } catch {
          /* ignore */
        }
      }
      if (bearing) {
        try {
          map.setBearing(bearing)
        } catch {
          /* ignore */
        }
      }
      if (isMuted) applyMuted(map, isDark)
      if (buildings3d) apply3DBuildings(map, isDark)
      if (terrain3d) apply3DTerrain(map)
      onCreated?.(map)
    }, [projection, pitch, bearing, isMuted, isDark, buildings3d, terrain3d, onCreated])

    const onStyleData = React.useCallback(() => {
      const map = mapRef.current?.getMap()
      if (!map) return
      if (isMuted) applyMuted(map, isDark)
      if (buildings3d) apply3DBuildings(map, isDark)
      if (terrain3d) apply3DTerrain(map)
    }, [isMuted, isDark, buildings3d, terrain3d])

    React.useEffect(() => {
      const map = mapRef.current?.getMap()
      if (map && pitch !== undefined) {
        try {
          map.setPitch(pitch)
        } catch {
          /* ignore */
        }
      }
    }, [pitch])

    React.useImperativeHandle(ref, () => mapRef.current as MapRef, [mapReady])

    React.useEffect(() => {
      const container = containerRef.current
      if (!container || typeof ResizeObserver === 'undefined') return
      const ro = new ResizeObserver(() => {
        const map = mapRef.current?.getMap()
        map?.resize()
      })
      ro.observe(container)
      return () => {
        ro.disconnect()
      }
    }, [mounted])

    React.useEffect(() => {
      const map = mapRef.current?.getMap()
      if (map && bearing !== undefined) {
        try {
          map.setBearing(bearing)
        } catch {
          /* ignore */
        }
      }
    }, [bearing])

    return (
      <div
        ref={containerRef}
        data-uipkge=""
        data-slot="map"
        data-variant={variant}
        data-muted={isMuted}
        className={cn(mapVariants({ variant, ...(size ? { size } : {}) }), className)}
        {...props}
      >
        {mounted && inView && resolvedToken && (
          <Map
            ref={mapRef}
            mapboxAccessToken={resolvedToken}
            mapStyle={resolvedStyle}
            initialViewState={{ longitude: center[0], latitude: center[1], zoom, pitch, bearing }}
            attributionControl={false}
            style={{ width: '100%', height: '100%' }}
            onLoad={onLoad}
            onStyleData={onStyleData}
          >
            {navigation && (
              <MapboxNavigationControl
                position={navigationPosition}
                showCompass={showCompass !== undefined ? showCompass : (pitch ?? 0) > 0}
                showZoom={showZoom}
              />
            )}
            {fullscreen && <MapboxFullscreenControl position={fullscreenPosition} />}
            {children}
          </Map>
        )}
        {mounted && !resolvedToken && (
          <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-1 px-6 text-center text-sm">
            <span className="text-foreground font-medium">Mapbox token required</span>
            <span>Pass an access token to render the map.</span>
          </div>
        )}
      </div>
    )
  },
)
MapComponent.displayName = 'Map'

export type MapMarkerProps =
  | (Omit<MapboxMarkerProps, 'longitude' | 'latitude'> & {
      /** [lng, lat] — matches the Vue side's `:lng-lat` prop. */
      lngLat: [number, number]
    })
  | MapboxMarkerProps

/** Marker accepting a `lngLat` tuple for parity with the Vue marker prop. */
const MapMarkerComponent = React.forwardRef<mapboxgl.Marker, MapMarkerProps>(
  ({ lngLat, ...props }: MapMarkerProps & { lngLat?: [number, number] }, ref) =>
    lngLat ? (
      <MapboxMarker ref={ref} longitude={lngLat[0]} latitude={lngLat[1]} {...props} />
    ) : (
      <MapboxMarker ref={ref} {...(props as MapboxMarkerProps)} />
    ),
)
MapMarkerComponent.displayName = 'MapMarker'

export type MapPopupProps =
  | (Omit<MapboxPopupProps, 'longitude' | 'latitude'> & {
      /** [lng, lat] — matches the Vue side's `:lng-lat` prop. */
      lngLat: [number, number]
    })
  | MapboxPopupProps

/** Popup accepting a `lngLat` tuple for parity with the Vue popup prop. */
const MapPopupComponent = React.forwardRef<mapboxgl.Popup, MapPopupProps>(
  ({ lngLat, ...props }: MapPopupProps & { lngLat?: [number, number] }, ref) =>
    lngLat ? (
      <MapboxPopup ref={ref} longitude={lngLat[0]} latitude={lngLat[1]} {...props} />
    ) : (
      <MapboxPopup ref={ref} {...(props as MapboxPopupProps)} />
    ),
)
MapPopupComponent.displayName = 'MapPopup'

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

type MapSourceOptions = DistributiveOmit<MapboxSourceProps, 'id'>
export type MapSourceProps =
  | (MapSourceOptions & { id: string; options?: undefined })
  | {
      id: string
      /** Source spec — matches the Vue side's `:options` prop. */
      options: MapSourceOptions
      children?: React.ReactNode
    }

/** Source accepting either a Vue-parity `options` spec or direct props. */
function MapSourceComponent({ id, options, ...rest }: MapSourceProps & { options?: MapSourceOptions }) {
  return <MapboxSource id={id} {...(options as object)} {...(rest as MapboxSourceProps)} />
}

type MapLayerOptions = DistributiveOmit<MapboxLayerProps, 'id'>
export type MapLayerProps =
  | (MapLayerOptions & { id: string; options?: undefined })
  | {
      id: string
      /** Layer spec — matches the Vue side's `:options` prop. */
      options: MapLayerOptions
    }

/** Layer accepting either a Vue-parity `options` spec or direct props. */
function MapLayerComponent({ id, options, ...rest }: MapLayerProps & { options?: MapLayerOptions }) {
  return <MapboxLayer {...({ id, ...options, ...rest } as MapboxLayerProps)} />
}

export {
  MapComponent as Map,
  MapMarkerComponent as MapMarker,
  MapPopupComponent as MapPopup,
  MapSourceComponent as MapSource,
  MapLayerComponent as MapLayer,
}
export type { MapboxMapProps }
