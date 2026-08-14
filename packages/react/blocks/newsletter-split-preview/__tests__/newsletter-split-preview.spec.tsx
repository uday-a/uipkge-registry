import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NewsletterSplitPreview'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NewsletterSplitPreview'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NewsletterSplitPreview', Component)
