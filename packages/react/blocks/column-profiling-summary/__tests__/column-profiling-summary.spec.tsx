import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ColumnProfilingSummary'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ColumnProfilingSummary'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ColumnProfilingSummary', Component)
