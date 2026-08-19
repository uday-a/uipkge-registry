import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ImageCompare from "../ImageCompare.vue";

describe("ImageCompare (Vue)", () => {
  it('renders container with data-slot="image-compare"', () => {
    const wrapper = mount(ImageCompare, {
      props: {
        beforeSrc: "https://example.com/before.jpg",
        afterSrc: "https://example.com/after.jpg",
      },
    });
    expect(wrapper.find('[data-slot="image-compare"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("renders before and after labels", () => {
    const wrapper = mount(ImageCompare, {
      props: {
        beforeSrc: "https://example.com/before.jpg",
        afterSrc: "https://example.com/after.jpg",
        beforeLabel: "Original",
        afterLabel: "Modified",
      },
    });
    expect(wrapper.text()).toContain("Original");
    expect(wrapper.text()).toContain("Modified");
    wrapper.unmount();
  });
});
