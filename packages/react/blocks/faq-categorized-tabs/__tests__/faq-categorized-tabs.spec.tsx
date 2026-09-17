import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FaqCategorizedTabs'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FaqCategorizedTabs'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FaqCategorizedTabs', Component)
