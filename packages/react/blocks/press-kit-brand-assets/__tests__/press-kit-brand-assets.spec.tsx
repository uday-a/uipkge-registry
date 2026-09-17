import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PressKitBrandAssets'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PressKitBrandAssets'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PressKitBrandAssets', Component)
