import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FaqSearchableAccordionWorkbench'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FaqSearchableAccordionWorkbench'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FaqSearchableAccordionWorkbench', Component)
