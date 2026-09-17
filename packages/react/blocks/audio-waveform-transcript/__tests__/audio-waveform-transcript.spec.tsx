import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AudioWaveformTranscript'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AudioWaveformTranscript'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AudioWaveformTranscript', Component)
