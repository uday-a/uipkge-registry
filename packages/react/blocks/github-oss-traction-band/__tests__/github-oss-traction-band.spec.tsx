import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../GithubOssTractionBand'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['GithubOssTractionBand'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('GithubOssTractionBand', Component)
