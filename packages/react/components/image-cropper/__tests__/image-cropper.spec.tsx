import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render } from '@testing-library/react'
import { ImageCropper, type ImageCropperHandle } from '../image-cropper'

describe('ImageCropper', () => {
  it('renders with data-slot="image-cropper"', () => {
    const { container } = render(<ImageCropper src="about:blank" />)
    expect(container.querySelector('[data-slot="image-cropper"]')).toBeTruthy()
  })

  it('hides zoom unless showZoom is set', () => {
    const { container } = render(<ImageCropper src="about:blank" />)
    expect(container.querySelector('[data-slot="image-cropper-zoom"]')).toBeFalsy()
  })

  it('shows zoom when showZoom is true', () => {
    const { container } = render(<ImageCropper src="about:blank" showZoom />)
    expect(container.querySelector('[data-slot="image-cropper-zoom"]')).toBeTruthy()
  })

  it('exposes getCroppedCanvas', () => {
    const ref = createRef<ImageCropperHandle>()
    render(<ImageCropper ref={ref} src="about:blank" />)
    expect(typeof ref.current?.getCroppedCanvas).toBe('function')
    expect(ref.current?.getCroppedCanvas()).toBeNull()
  })

  it('sets disabled from the disabled prop', () => {
    const { container } = render(<ImageCropper src="about:blank" disabled />)
    expect(container.querySelector('[data-slot="image-cropper-viewport"]')?.getAttribute('data-disabled')).toBe('')
  })
})
