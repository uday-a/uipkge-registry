import Story from '../../components/story/Story'
import { LogoCloudGrayscale } from '@react-registry-blocks/logo-cloud-grayscale/LogoCloudGrayscale'
// LogoCloudGrayscale is the block file the user installs. Open
// `components/blocks/LogoCloudGrayscale.tsx` after install to swap the
// wordmarks for logo files; the hover treatment carries over.

export default function LogoCloudGrayscaleDemo() {
  return (
    <Story
      title="Logo Cloud — Grayscale Hover"
      description="Muted monochrome logo wall that resolves to full contrast on hover, under a headline count and a segment line."
    >
      <LogoCloudGrayscale />
    </Story>
  )
}
