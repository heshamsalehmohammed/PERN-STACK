import { Suspense } from "react";
import TableSkeleton from "@/features/skeletons/table-skeleton";
import { getUsers } from "@/modules/users/user.actions";
import { UserCreateSheet } from "@/modules/users/user-create-sheet";
import { UserTable } from "@/modules/users/user-table";

export default async function UsersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <UserCreateSheet />
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <FetchUsersWrapper />
      </Suspense>
    </div>
  );
}

async function FetchUsersWrapper() {
  const dataRes = await getUsers();

  if (!dataRes.success || !dataRes.data) {
    return (
      <div className="text-destructive">
        <p>Error fetching Users: {dataRes.message}</p>
      </div>
    );
  }

  return <UserTable data={dataRes.data} />;
}
