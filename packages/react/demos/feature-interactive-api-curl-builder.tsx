import { FeatureInteractiveApiCurlBuilder } from '@/components/blocks/feature-interactive-api-curl-builder'
import { Story } from '@/components/story/Story'

export default function FeatureInteractiveApiCurlBuilderDemo() {
  return (
    <Story
      title="Default"
      description="Interactive API cURL builder with payload flags, live multi-language code generation, and simulated edge execution."
    >
      <FeatureInteractiveApiCurlBuilder />
    </Story>
  )
}
