import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../index";

describe("NavigationMenu (Vue)", () => {
  it('renders container with data-slot="navigation-menu"', () => {
    const wrapper = mount(NavigationMenu);
    expect(wrapper.find('[data-slot="navigation-menu"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("renders navigation list and items correctly", () => {
    const TestNav = defineComponent({
      render() {
        return h(NavigationMenu, null, {
          default: () =>
            h(NavigationMenuList, null, {
              default: () =>
                h(NavigationMenuItem, null, {
                  default: () =>
                    h(NavigationMenuLink, null, { default: () => "Overview" }),
                }),
            }),
        });
      },
    });
    const wrapper = mount(TestNav);
    expect(wrapper.find('[data-slot="navigation-menu-list"]').exists()).toBe(
      true,
    );
    expect(wrapper.text()).toContain("Overview");
    wrapper.unmount();
  });
});
