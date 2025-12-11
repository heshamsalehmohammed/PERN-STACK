import { getResourceAccessLevel } from "@/general/resource-access.actions";
import { getUsers } from "@/modules/users/user.actions";
import { UserTable } from "@/modules/users/user-table";
import { UserIsAdminFilter } from "@/modules/users/user-isAdmin-filter";
import { UserCreateSheet } from "@/modules/users/user-create-sheet";
import { Suspense } from "react";
import TableSkeleton from "@/features/skeletons/table-skeleton";

interface UsersPageProps {
  searchParams: Promise<{ is_admin?: boolean }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <UserCreateSheet />
      </div>

      <div className="mb-4">
        <UserIsAdminFilter />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <FetchUsersWrapper is_admin={params.is_admin} />
      </Suspense>
    </div>
  );
}

async function FetchUsersWrapper({ is_admin }: { is_admin?: boolean }) {
  await getResourceAccessLevel();

  const urlParams = new URLSearchParams();
  if (is_admin) {
    urlParams.set("is_admin", is_admin.toString());
  }

  const dataRes = await getUsers(urlParams);

  if (!dataRes.success || !dataRes.data) {
    return (
      <div className="text-destructive">
        <p>Error fetching users: {dataRes.message}</p>
      </div>
    );
  }

  return <UserTable data={dataRes.data} />;
}
