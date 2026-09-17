import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Typewriter } from "../Typewriter";

afterEach(cleanup);

describe("Typewriter (React)", () => {
  it('renders container with data-slot="typewriter"', () => {
    const { container } = render(<Typewriter phrases="Modern UI Components" />);
    expect(container.querySelector('[data-slot="typewriter"]')).toBeTruthy();
  });

  it("renders accessible screen-reader text containing the phrase", () => {
    const { container } = render(
      <Typewriter phrases={["Build fast", "Ship faster"]} />,
    );
    const sr = container.querySelector(".sr-only");
    expect(sr).toBeTruthy();
    expect(sr?.textContent).toContain("Build fast. Ship faster");
  });
});
