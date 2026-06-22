import { cva, type VariantProps } from 'class-variance-authority'

export type LeafletMapVariant =
  | 'default'
  | 'muted'
  | 'streets'
  | 'outdoors'
  | 'light'
  | 'dark'
  | 'satellite'
  | 'satellite-streets'
  | 'navigation-day'
  | 'navigation-night'
  | 'standard'

export interface LeafletTilePreset {
  /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
  url: string
  /** Required provider attribution HTML. */
  attribution: string
  subdomains?: string | string[]
  maxZoom?: number
  /** Optional label/boundary overlay composited above the base tiles. */
  overlayUrl?: string
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const TOPO_ATTR = `${OSM_ATTR} | map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
const ESRI_ATTR = 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'

const OSM_STANDARD: LeafletTilePreset = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: OSM_ATTR,
  maxZoom: 19,
}
// CARTO basemaps moved behind an API key — Esri Canvas/Street services stay key-free.
const ESRI_LIGHT: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 16,
  overlayUrl:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
}
const ESRI_DARK: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 16,
  overlayUrl:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
}
const ESRI_STREETS: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 19,
}
const ESRI_SATELLITE: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 19,
}

export const LEAFLET_TILES: Record<Exclude<LeafletMapVariant, 'default' | 'muted'>, LeafletTilePreset> = {
  streets: OSM_STANDARD,
  standard: OSM_STANDARD,
  outdoors: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: TOPO_ATTR,
    subdomains: 'abc',
    maxZoom: 17,
  },
  light: ESRI_LIGHT,
  dark: ESRI_DARK,
  satellite: ESRI_SATELLITE,
  'satellite-streets': {
    ...ESRI_SATELLITE,
    overlayUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  },
  'navigation-day': ESRI_STREETS,
  'navigation-night': ESRI_DARK,
}

/** Theme-aware default tiles: Esri light/dark canvas following the app theme. */
export const LEAFLET_THEME_TILES = { light: ESRI_LIGHT, dark: ESRI_DARK }

export const leafletMapVariants = cva('relative size-full overflow-hidden bg-muted isolate', {
  variants: {
    variant: {
      default: '',
      muted: '',
      streets: '',
      outdoors: '',
      light: '',
      dark: '',
      satellite: '',
      'satellite-streets': '',
      'navigation-day': '',
      'navigation-night': '',
      standard: '',
    },
    size: {
      default: 'h-96 w-full',
      sm: 'h-64 w-full',
      lg: 'h-[500px] w-full',
      xl: 'h-[650px] w-full',
      full: 'size-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type LeafletMapVariants = VariantProps<typeof leafletMapVariants>
