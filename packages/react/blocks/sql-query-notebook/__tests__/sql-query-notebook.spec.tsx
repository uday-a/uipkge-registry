import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SqlQueryNotebook'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SqlQueryNotebook'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SqlQueryNotebook', Component)
