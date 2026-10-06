<script lang="ts" module>
  // Value import in the module script (visible to the instance script) — both
  // scripts share one scope, so a second instance import would collide.
  import mapboxgl from 'mapbox-gl'
  import type { MapControlPosition } from './Map.svelte'

  export interface MapNavigationControlProps {
    /** Control placement. Defaults to 'top-right' (react-map-gl parity). */
    position?: MapControlPosition
    /** Show the compass button. Defaults to true. */
    showCompass?: boolean
    /** Show the zoom buttons. Defaults to true. */
    showZoom?: boolean
    /** Tilt the compass to reflect the camera pitch. Defaults to false. */
    visualizePitch?: boolean
  }
</script>

<script lang="ts">
  /**
   * Standalone zoom/compass control — the Svelte equivalent of React's
   * `MapNavigationControl` (react-map-gl re-export). Must be rendered inside
   * `<Map>` children; reads the map instance from context. For the common
   * case prefer `<Map navigation navigationPosition={...}>` — combine a
   * standalone control with `navigation={false}` to avoid duplicates.
   */
  import { useMap } from './map-context.svelte'

  let {
    position = 'top-right',
    showCompass = true,
    showZoom = true,
    visualizePitch = false,
  }: MapNavigationControlProps = $props()

  const mapCtx = useMap()
  let control: mapboxgl.NavigationControl | null = null

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
    void [position, showCompass, showZoom, visualizePitch]
    if (!map) return
    teardown(map)
    control = new mapboxgl.NavigationControl({ showCompass, showZoom, visualizePitch })
    map.addControl(control, position)
    return () => teardown(map)
  })
</script>
