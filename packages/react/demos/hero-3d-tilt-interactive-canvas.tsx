import { Hero3dTiltInteractiveCanvas } from '@/components/blocks/hero-3d-tilt-interactive-canvas'
import { Story } from '@/components/story/Story'

export default function Hero3dTiltInteractiveCanvasDemo() {
  return (
    <Story
      title="Default"
      description="Hardware-accelerated 3D perspective hero with dynamic specular reflection and layered z-depth cards."
    >
      <Hero3dTiltInteractiveCanvas />
    </Story>
  )
}
