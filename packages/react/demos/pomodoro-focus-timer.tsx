import Story from '../../components/story/Story'
import { PomodoroFocusTimer } from '@react-registry-blocks/pomodoro-focus-timer/PomodoroFocusTimer'

export default function PomodoroFocusTimerDemo() {
  return (
    <Story
      title="Pomodoro Focus Workspace"
      description="Interactive Pomodoro timer workspace with focus and break intervals, SVG circular progress track, session dots, task queue with pomodoro estimate pills, ambient sound generator, and daily analytics."
    >
      <PomodoroFocusTimer />
    </Story>
  )
}
