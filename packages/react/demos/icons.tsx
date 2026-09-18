import Story from '../../components/story/Story'
import { Icon } from '@react-registry/icons'
import { Home, Settings, User } from 'lucide-react'

export default function IconsDemo() {
  return (
    <>
      <Story title="Sizes" description="Icon component in different sizes using Lucide icons via slot.">
        <div className="flex items-center gap-4">
          <Icon size="xs">
            <Home className="size-3" aria-hidden="true" />
          </Icon>
          <Icon size="sm">
            <Home className="size-4" aria-hidden="true" />
          </Icon>
          <Icon size="md">
            <Home className="size-5" aria-hidden="true" />
          </Icon>
          <Icon size="lg">
            <Home className="size-6" aria-hidden="true" />
          </Icon>
          <Icon size="xl">
            <Home className="size-8" aria-hidden="true" />
          </Icon>
        </div>
      </Story>

      <Story title="Color & rotation" description="Custom color and rotation applied to the icon wrapper.">
        <div className="flex items-center gap-4">
          <Icon color="var(--destructive)" rotation={0}>
            <Settings className="size-5" aria-hidden="true" />
          </Icon>
          <Icon color="var(--info)" rotation={45}>
            <Settings className="size-5" aria-hidden="true" />
          </Icon>
          <Icon color="var(--success)" rotation={90}>
            <Settings className="size-5" aria-hidden="true" />
          </Icon>
        </div>
      </Story>

      <Story title="Flip" description="Horizontal and vertical flip transformations.">
        <div className="flex items-center gap-4">
          <Icon>
            <User className="size-5" aria-hidden="true" />
          </Icon>
          <Icon flip="horizontal">
            <User className="size-5" aria-hidden="true" />
          </Icon>
          <Icon flip="vertical">
            <User className="size-5" aria-hidden="true" />
          </Icon>
        </div>
      </Story>
    </>
  )
}
