import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureDragDropOrganizer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureDragDropOrganizer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureDragDropOrganizer', Component)
