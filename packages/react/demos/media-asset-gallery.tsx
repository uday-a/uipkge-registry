import Story from '../../components/story/Story'
import { MediaAssetGallery } from '@react-registry-blocks/media-asset-gallery/MediaAssetGallery'

export default function MediaAssetGalleryDemo() {
  return (
    <Story
      title="Default"
      description="Figma/Unsplash style Digital Asset Manager (DAM) featuring total asset counter, instant search, category tabs (Images, Vectors, Videos, Brand Logos), aspect ratio filter pills (16:9, 1:1, 9:16, Raw Vector), tag chips, 3-column responsive asset grid with overlay actions, and a slide-over metadata & resolution download inspector drawer."
    >
      <MediaAssetGallery />
    </Story>
  )
}
