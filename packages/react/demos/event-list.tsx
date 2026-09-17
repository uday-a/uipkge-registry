import Story from '../../components/story/Story'
import { EventList } from '@react-registry-blocks/event-list/EventList'

const events = [
  { id: 1, title: 'Annual Review — Sarah Connor', date: 'May 15', status: 'Upcoming' },
  { id: 2, title: 'Open Enrollment Closes', date: 'May 31', status: 'Upcoming' },
  { id: 3, title: 'Q2 All-Hands Meeting', date: 'Jun 5', status: 'Upcoming' },
]

export default function EventListDemo() {
  return (
    <Story title="Default" description="Titled list of events with date and status per row.">
      <EventList title="Upcoming Events" description="Important dates to keep in mind." events={events} />
    </Story>
  )
}
