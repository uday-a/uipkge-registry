import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FaqContactSidebar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FaqContactSidebar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FaqContactSidebar', Component)
