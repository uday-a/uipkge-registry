import Story from '../../components/story/Story'
import { ProfileMenu } from '@react-registry-blocks/profile-menu/ProfileMenu'

export default function ProfileMenuDemo() {
  return (
    <Story
      title="Profile Menu"
      description="Header-grade profile/account dropdown. Default Avatar trigger or pass your own via the default slot. Sections: upgrade, account/billing/notifications/settings, log out. Emits `select` with the chosen item key."
    >
      <div className="flex justify-start">
        <ProfileMenu />
      </div>
    </Story>
  )
}
