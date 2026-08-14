import Story from '../../components/story/Story'
import { CodeTerminalSession } from '@react-registry-blocks/code-terminal-session/CodeTerminalSession'
// CodeTerminalSession is the block file the user installs. Open
// `components/blocks/CodeTerminalSession.tsx` after install to edit the
// `lines` array. Typing starts on mount, so server and client agree on the
// first paint.

export default function CodeTerminalSessionDemo() {
  return (
    <Story
      title="Code — Terminal Session"
      description="A terminal transcript that types itself out line by line, showing prompts, output, and a success summary. Under reduced-motion the full transcript renders at once."
    >
      <CodeTerminalSession />
    </Story>
  )
}
