import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PodcastAudioPlayer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PodcastAudioPlayer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PodcastAudioPlayer', Component)
