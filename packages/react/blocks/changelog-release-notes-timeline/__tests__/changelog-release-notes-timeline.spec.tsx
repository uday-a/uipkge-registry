import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ChangelogReleaseNotesTimeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ChangelogReleaseNotesTimeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ChangelogReleaseNotesTimeline', Component)
