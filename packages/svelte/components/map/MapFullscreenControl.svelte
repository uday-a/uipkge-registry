<script lang="ts" module>
  // Value import in the module script (visible to the instance script) — both
  // scripts share one scope, so a second instance import would collide.
  import mapboxgl from 'mapbox-gl'
  import type { MapControlPosition } from './Map.svelte'

  export interface MapFullscreenControlProps {
    /** Control placement. Defaults to 'top-right' (react-map-gl parity). */
    position?: MapControlPosition
    /** Element to make fullscreen. Defaults to the map container. */
    container?: HTMLElement
  }
</script>

<script lang="ts">
  /**
   * Standalone fullscreen toggle — the Svelte equivalent of React's
   * `MapFullscreenControl` (react-map-gl re-export). Must be rendered inside
   * `<Map>` children; reads the map instance from context. For the common
   * case prefer `<Map fullscreen fullscreenPosition={...}>` — combine a
   * standalone control with `fullscreen={false}` to avoid duplicates.
   */
  import { useMap } from './map-context.svelte'

  let { position = 'top-right', container }: MapFullscreenControlProps = $props()

  const mapCtx = useMap()
  let control: mapboxgl.FullscreenControl | null = null

  function teardown(map: mapboxgl.Map | null) {
    if (map && control) {
      try {
        map.removeControl(control)
      } catch {
        /* already removed */
      }
    }
    control = null
  }

  $effect(() => {
    const map = mapCtx.map
    // Mapbox controls are immutable — recreate when options change.
    void [position, container]
    if (!map) return
    teardown(map)
    control = new mapboxgl.FullscreenControl(container ? { container } : undefined)
    map.addControl(control, position)
    return () => teardown(map)
  })
</script>
