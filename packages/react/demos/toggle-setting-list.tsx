import Story from '../../components/story/Story'
import * as React from 'react'
import { ToggleSettingList } from '@react-registry-blocks/toggle-setting-list/ToggleSettingList'
import { Bell } from 'lucide-react'

const items = [
  { key: 'email', label: 'Email notifications', desc: 'Get updates in your inbox.' },
  { key: 'sms', label: 'SMS alerts', desc: 'Time-critical messages only.' },
  { key: 'digest', label: 'Weekly digest', desc: 'A summary every Monday.' },
]

export default function ToggleSettingListDemo() {
  const [values, setValues] = React.useState<Record<string, boolean>>({ email: true, sms: false, digest: true })

  return (
    <Story title="Default" description="Card with a header icon and a list of labeled switch settings.">
      <ToggleSettingList
        title="Notifications"
        description="What should we alert you about?"
        headerIcon={<Bell className="size-4" />}
        items={items}
        value={values}
        onValueChange={setValues}
      />
    </Story>
  )
}
