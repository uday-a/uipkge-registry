import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SearchResultsPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SearchResultsPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SearchResultsPage', Component)
