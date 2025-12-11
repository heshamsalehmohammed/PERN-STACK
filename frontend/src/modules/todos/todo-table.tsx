"use client";

import { DataTable } from "@/features/data-table";
import { todoColumns } from "./todo-columns";

interface TodoTableProps {
  data: ITodo[];
}

export function TodoTable({ data }: TodoTableProps) {
  return (
    <DataTable
      columns={todoColumns}
      data={data}
      searchKey="title"
      searchPlaceholder="Search over titles"
    />
  );
}
