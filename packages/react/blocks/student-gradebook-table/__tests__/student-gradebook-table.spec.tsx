import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StudentGradebookTable'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StudentGradebookTable'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StudentGradebookTable', Component)
