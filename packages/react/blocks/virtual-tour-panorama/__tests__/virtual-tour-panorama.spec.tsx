import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../VirtualTourPanorama'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['VirtualTourPanorama'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('VirtualTourPanorama', Component)
