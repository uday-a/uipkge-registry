import Story from '../../components/story/Story'
import { CodeInstallCommand } from '@react-registry-blocks/code-install-command/CodeInstallCommand'
// CodeInstallCommand is the block file the user installs. Open
// `components/blocks/CodeInstallCommand.tsx` after install to change the
// package name; each manager's command is derived from it.

export default function CodeInstallCommandDemo() {
  return (
    <Story
      title="Code — Install Command"
      description="Package-manager tabs over one install command, with copy, a resolved-version line, and a note on what the command writes to disk."
    >
      <CodeInstallCommand />
    </Story>
  )
}
