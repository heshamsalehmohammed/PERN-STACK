"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/features/data-table";
import { TodoRowActions } from "./todo-row-actions";

const statusVariants: Record<TTodoStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  "in-progress": "secondary",
  completed: "default",
  cancelled: "destructive",
};

export const todoColumns: ColumnDef<ITodo>[] = [
  {
    accessorKey: "todo_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("todo_id")}</span>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-muted-foreground">
        {row.getValue("description") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TTodoStatus;
      return (
        <Badge variant={statusVariants[status]}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as number;
      return (
        <Badge variant={priority >= 3 ? "destructive" : priority >= 2 ? "secondary" : "outline"}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("due_date") as Date | undefined;
      if (!dueDate) return <span className="text-muted-foreground">-</span>;
      return (
        <span>
          {new Date(dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions row={row} />,
  },
];
