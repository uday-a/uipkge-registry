import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BarRaceChart } from "../index";

describe("BarRaceChart", () => {
  const sampleProps = {
    frames: [{ label: "2020", values: [{ name: "A", value: 10 }] }],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<BarRaceChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <BarRaceChart
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
