<script lang="ts">
  import { Map, MapMarker, MapPopup, MapSource, MapLayer } from '@svelte-registry/map'

  let { story }: { story: string } = $props()

  // Mapbox token from the environment; undefined falls through to the demo key.
  const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

  const nyc: [number, number] = [-74.006, 40.713]

  const hubs = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-74.006, 40.713] },
        properties: { name: 'Manhattan hub' },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-73.944, 40.678] },
        properties: { name: 'Brooklyn hub' },
      },
    ],
  }
</script>

{#if story === 'Default'}
  <Map accessToken={token} center={nyc} zoom={11} class="h-80 w-full rounded-lg border">
    <MapMarker lngLat={nyc} />
  </Map>
{/if}

{#if story === 'Missing access token'}
  <Map accessToken="" class="h-80 w-full rounded-lg border" />
{/if}

{#if story === 'Marker popup'}
  <Map accessToken={token} center={nyc} zoom={12} class="h-80 w-full rounded-lg border">
    <MapMarker lngLat={nyc} color="#0ea5e9" />
    <MapPopup lngLat={nyc}>
      <div class="px-1 py-0.5">
        <p class="text-sm font-semibold">Manhattan Hub</p>
        <p class="text-muted-foreground text-xs">142 vehicles · on time</p>
      </div>
    </MapPopup>
  </Map>
{/if}

{#if story === 'Declarative source and layer'}
  <Map accessToken={token} center={[-73.98, 40.7]} zoom={10} class="h-80 w-full rounded-lg border">
    <MapSource id="hubs" data={hubs}>
      <MapLayer
        id="hubs-circles"
        type="circle"
        paint={{ 'circle-radius': 8, 'circle-color': '#0ea5e9', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }}
      />
    </MapSource>
  </Map>
{/if}

{#if story === 'Minimal muted dashboard'}
  <Map accessToken={token} variant="muted" center={nyc} zoom={10} navigation={false} class="h-80 w-full rounded-lg border">
    <MapMarker lngLat={nyc} color="#f59e0b" />
  </Map>
{/if}
