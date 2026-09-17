import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AbTestVariantResults'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AbTestVariantResults'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AbTestVariantResults', Component)
