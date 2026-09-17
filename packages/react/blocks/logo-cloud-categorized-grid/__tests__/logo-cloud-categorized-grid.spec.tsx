import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LogoCloudCategorizedGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LogoCloudCategorizedGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LogoCloudCategorizedGrid', Component)
