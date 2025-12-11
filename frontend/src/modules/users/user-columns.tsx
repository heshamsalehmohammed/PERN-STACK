"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/features/data-table";
import { UserRowActions } from "./user-row-actions";

export const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("user_id")}</span>
    ),
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("user_name")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "is_admin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin") as boolean;
      return (
        <div className="max-w-[300px] truncate font-medium">
          {isAdmin ? "Admin" : "User"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions row={row} />,
  },
];
