import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Pagination,
  PaginationList,
  PaginationListItem,
  PaginationFirst,
  PaginationPrev,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
} from "../pagination";

describe("Pagination", () => {
  it('renders with data-slot="pagination"', () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationFirst />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    expect(container.querySelector('[data-slot="pagination"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationFirst />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    expect(
      container
        .querySelector('[data-slot="pagination"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders a nav element", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationFirst />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    expect(
      container
        .querySelector('[data-slot="pagination"]')
        ?.tagName.toLowerCase(),
    ).toBe("nav");
  });

  it("has aria-label", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationFirst />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    expect(
      container
        .querySelector('[data-slot="pagination"]')
        ?.getAttribute("aria-label"),
    ).toBe("Pagination");
  });

  it('PaginationList renders with data-slot="pagination-list"', () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationFirst />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    expect(
      container.querySelector('[data-slot="pagination-list"]'),
    ).toBeTruthy();
  });

  it("PaginationFirst renders a button with aria-label", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationFirst />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    const button = container.querySelector(
      'button[aria-label="Go to first page"]',
    );
    expect(button).toBeTruthy();
    expect(button?.tagName.toLowerCase()).toBe("button");
  });

  it("PaginationPrev renders a button with aria-label", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationPrev />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    const button = container.querySelector(
      'button[aria-label="Go to previous page"]',
    );
    expect(button).toBeTruthy();
    expect(button?.tagName.toLowerCase()).toBe("button");
  });

  it("PaginationNext renders a button with aria-label", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationNext />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    const button = container.querySelector(
      'button[aria-label="Go to next page"]',
    );
    expect(button).toBeTruthy();
    expect(button?.tagName.toLowerCase()).toBe("button");
  });

  it("PaginationLast renders a button with aria-label", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationLast />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    const button = container.querySelector(
      'button[aria-label="Go to last page"]',
    );
    expect(button).toBeTruthy();
    expect(button?.tagName.toLowerCase()).toBe("button");
  });

  it("PaginationEllipsis renders", () => {
    const { container } = render(
      <Pagination>
        <PaginationList>
          <PaginationListItem>
            <PaginationEllipsis />
          </PaginationListItem>
        </PaginationList>
      </Pagination>,
    );
    expect(container.querySelector('span[aria-hidden="true"]')).toBeTruthy();
  });
});
