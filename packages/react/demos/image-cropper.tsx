import Story from '../../components/story/Story'
import { ImageCropper } from '@react-registry/image-cropper'

const src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80'
const portrait = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1200&fit=crop&q=80'

export default function ImageCropperDemo() {
  return (
    <>
      <Story title="Default" description="Square viewport. Drag to pan, scroll to zoom.">
        <ImageCropper src={src} alt="Coast" />
      </Story>

      <Story title="Show zoom" description="showZoom adds the range control. Same component, one prop.">
        <ImageCropper src={src} alt="Coast" showZoom />
      </Story>

      <Story title="16 / 9" description="aspectRatio=16/9.">
        <ImageCropper src={src} alt="Coast" aspectRatio={16 / 9} showZoom />
      </Story>

      <Story title="4 / 3" description="aspectRatio=4/3.">
        <ImageCropper src={src} alt="Coast" aspectRatio={4 / 3} showZoom />
      </Story>

      <Story title="Portrait" description="aspectRatio=3/4 on a tall source.">
        <ImageCropper src={portrait} alt="City" aspectRatio={3 / 4} showZoom />
      </Story>

      <Story title="Circle" description="rounded=full for an avatar crop.">
        <ImageCropper src={src} alt="Coast" rounded="full" className="max-w-xs" showZoom />
      </Story>

      <Story title="Banner" description="aspectRatio=21/9.">
        <ImageCropper src={src} alt="Coast" aspectRatio={21 / 9} showZoom />
      </Story>

      <Story title="Zoom limits" description="minZoom and maxZoom clamp the slider and wheel.">
        <ImageCropper src={src} alt="Coast" minZoom={1} maxZoom={2} showZoom />
      </Story>

      <Story title="Disabled" description="disabled ignores pointer and keyboard.">
        <ImageCropper src={src} alt="Coast" disabled showZoom />
      </Story>

      <Story title="No zoom control" description="Wheel and + / − still work when showZoom is omitted.">
        <ImageCropper src={src} alt="Coast" />
      </Story>
    </>
  )
}
