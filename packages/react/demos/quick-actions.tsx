import Story from '../../components/story/Story'
import { QuickActions } from '@react-registry-blocks/quick-actions/QuickActions'
import { Briefcase, ClipboardList, FileText, UserPlus } from 'lucide-react'

const actions = [
  { id: 1, label: 'Add new employee', icon: UserPlus, route: '#' },
  { id: 2, label: 'Review time off', icon: ClipboardList, route: '#' },
  { id: 3, label: 'Run payroll', icon: Briefcase, route: '#' },
  { id: 4, label: 'View documents', icon: FileText, route: '#' },
]

export default function QuickActionsDemo() {
  return (
    <Story title="Default" description="Card listing common shortcuts as icon-labeled buttons.">
      <QuickActions title="Quick Actions" description="Frequently used shortcuts." actions={actions} />
    </Story>
  )
}
