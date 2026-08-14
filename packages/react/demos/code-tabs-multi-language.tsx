import Story from '../../components/story/Story'
import { CodeTabsMultiLanguage } from '@react-registry-blocks/code-tabs-multi-language/CodeTabsMultiLanguage'
// CodeTabsMultiLanguage is the block file the user installs. Open
// `components/blocks/CodeTabsMultiLanguage.tsx` after install to add
// languages; samples are plain strings, so any highlighter can be layered on.

export default function CodeTabsMultiLanguageDemo() {
  return (
    <Story
      title="Code — Multi-Language Tabs"
      description="Language tabs over one code sample. The copy control reports its own success state, and a caption names the endpoint the sample calls."
    >
      <CodeTabsMultiLanguage />
    </Story>
  )
}
