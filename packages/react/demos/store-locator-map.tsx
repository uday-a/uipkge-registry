import * as React from 'react'
import Story from '../../components/story/Story'
import { StoreLocatorMap } from '@/components/blocks/store-locator-map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function StoreLocatorMapDemo() {
  return (
    <Story title="Stores" description="Store pins with open/closed status. Select a location to fly the camera.">
      <StoreLocatorMap accessToken={token} />
    </Story>
  )
}
