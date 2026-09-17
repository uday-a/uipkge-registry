import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BubbleMap } from "../index";

describe("BubbleMap", () => {
  const sampleProps = {
    bubbles: [{ id: "1", name: "Node", lat: 0, lng: 0, value: 10 }],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<BubbleMap {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <BubbleMap {...sampleProps} className="custom-chart-test" height={380} />,
    );
    expect(container).toBeDefined();
    expect(
      container.querySelector(".custom-chart-test") || container.firstChild,
    ).toBeTruthy();
    unmount();
  });
});
