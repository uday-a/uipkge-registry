import Story from '../../components/story/Story'
import { HeaderCenteredLogo } from '@react-registry-blocks/header-centered-logo/HeaderCenteredLogo'
// HeaderCenteredLogo is the block file the user installs. Open
// `components/blocks/HeaderCenteredLogo.tsx` after install to rebalance the
// `leftLinks` / `rightLinks` arrays — the centre mark stays centred.

export default function HeaderCenteredLogoDemo() {
  return (
    <Story
      title="Header — Centered Logo"
      description="Symmetrical navbar: wordmark centred between two nav halves with a utility cluster on the right. Below the breakpoint the split collapses into one sheet trigger."
    >
      <HeaderCenteredLogo />
    </Story>
  )
}
