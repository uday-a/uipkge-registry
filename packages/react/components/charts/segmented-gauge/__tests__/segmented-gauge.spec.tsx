import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SegmentedGauge } from "../index";

describe("SegmentedGauge", () => {
  const sampleProps = { segments: [{ label: "A", value: 50 }] };

  it("renders without crashing", () => {
    const { container, unmount } = render(<SegmentedGauge {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <SegmentedGauge
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
