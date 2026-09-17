import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../breadcrumb";

describe("Breadcrumb", () => {
  it('renders with data-slot="breadcrumb"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(container.querySelector('[data-slot="breadcrumb"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container
        .querySelector('[data-slot="breadcrumb"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('renders a nav element with aria-label="breadcrumb"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const nav = container.querySelector("nav");
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute("aria-label")).toBe("breadcrumb");
  });

  it('BreadcrumbList renders with data-slot="breadcrumb-list"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container.querySelector('[data-slot="breadcrumb-list"]'),
    ).toBeTruthy();
  });

  it("BreadcrumbList renders an ol element", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container
        .querySelector('[data-slot="breadcrumb-list"]')
        ?.tagName.toLowerCase(),
    ).toBe("ol");
  });

  it('BreadcrumbItem renders with data-slot="breadcrumb-item"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container.querySelector('[data-slot="breadcrumb-item"]'),
    ).toBeTruthy();
  });

  it("BreadcrumbItem renders an li element", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container
        .querySelector('[data-slot="breadcrumb-item"]')
        ?.tagName.toLowerCase(),
    ).toBe("li");
  });

  it('BreadcrumbLink renders with data-slot="breadcrumb-link"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container.querySelector('[data-slot="breadcrumb-link"]'),
    ).toBeTruthy();
  });

  it("BreadcrumbLink renders an a element by default", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container
        .querySelector('[data-slot="breadcrumb-link"]')
        ?.tagName.toLowerCase(),
    ).toBe("a");
  });

  it('BreadcrumbSeparator renders with data-slot="breadcrumb-separator"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container.querySelector('[data-slot="breadcrumb-separator"]'),
    ).toBeTruthy();
  });

  it('BreadcrumbSeparator has role="presentation"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(
      container
        .querySelector('[data-slot="breadcrumb-separator"]')
        ?.getAttribute("role"),
    ).toBe("presentation");
  });

  it('BreadcrumbPage renders with data-slot="breadcrumb-page" and aria-current="page"', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const page = container.querySelector('[data-slot="breadcrumb-page"]');
    expect(page).toBeTruthy();
    expect(page?.getAttribute("aria-current")).toBe("page");
  });
});
