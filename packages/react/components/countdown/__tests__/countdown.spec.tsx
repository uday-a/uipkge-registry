import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Countdown } from "../countdown";

afterEach(cleanup);

describe("Countdown (React)", () => {
  it('renders container with data-slot="countdown"', () => {
    const { container } = render(<Countdown target={Date.now() + 60000} />);
    expect(container.querySelector('[data-slot="countdown"]')).toBeTruthy();
  });

  it("renders custom label and unit separator", () => {
    const { container } = render(
      <Countdown
        target={Date.now() + 60000}
        label="Sale Ends In"
        separator=":"
      />,
    );
    expect(container.textContent).toContain("Sale Ends In");
    expect(container.textContent).toContain(":");
  });
});
