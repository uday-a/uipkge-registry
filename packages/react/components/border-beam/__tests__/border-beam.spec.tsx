import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { BorderBeam } from "../BorderBeam";

afterEach(cleanup);

describe("BorderBeam (React)", () => {
  it('renders container with data-slot="border-beam"', () => {
    const { container } = render(<BorderBeam />);
    expect(container.querySelector('[data-slot="border-beam"]')).toBeTruthy();
  });

  it("applies custom class and style size", () => {
    const { container } = render(
      <BorderBeam size={4} className="custom-beam" />,
    );
    const el = container.querySelector(
      '[data-slot="border-beam"]',
    ) as HTMLElement;
    expect(el?.className).toContain("custom-beam");
    expect(el?.style.padding).toBe("4px");
  });
});
