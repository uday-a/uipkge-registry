import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ImmunizationHistory'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ImmunizationHistory'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ImmunizationHistory', Component)
