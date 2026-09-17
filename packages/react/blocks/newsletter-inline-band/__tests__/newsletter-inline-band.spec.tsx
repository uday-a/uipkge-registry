import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NewsletterInlineBand'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NewsletterInlineBand'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NewsletterInlineBand', Component)
