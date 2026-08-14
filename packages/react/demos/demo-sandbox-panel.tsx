import Story from '../../components/story/Story'
import { DemoSandboxPanel } from '@react-registry-blocks/demo-sandbox-panel/DemoSandboxPanel'
// DemoSandboxPanel is the block file the user installs. Open
// `components/blocks/DemoSandboxPanel.tsx` after install to point the
// preview at a real endpoint; the stub recomputes locally.

export default function DemoSandboxPanelDemo() {
  return (
    <Story
      title="Demo — Sandbox Panel"
      description="Editing a definition field updates the rendered result and the generated query side by side, with a reset back to the starting state."
    >
      <DemoSandboxPanel />
    </Story>
  )
}
