import type { ColumnDef } from "@tanstack/react-table";
import { createElement } from "react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { FilterDefinition } from "../types";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "on_leave" | "terminated";
  age?: number;
  nested?: { title: string };
}

export const employees: Employee[] = [
  {
    id: "1",
    name: "Ankita Joshi",
    email: "ankita@uipkge.dev",
    role: "Backend Engineer",
    department: "Engineering",
    status: "active",
    age: 29,
    nested: { title: "Senior" },
  },
  {
    id: "2",
    name: "Rohit Mehta",
    email: "rohit@uipkge.dev",
    role: "Tech Writer",
    department: "Marketing",
    status: "active",
    age: 31,
  },
  {
    id: "3",
    name: "Divya Sharma",
    email: "divya@uipkge.dev",
    role: "Data Scientist",
    department: "Product",
    status: "on_leave",
    age: 27,
  },
  {
    id: "4",
    name: "Karan Nair",
    email: "karan@uipkge.dev",
    role: "Senior Engineer",
    department: "Engineering",
    status: "active",
    age: 34,
  },
  {
    id: "5",
    name: "Pooja Iyer",
    email: "pooja@uipkge.dev",
    role: "Designer",
    department: "Design",
    status: "terminated",
    age: 26,
  },
  {
    id: "6",
    name: "Arjun Patel",
    email: "arjun@uipkge.dev",
    role: "PM",
    department: "Product",
    status: "active",
    age: 33,
  },
  {
    id: "7",
    name: "Lakshmi Rao",
    email: "lakshmi@uipkge.dev",
    role: "Senior Engineer",
    department: "Engineering",
    status: "active",
    age: 30,
  },
  {
    id: "8",
    name: "Manish Verma",
    email: "manish@uipkge.dev",
    role: "Designer",
    department: "Design",
    status: "on_leave",
    age: 28,
  },
  {
    id: "9",
    name: "Priya Shah",
    email: "priya@uipkge.dev",
    role: "QA Lead",
    department: "Engineering",
    status: "active",
    age: 32,
  },
  {
    id: "10",
    name: "Vikram Das",
    email: "vikram@uipkge.dev",
    role: "DevOps",
    department: "Engineering",
    status: "active",
    age: 35,
  },
  {
    id: "11",
    name: "Sneha Kapoor",
    email: "sneha@uipkge.dev",
    role: "Designer",
    department: "Design",
    status: "active",
    age: 24,
  },
  {
    id: "12",
    name: "Aditya Bose",
    email: "aditya@uipkge.dev",
    role: "PM",
    department: "Product",
    status: "terminated",
    age: 40,
  },
];

export const selectColumn: ColumnDef<Employee> = {
  id: "select",
  enableSorting: false,
  enableHiding: false,
  header: ({ table }) =>
    createElement("input", {
      type: "checkbox",
      "aria-label": "Select all rows",
      checked: table.getIsAllPageRowsSelected(),
      // @ts-expect-error DOM
      ref: (el: HTMLInputElement | null) => {
        if (el)
          el.indeterminate =
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected();
      },
      onChange: (e: { target: HTMLInputElement }) =>
        table.toggleAllPageRowsSelected(e.target.checked),
    }),
  cell: ({ row }) =>
    createElement("input", {
      type: "checkbox",
      "aria-label": "Select row",
      checked: row.getIsSelected(),
      onChange: (e: { target: HTMLInputElement }) =>
        row.toggleSelected(e.target.checked),
    }),
};

export const plainColumns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "status", header: "Status" },
];

export const sortableColumns: ColumnDef<Employee>[] = [
  selectColumn,
  {
    accessorKey: "name",
    header: ({ column }) =>
      createElement(DataTableColumnHeader, { column, label: "Name" }),
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      createElement(DataTableColumnHeader, { column, label: "Email" }),
  },
  {
    accessorKey: "role",
    header: ({ column }) =>
      createElement(DataTableColumnHeader, { column, label: "Role" }),
  },
  {
    accessorKey: "department",
    header: ({ column }) =>
      createElement(DataTableColumnHeader, { column, label: "Department" }),
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createElement(DataTableColumnHeader, { column, label: "Status" }),
  },
];

export const filters: FilterDefinition[] = [
  {
    column: "department",
    label: "Department",
    type: "multiselect",
    options: ["Engineering", "Product", "Design", "Marketing"],
  },
  {
    column: "status",
    label: "Status",
    type: "multiselect",
    options: ["active", "on_leave", "terminated"],
  },
];

export function manyEmployees(n: number): Employee[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    name: `User ${String(i + 1).padStart(3, "0")}`,
    email: `user${i + 1}@uipkge.dev`,
    role: ["Engineer", "Designer", "PM", "QA"][i % 4],
    department: ["Engineering", "Product", "Design", "Marketing"][i % 4],
    status: (["active", "on_leave", "terminated"] as const)[i % 3],
    age: 20 + (i % 30),
  }));
}
