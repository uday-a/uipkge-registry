import { ChangelogReleaseNotesTimeline } from '@/components/blocks/changelog-release-notes-timeline'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Developer changelog timeline with version filter tabs and categorical changes">
      <div className="w-full">
        <ChangelogReleaseNotesTimeline />
      </div>
    </Story>
  )
}
