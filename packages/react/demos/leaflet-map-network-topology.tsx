import Story from '../../components/story/Story'
import { LeafletMap, LeafletMarker, LeafletPopup, LeafletPolyline } from '@/components/ui/leaflet-map'

// Global multi-region cloud topology on the free Esri dark canvas.
const regions = [
  {
    code: 'us-east-1',
    name: 'N. Virginia',
    coords: [-77.04, 38.9] as [number, number],
    ping: '12ms',
    uptime: '99.99%',
    loss: '0.0%',
  },
  {
    code: 'us-west-2',
    name: 'Oregon',
    coords: [-122.67, 45.52] as [number, number],
    ping: '28ms',
    uptime: '99.98%',
    loss: '0.1%',
  },
  {
    code: 'eu-west-1',
    name: 'Ireland',
    coords: [-6.26, 53.34] as [number, number],
    ping: '64ms',
    uptime: '99.99%',
    loss: '0.0%',
  },
  {
    code: 'eu-central-1',
    name: 'Frankfurt',
    coords: [8.68, 50.11] as [number, number],
    ping: '72ms',
    uptime: '99.97%',
    loss: '0.2%',
  },
  {
    code: 'ap-southeast-1',
    name: 'Singapore',
    coords: [103.82, 1.35] as [number, number],
    ping: '98ms',
    uptime: '99.95%',
    loss: '0.3%',
  },
  {
    code: 'ap-northeast-1',
    name: 'Tokyo',
    coords: [139.69, 35.68] as [number, number],
    ping: '112ms',
    uptime: '99.98%',
    loss: '0.1%',
  },
  {
    code: 'ap-southeast-2',
    name: 'Sydney',
    coords: [151.21, -33.87] as [number, number],
    ping: '148ms',
    uptime: '99.96%',
    loss: '0.2%',
  },
  {
    code: 'sa-east-1',
    name: 'São Paulo',
    coords: [-46.63, -23.55] as [number, number],
    ping: '135ms',
    uptime: '99.94%',
    loss: '0.4%',
  },
]

const byCode = Object.fromEntries(regions.map((r) => [r.code, r]))

// Backbone links — straight polylines (Leaflet has no great-circle arcs), drawn
// as a multi-part path so the casing + inner line each need one layer.
const links: [string, string][] = [
  ['us-east-1', 'eu-west-1'],
  ['eu-west-1', 'eu-central-1'],
  ['eu-central-1', 'ap-southeast-1'],
  ['ap-southeast-1', 'ap-northeast-1'],
  ['ap-southeast-1', 'ap-southeast-2'],
  ['ap-northeast-1', 'us-west-2'],
  ['us-west-2', 'us-east-1'],
  ['us-east-1', 'sa-east-1'],
  ['eu-central-1', 'ap-northeast-1'],
]
const linkPaths = links.map(([a, b]) => [byCode[a].coords, byCode[b].coords])

export default function LeafletMapNetworkTopologyDemo() {
  return (
    <Story
      title="Global Network Topology"
      description="Multi-region cloud infrastructure nodes with pulsing status rings, cased backbone links, and latency popups — all on key-free tiles."
    >
      <LeafletMap variant="dark" center={[20, 20]} zoom={1.5} className="h-96 w-full rounded-lg border">
        {/* Dashed low-opacity casing + brighter inner line. */}
        <LeafletPolyline
          lngLatPath={linkPaths}
          color="#38bdf8"
          weight={6}
          opacity={0.12}
          dashArray="2 10"
          lineCap="round"
        />
        <LeafletPolyline lngLatPath={linkPaths} color="#7dd3fc" weight={1.5} opacity={0.9} lineCap="round" />

        {regions.map((r) => (
          <LeafletMarker key={r.code} lngLat={r.coords} anchor="center">
            <div className="flex cursor-pointer flex-col items-center">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-3 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
              </span>
              <div className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap shadow-xs">
                <span className="text-foreground font-bold">{r.name}</span>
                <span className="ml-1 font-semibold text-emerald-500">{r.ping}</span>
              </div>
            </div>
            <LeafletPopup offset={[0, -14]} className="space-y-1 text-xs">
              <div className="text-foreground font-bold">{r.name}</div>
              <div className="text-muted-foreground font-mono">{r.code}</div>
              <div className="grid grid-cols-2 gap-x-3 font-mono">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-semibold text-emerald-500">{r.ping}</span>
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-foreground font-semibold">{r.uptime}</span>
                <span className="text-muted-foreground">Pkt loss</span>
                <span className="text-foreground font-semibold">{r.loss}</span>
              </div>
            </LeafletPopup>
          </LeafletMarker>
        ))}
      </LeafletMap>
    </Story>
  )
}
