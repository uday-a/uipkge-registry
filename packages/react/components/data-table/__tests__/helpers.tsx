import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import {
  DataTable,
  type DataTableHandle,
  type DataTableProps,
} from "../DataTable";
import {
  employees,
  plainColumns,
  sortableColumns,
  filters,
  type Employee,
} from "./fixtures";

export function renderTable(
  props: Partial<DataTableProps<Employee, unknown>> = {},
) {
  const ref = createRef<DataTableHandle<Employee>>();
  const result = render(
    <DataTable ref={ref} columns={plainColumns} data={employees} {...props} />,
  );
  return { ...result, ref };
}

export function renderSortable(
  props: Partial<DataTableProps<Employee, unknown>> = {},
) {
  return renderTable({
    columns: sortableColumns,
    filterColumn: "email",
    filterPlaceholder: "Search by email…",
    filters,
    enableColumnVisibility: true,
    ...props,
  });
}

export function rowCount(container: HTMLElement = document.body): number {
  const tbody =
    container.querySelector('[data-slot="data-table"] tbody') ??
    container.querySelector("tbody");
  if (!tbody) return 0;
  if (tbody.textContent?.includes("No results")) return 0;
  return tbody.querySelectorAll("tr").length;
}

export function bodyTexts(container: HTMLElement = document.body): string[] {
  const tbody =
    container.querySelector('[data-slot="data-table"] tbody') ??
    container.querySelector("tbody");
  if (!tbody) return [];
  return Array.from(tbody.querySelectorAll("tr")).map(
    (r) => r.textContent ?? "",
  );
}

export function namesInOrder(container: HTMLElement = document.body): string[] {
  return bodyTexts(container)
    .map((t) => employees.find((e) => t.includes(e.name))?.name ?? "")
    .filter(Boolean);
}

export async function typeSearch(value: string) {
  const input =
    screen.queryByPlaceholderText(/email/i) ||
    screen.queryByPlaceholderText(/search/i) ||
    screen.queryByPlaceholderText(/filter/i);
  if (!input) throw new Error("search input not found");
  await userEvent.clear(input);
  if (value) await userEvent.type(input, value);
  await waitFor(() => {});
}

export function tableApi(
  ref: React.RefObject<DataTableHandle<Employee> | null>,
) {
  return ref.current!.table;
}

export async function clickByName(name: string | RegExp) {
  const btn = screen.getAllByRole("button").find((b) => {
    const t = b.textContent ?? "";
    return typeof name === "string" ? t.includes(name) : name.test(t);
  });
  if (!btn) throw new Error("button not found: " + name);
  await userEvent.click(btn);
}
