import Story from '../../components/story/Story'
import { ArticleEditorToolbar } from '@react-registry-blocks/article-editor-toolbar/ArticleEditorToolbar'

export default function ArticleEditorToolbarDemo() {
  return (
    <Story
      title="Default"
      description="Medium and Substack style rich text formatting toolbar and article drafting canvas with typography controls, syntax highlighted code blocks, callouts, and publishing drawer."
    >
      <ArticleEditorToolbar />
    </Story>
  )
}
