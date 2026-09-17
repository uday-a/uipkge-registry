import Story from '../../components/story/Story'
import { HeaderSearchCommand } from '@react-registry-blocks/header-search-command/HeaderSearchCommand'
// HeaderSearchCommand is the block file the user installs. Open
// `components/blocks/HeaderSearchCommand.tsx` after install to wire the
// `groups` array to a real index. The ⌘K listener is registered on mount.

export default function HeaderSearchCommandDemo() {
  return (
    <Story
      title="Header — Inline Search"
      description="Navbar with inline search. Click the field or press ⌘K to open a command palette of grouped results; Escape closes and the shortcut hint stays visible in the trigger."
    >
      <HeaderSearchCommand />
    </Story>
  )
}
