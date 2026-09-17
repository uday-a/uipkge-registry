import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Dock, type DockItem } from "../Dock";

afterEach(cleanup);

describe("Dock (React)", () => {
  const dummyIcon = ((props: any) => <svg {...props} />) as any;
  const items: DockItem[] = [
    { id: "1", label: "Home", icon: dummyIcon },
    { id: "2", label: "Search", icon: dummyIcon },
  ];

  it('renders container with data-slot="dock"', () => {
    const { container } = render(<Dock items={items} />);
    expect(container.querySelector('[data-slot="dock"]')).toBeTruthy();
  });

  it("renders dock items with accessible labels", () => {
    const { container } = render(<Dock items={items} />);
    const dockItems = container.querySelectorAll('[data-slot="dock-item"]');
    expect(dockItems.length).toBe(2);
    expect(dockItems[0].getAttribute("aria-label")).toBe("Home");
    expect(dockItems[1].getAttribute("aria-label")).toBe("Search");
  });
});
