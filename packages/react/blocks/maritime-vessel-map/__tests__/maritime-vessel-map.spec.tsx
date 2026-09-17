import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../MaritimeVesselMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['MaritimeVesselMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('MaritimeVesselMap', Component)
