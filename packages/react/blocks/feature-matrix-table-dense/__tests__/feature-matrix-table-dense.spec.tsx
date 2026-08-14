import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureMatrixTableDense'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureMatrixTableDense'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureMatrixTableDense', Component)
