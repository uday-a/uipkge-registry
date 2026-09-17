import Story from '../../components/story/Story'
import { SmartInboxTriage } from '@react-registry-blocks/smart-inbox-triage/SmartInboxTriage'

export default function SmartInboxTriageDemo() {
  return (
    <>
      <Story
        title="Smart Inbox Triage"
        description="Superhuman-style high-velocity email inbox triage command center with keyboard shortcuts [E/H/R/J/K], split category tabs (VIP, Team & GitHub, Newsletters, Archived), dual-pane split reader, fast triage actions, and ⌘K command palette."
      >
        <SmartInboxTriage />
      </Story>

      <Story
        title="Team & GitHub Stream"
        description="Pre-filtered category focusing on engineering pull requests and design token migration specs."
      >
        <SmartInboxTriage initialCategory="team" initialSelectedId="msg-4" />
      </Story>

      <Story title="Newsletters Queue" description="Newsletters category viewing technical digests and deep-dives.">
        <SmartInboxTriage initialCategory="newsletters" initialSelectedId="msg-6" />
      </Story>

      <Story
        title="Search Filtered"
        description="Pre-populated search query filtering messages related to OKLCH tokens and design specs."
      >
        <SmartInboxTriage initialSearch="OKLCH" initialSelectedId="msg-4" />
      </Story>

      <Story
        title="Inbox Zero State"
        description="Zero inbox state when all pending triage items in the current view have been processed."
      >
        <SmartInboxTriage messages={[]} />
      </Story>
    </>
  )
}
