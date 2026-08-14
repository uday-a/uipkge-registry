import Story from '../../components/story/Story'
import { UserProfilePage } from '@react-registry-blocks/user-profile-page/UserProfilePage'

export default function UserProfilePageDemo() {
  return (
    <Story
      title="Default"
      description="Profile page with cover banner, overlapping avatar, stats row, and Overview / Activity / Projects tabs."
    >
      <UserProfilePage />
    </Story>
  )
}
