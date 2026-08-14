import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CodeDiffReview'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CodeDiffReview'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CodeDiffReview', Component)
