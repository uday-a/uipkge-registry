import { afterEach } from 'vitest'
import { cleanup, waitFor } from '@testing-library/react'
import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AuthMfa'

afterEach(async () => {
  await waitFor(() => {}, { timeout: 200 })
  cleanup()
  await new Promise((resolve) => setTimeout(resolve, 50))
})

const Component =
  (BlockModule as any).default || (BlockModule as any)['AuthMfa'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AuthMfa', Component)
