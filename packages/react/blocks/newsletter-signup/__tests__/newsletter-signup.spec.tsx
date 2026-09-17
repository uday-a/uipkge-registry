import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NewsletterSignup'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NewsletterSignup'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NewsletterSignup', Component)
