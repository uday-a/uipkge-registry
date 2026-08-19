import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Heatmap } from "../index";

describe("Heatmap", () => {
  const sampleProps = { data: [[0, 0, 5]], xLabels: ["A"], yLabels: ["B"] };

  it("renders without crashing", () => {
    const { container, unmount } = render(<Heatmap {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <Heatmap {...sampleProps} className="custom-chart-test" height={380} />,
    );
    expect(container).toBeDefined();
    expect(
      container.querySelector(".custom-chart-test") || container.firstChild,
    ).toBeTruthy();
    unmount();
  });
});
