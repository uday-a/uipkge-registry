import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PropertyAmenitiesGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PropertyAmenitiesGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PropertyAmenitiesGrid', Component)
