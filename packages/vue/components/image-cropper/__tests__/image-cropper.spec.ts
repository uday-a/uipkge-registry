import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ImageCropper } from '../index'

describe('ImageCropper', () => {
  it('renders with data-slot="image-cropper"', () => {
    const w = mount(ImageCropper, { props: { src: 'about:blank' }, attachTo: document.body })
    expect(w.find('[data-slot="image-cropper"]').exists()).toBe(true)
    w.unmount()
  })

  it('hides zoom unless showZoom is set', () => {
    const w = mount(ImageCropper, { props: { src: 'about:blank' }, attachTo: document.body })
    expect(w.find('[data-slot="image-cropper-zoom"]').exists()).toBe(false)
    w.unmount()
  })

  it('shows zoom when showZoom is true', () => {
    const w = mount(ImageCropper, { props: { src: 'about:blank', showZoom: true }, attachTo: document.body })
    expect(w.find('[data-slot="image-cropper-zoom"]').exists()).toBe(true)
    w.unmount()
  })

  it('exposes getCroppedCanvas', () => {
    const w = mount(ImageCropper, { props: { src: 'about:blank' }, attachTo: document.body })
    expect(typeof w.vm.getCroppedCanvas).toBe('function')
    expect(w.vm.getCroppedCanvas()).toBeNull()
    w.unmount()
  })

  it('sets disabled from the disabled prop', () => {
    const w = mount(ImageCropper, { props: { src: 'about:blank', disabled: true }, attachTo: document.body })
    expect(w.find('[data-slot="image-cropper-viewport"]').attributes('data-disabled')).toBe('')
    w.unmount()
  })
})
