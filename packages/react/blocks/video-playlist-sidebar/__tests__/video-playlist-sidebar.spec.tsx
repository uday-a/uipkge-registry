import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../VideoPlaylistSidebar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['VideoPlaylistSidebar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('VideoPlaylistSidebar', Component)
