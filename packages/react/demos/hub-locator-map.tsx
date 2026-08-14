import * as React from 'react'
import Story from '../../components/story/Story'
import { HubLocatorMap } from '@/components/blocks/hub-locator-map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function HubLocatorMapDemo() {
  return (
    <Story title="Hubs" description="Global hub pins. Select a location to fly the camera.">
      <HubLocatorMap accessToken={token} />
    </Story>
  )
}
