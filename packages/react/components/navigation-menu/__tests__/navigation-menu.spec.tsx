import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../navigation-menu";

afterEach(cleanup);

describe("NavigationMenu (React)", () => {
  it('renders container with data-slot="navigation-menu"', () => {
    const { container } = render(<NavigationMenu />);
    expect(
      container.querySelector('[data-slot="navigation-menu"]'),
    ).toBeTruthy();
  });

  it("renders navigation list and items correctly", () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink>Overview</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(
      container.querySelector('[data-slot="navigation-menu-list"]'),
    ).toBeTruthy();
    expect(container.textContent).toContain("Overview");
  });
});
