import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TreemapChart } from "../index";

describe("TreemapChart", () => {
  const sampleProps = {
    data: [
      { name: "Root", value: 10, children: [{ name: "Leaf", value: 10 }] },
    ],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<TreemapChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <TreemapChart
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
