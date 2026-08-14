import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NewsletterIssueArchive'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NewsletterIssueArchive'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NewsletterIssueArchive', Component)
