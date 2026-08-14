import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LogoCloudGrayscale'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LogoCloudGrayscale'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LogoCloudGrayscale', Component)
