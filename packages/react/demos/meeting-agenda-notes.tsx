import Story from '../../components/story/Story'
import { MeetingAgendaNotes } from '@react-registry-blocks/meeting-agenda-notes/MeetingAgendaNotes'

export default function MeetingAgendaNotesDemo() {
  return (
    <Story
      title="Default"
      description="Linear and Notion style structured meeting document with attendee avatars, timeboxed agenda topics, rich discussion notes, interactive action items checklist, and key decisions log."
    >
      <MeetingAgendaNotes />
    </Story>
  )
}
