import Story from '../../components/story/Story'
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

const regions = [
  { code: 'us-east-1', name: 'N. Virginia', coords: [-77.04, 38.9] as [number, number], ping: '12ms' },
  { code: 'us-west-2', name: 'Oregon', coords: [-122.67, 45.52] as [number, number], ping: '28ms' },
  { code: 'eu-west-1', name: 'Ireland', coords: [-6.26, 53.34] as [number, number], ping: '64ms' },
  { code: 'ap-northeast-1', name: 'Tokyo', coords: [139.69, 35.68] as [number, number], ping: '112ms' },
  { code: 'sa-east-1', name: 'São Paulo', coords: [-46.63, -23.55] as [number, number], ping: '135ms' },
]

export default function MapNetworkTopologyDemo() {
  return (
    <Story
      title="Global Network Topology"
      description="Multi-region cloud infrastructure nodes with live ping latency and status rings."
    >
      <Map accessToken={token} variant="dark" center={[0, 20]} zoom={1.5} className="h-96 w-full rounded-lg border">
        {regions.map((r) => (
          <MapMarker key={r.code} lngLat={r.coords} anchor="center">
            <div className="flex flex-col items-center">
              <span className="size-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30" />
              <div className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[11px] shadow-xs">
                <span className="text-foreground font-bold">{r.name}</span>
                <span className="ml-1 font-semibold text-emerald-500">{r.ping}</span>
              </div>
            </div>
          </MapMarker>
        ))}
      </Map>
    </Story>
  )
}
