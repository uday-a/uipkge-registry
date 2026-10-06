<script lang="ts">
  import {
    LeafletMap,
    LeafletMarker,
    LeafletPopup,
    LeafletTooltip,
    LeafletPolyline,
    LeafletPolygon,
    LeafletCircle,
    LeafletCircleMarker,
    type LeafletMapVariant,
  } from '@svelte-registry/leaflet-map'
  import { MapPin } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let activeVariant = $state<LeafletMapVariant>('default')
  const variantOptions: { id: LeafletMapVariant; label: string }[] = [
    { id: 'default', label: 'Default' },
    { id: 'streets', label: 'Streets' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'muted', label: 'Muted' },
    { id: 'outdoors', label: 'Outdoors' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'satellite-streets', label: 'Satellite hybrid' },
  ]

  const hq: [number, number] = [-73.985, 40.748]
  const depot: [number, number] = [-73.975, 40.758]

  const route: [number, number][] = [
    [-73.985, 40.748],
    [-73.98, 40.752],
    [-73.975, 40.758],
    [-73.972, 40.765],
  ]

  const zone: [number, number][] = [
    [-74.0, 40.74],
    [-73.96, 40.74],
    [-73.96, 40.77],
    [-74.0, 40.77],
  ]
</script>

{#if story === 'Default'}
  <LeafletMap center={hq} zoom={12} size="default" class="rounded-lg border" />
{/if}

{#if story === 'Variant switcher'}
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-1.5">
      {#each variantOptions as v (v.id)}
        <button
          type="button"
          onclick={() => (activeVariant = v.id)}
          class="rounded-md border px-2.5 py-1 text-xs font-medium transition-colors {activeVariant === v.id
            ? 'bg-primary text-primary-foreground border-transparent'
            : 'bg-card text-muted-foreground hover:bg-muted'}"
        >
          {v.label}
        </button>
      {/each}
    </div>
    <LeafletMap variant={activeVariant} center={hq} zoom={11} size="default" class="rounded-lg border" />
  </div>
{/if}

{#if story === 'Markers & popups'}
  <LeafletMap center={hq} zoom={13} size="default" class="rounded-lg border">
    <LeafletMarker lngLat={hq}>
      {#snippet icon()}
        <span class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full shadow-md">
          <MapPin class="size-4" />
        </span>
      {/snippet}
      <LeafletPopup>
        <div class="space-y-0.5 px-1 py-0.5">
          <p class="text-sm font-semibold">Global Operations HQ</p>
          <p class="text-muted-foreground text-xs">350 5th Ave, New York</p>
        </div>
      </LeafletPopup>
      <LeafletTooltip direction="top">HQ — click for details</LeafletTooltip>
    </LeafletMarker>
    <LeafletMarker lngLat={depot}>
      <LeafletPopup>
        <div class="px-1 py-0.5">
          <p class="text-sm font-semibold">East River Depot</p>
          <p class="text-muted-foreground text-xs">24 bays · active</p>
        </div>
      </LeafletPopup>
    </LeafletMarker>
  </LeafletMap>
{/if}

{#if story === 'Route & geofence'}
  <LeafletMap center={[-73.978, 40.755]} zoom={13} size="default" class="rounded-lg border">
    <LeafletPolygon
      lngLatPath={zone}
      color="var(--chart-1)"
      weight={2}
      fillColor="var(--chart-1)"
      fillOpacity={0.12}
    />
    <LeafletPolyline lngLatPath={route} color="var(--chart-2)" weight={4} />
    <LeafletCircleMarker center={hq} radius={7} color="var(--chart-1)" fillColor="var(--chart-1)" fillOpacity={1}>
      <LeafletTooltip permanent direction="right">Pickup</LeafletTooltip>
    </LeafletCircleMarker>
    <LeafletCircle center={depot} radius={400} color="var(--chart-2)" weight={2} fillOpacity={0.08} />
  </LeafletMap>
{/if}

{#if story === 'Muted canvas'}
  <LeafletMap variant="muted" center={hq} zoom={12} size="default" class="rounded-lg border">
    <LeafletCircleMarker center={hq} radius={9} color="var(--destructive)" fillColor="var(--destructive)" fillOpacity={1} />
    <LeafletCircleMarker center={depot} radius={9} color="var(--chart-2)" fillColor="var(--chart-2)" fillOpacity={1} />
  </LeafletMap>
{/if}
