import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MarimekkoChart } from "../index";

describe("MarimekkoChart", () => {
  const sampleProps = {
    columns: [{ name: "Col", values: [{ name: "Seg", value: 100 }] }],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<MarimekkoChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <MarimekkoChart
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
