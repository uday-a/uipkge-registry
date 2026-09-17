import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ReturnMerchandiseInspection'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ReturnMerchandiseInspection'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ReturnMerchandiseInspection', Component)
