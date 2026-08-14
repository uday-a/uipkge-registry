import { FeatureDragDropOrganizer } from '@/components/blocks/feature-drag-drop-organizer'
import { Story } from '@/components/story/Story'

export default function FeatureDragDropOrganizerDemo() {
  return (
    <Story
      title="Default"
      description="Interactive dashboard layout hierarchy rearranger with instant preview and schema export."
    >
      <FeatureDragDropOrganizer />
    </Story>
  )
}
