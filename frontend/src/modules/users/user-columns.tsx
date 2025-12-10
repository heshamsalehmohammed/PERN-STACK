"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/features/data-table";
import { UserRowActions } from "./user-row-actions";
import { ALL_PERMISSIONS } from "./user.const";

const PERMISSION_LABEL_MAP = ALL_PERMISSIONS.reduce((map, perm) => {
  map[perm.value] = perm.label;
  return map;
}, {} as Record<TUserPermission, string>);

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
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-muted-foreground">
        {row.getValue("role") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permissions" />
    ),
    cell: ({ row }) => {
      const permissions: TUserPermission[] | null | undefined =
        row.getValue("permissions");
      let permissionString = "-";

      if (permissions && permissions.length > 0) {
        const mappedLabels = permissions.map(
          (permKey) => PERMISSION_LABEL_MAP[permKey] || permKey 
        );
        permissionString = mappedLabels.join(", ");
      }
      return (
        <div className="max-w-[400px] text-sm text-muted-foreground">
          {permissionString}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions row={row} />,
  },
];
