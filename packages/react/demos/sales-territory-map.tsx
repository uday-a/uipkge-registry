import * as React from 'react'
import Story from '../../components/story/Story'
import { SalesTerritoryMap } from '@/components/blocks/sales-territory-map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function SalesTerritoryMapDemo() {
  return (
    <Story title="Territories" description="Quota pins on a world map. Select a region to fly the camera.">
      <SalesTerritoryMap accessToken={token} />
    </Story>
  )
}
