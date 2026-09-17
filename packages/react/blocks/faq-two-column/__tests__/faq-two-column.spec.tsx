import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FaqTwoColumn'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FaqTwoColumn'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FaqTwoColumn', Component)
