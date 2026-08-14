import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ArticleEditorToolbar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ArticleEditorToolbar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ArticleEditorToolbar', Component)
