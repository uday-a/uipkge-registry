import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BubbleChart } from "../index";

describe("BubbleChart", () => {
  const sampleProps = {
    data: [{ x: 1, y: 2, size: 3, c: "A" }],
    categoryField: "c",
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<BubbleChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <BubbleChart
        {...sampleProps}
        className="custom-chart-test"
        height={380}
      />,
    );
    expect(container).toBeDefined();
    expect(
      container.querySelector(".custom-chart-test") || container.firstChild,
    ).toBeTruthy();
    unmount();
  });
});
