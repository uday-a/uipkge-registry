import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../GraphqlQueryExplorer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['GraphqlQueryExplorer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('GraphqlQueryExplorer', Component)
