import Story from '../../components/story/Story'
import { Map } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function MapControlsToolbarDemo() {
  return (
    <Story
      title="Controls & Toolbar"
      description="Native navigation controls (+/- zoom buttons, compass) and HTML5 fullscreen display controls."
    >
      <Map
        accessToken={token}
        variant="streets"
        center={[2.3522, 48.8566]}
        zoom={12}
        navigation={true}
        navigationPosition="top-right"
        fullscreen={true}
        fullscreenPosition="top-left"
        showCompass={true}
        showZoom={true}
        className="h-96 w-full rounded-lg border"
      />
    </Story>
  )
}
