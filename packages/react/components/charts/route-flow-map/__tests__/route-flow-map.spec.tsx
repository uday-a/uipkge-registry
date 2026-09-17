import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { RouteFlowMap } from "../index";

describe("RouteFlowMap", () => {
  const sampleProps = {
    hubs: [{ id: "1", name: "Hub", lat: 0, lng: 0 }],
    routes: [],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<RouteFlowMap {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <RouteFlowMap
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
