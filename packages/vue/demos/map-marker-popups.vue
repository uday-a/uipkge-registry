<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapMarker, MapPopup } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
const activeMarker = ref<string | null>('hq')
</script>

<template>
  <Story
    title="Marker Popups"
    description="Interactive marker pins with customizable popup dialogs and reactive selection."
  >
    <Map
      :access-token="token"
      variant="light"
      :center="[-73.985, 40.748]"
      :zoom="13.5"
      class="h-96 w-full rounded-lg border"
    >
      <MapMarker :lng-lat="[-73.985, 40.748]" anchor="bottom" @click="activeMarker = 'hq'">
        <div class="group flex cursor-pointer flex-col items-center">
          <span
            class="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110"
          />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs"
          >
            Headquarters
          </span>
        </div>
      </MapMarker>
      <MapPopup
        v-if="activeMarker === 'hq'"
        :lng-lat="[-73.985, 40.748]"
        :offset="[0, -32]"
        class="border-border bg-popover space-y-1 rounded-lg border p-3 text-xs shadow-md"
        @close="activeMarker = null"
      >
        <div class="text-foreground font-bold">Global Operations HQ</div>
        <div class="text-muted-foreground">350 5th Ave, New York, NY 10118</div>
        <div class="font-mono text-xs font-medium text-emerald-500">Status: Active • 1,420 Staff</div>
      </MapPopup>
    </Map>
  </Story>
</template>
