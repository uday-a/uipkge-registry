import Story from '../../components/story/Story'
import { TimeTrackerTimesheet } from '@react-registry-blocks/time-tracker-timesheet/TimeTrackerTimesheet'

export default function TimeTrackerTimesheetDemo() {
  return (
    <Story
      title="Time Tracker & Weekly Timesheet"
      description="Toggl/Harvest-style live time tracking hero bar with running stopwatch, project tag selector with billing rates, billable switch, 4 weekly summary cards, and daily grouped activity ledger."
    >
      <TimeTrackerTimesheet />
    </Story>
  )
}
