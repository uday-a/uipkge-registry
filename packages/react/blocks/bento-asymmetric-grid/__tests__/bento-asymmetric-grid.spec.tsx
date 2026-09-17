import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BentoAsymmetricGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BentoAsymmetricGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BentoAsymmetricGrid', Component)
