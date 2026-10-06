import type { AngularStory } from './stories'

/** Story cards for the leaflet-map Angular demo (titles + descriptions mirror demos/react/leaflet-map.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default — theme-aware',
    description:
      'Free Esri light/dark canvas tiles follow the app theme automatically. No API key, no token, no setup.',
  },
  {
    title: 'Basemap Variants',
    description: 'Every key-free tile preset: OpenStreetMap, Esri Gray Canvas/Street/Imagery, and OpenTopoMap.',
  },
  {
    title: 'Markers & Popups',
    description:
      'LeafletMarker renders real DOM into a div icon — buttons, badges, and Angular bindings all keep working.',
  },
  {
    title: 'Tooltips',
    description: 'LeafletTooltip binds to the nearest ancestor layer — or floats standalone at a coordinate.',
  },
  {
    title: 'Route Layer',
    description: 'LeafletPolyline draws a cased route line; waypoint markers pin the endpoints.',
  },
  {
    title: 'GeoJSON Zones',
    description: 'LeafletGeoJson renders FeatureCollections; onEachFeature / style options map properties to paint.',
  },
  {
    title: 'Circles & Radii',
    description: 'LeafletCircle is meter-accurate coverage rings around a point.',
  },
  {
    title: 'Custom Tile Layer',
    description: 'LeafletTileLayer stacks extra raster layers on top of the basemap.',
  },
  {
    title: 'World View — Compact',
    description: 'size presets (sm/lg/xl/full) or your own className; min-zoom clamps keep the canvas sane.',
  },
  {
    title: 'Polygon Boundary',
    description: 'LeafletPolygon renders cadastral-style boundaries; dashed rings read as restricted airspace.',
  },
]
