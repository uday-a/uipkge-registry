<script lang="ts">
  import { RouteFlowMap, type RouteHub, type FlightRoute } from '@svelte-registry/route-flow-map'

  let { story }: { story: string } = $props()

  const hubs: RouteHub[] = [
    { id: 'SIN', name: 'Singapore Changi', lat: 1.3644, lng: 103.9915, latency: '42 min' },
    { id: 'DXB', name: 'Dubai Intl', lat: 25.2532, lng: 55.3657, latency: '55 min' },
    { id: 'LHR', name: 'London Heathrow', lat: 51.47, lng: -0.4543, latency: '1h 10m' },
    { id: 'JFK', name: 'New York JFK', lat: 40.6413, lng: -73.7781, latency: '58 min' },
    { id: 'NRT', name: 'Tokyo Narita', lat: 35.772, lng: 140.3929, latency: '47 min' },
  ]

  const routes: FlightRoute[] = [
    { id: 'SQ22', from: 'SIN', to: 'DXB', callsign: 'SQ22', aircraft: 'A350', progress: 35, status: 'en-route' },
    { id: 'EK6', from: 'DXB', to: 'LHR', callsign: 'EK6', aircraft: 'A380', progress: 70, status: 'approaching' },
    { id: 'BA179', from: 'JFK', to: 'LHR', callsign: 'BA179', aircraft: 'B777', progress: 55, status: 'en-route' },
    { id: 'JL516', from: 'NRT', to: 'SIN', callsign: 'JL516', aircraft: 'A350', progress: 20, status: 'scheduled' },
  ]

  let selected = $state<string | undefined>('EK6')
</script>

{#if story === 'Flight corridors'}
  <RouteFlowMap {hubs} {routes} height={420} />
{/if}

{#if story === 'With selection'}
  <div class="flex flex-col gap-2">
    <RouteFlowMap {hubs} {routes} bind:selectedRoute={selected} height={420} />
    <p class="text-muted-foreground text-xs">Selected route: {selected ?? 'none'}</p>
  </div>
{/if}
