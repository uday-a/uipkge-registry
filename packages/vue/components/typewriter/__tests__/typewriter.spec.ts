import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Typewriter from "../Typewriter.vue";

describe("Typewriter (Vue)", () => {
  it('renders container with data-slot="typewriter"', () => {
    const wrapper = mount(Typewriter, {
      props: { phrases: "Modern UI Components" },
    });
    expect(wrapper.find('[data-slot="typewriter"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("renders accessible screen-reader text containing the phrase", () => {
    const wrapper = mount(Typewriter, {
      props: { phrases: ["Build fast", "Ship faster"] },
    });
    const sr = wrapper.find(".sr-only");
    expect(sr.exists()).toBe(true);
    expect(sr.text()).toContain("Build fast. Ship faster");
    wrapper.unmount();
  });
});
