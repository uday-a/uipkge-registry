import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ImageCompare } from "../ImageCompare";

afterEach(cleanup);

describe("ImageCompare (React)", () => {
  it('renders container with data-slot="image-compare"', () => {
    const { container } = render(
      <ImageCompare
        beforeSrc="https://example.com/before.jpg"
        afterSrc="https://example.com/after.jpg"
      />,
    );
    expect(container.querySelector('[data-slot="image-compare"]')).toBeTruthy();
  });

  it("renders before and after labels", () => {
    const { container } = render(
      <ImageCompare
        beforeSrc="https://example.com/before.jpg"
        afterSrc="https://example.com/after.jpg"
        beforeLabel="Original"
        afterLabel="Modified"
      />,
    );
    expect(container.textContent).toContain("Original");
    expect(container.textContent).toContain("Modified");
  });
});
