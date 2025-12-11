"use client";

import { DataTable } from "@/features/data-table";
import { userColumns } from "./user-columns";

interface UserTableProps {
  data: IUser[];
}

export function UserTable({ data }: UserTableProps) {
  return (
    <DataTable
      columns={userColumns}
      data={data}
      searchKey="email"
      searchPlaceholder="Search over emails"
    />
  );
}
