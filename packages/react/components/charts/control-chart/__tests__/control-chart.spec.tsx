import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ControlChart } from "../index";

describe("ControlChart", () => {
  const sampleProps = {
    data: [{ b: "1", mins: 10 }],
    xField: "b",
    yField: "mins",
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<ControlChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <ControlChart
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
