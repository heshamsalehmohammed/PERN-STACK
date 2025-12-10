import { getTodos } from "@/modules/todos/todo.actions";
import { TodoTable } from "@/modules/todos/todo-table";
import { Suspense } from "react";
import TableSkeleton from "@/features/skeletons/table-skeleton";

export default async function TodosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        {/* <TodoCreateSheet /> */}
      </div>

      <Suspense fallback={<TableSkeleton />}>
        {/* <FetchTodosWrapper /> */}
      </Suspense>
    </div>
  );
}

async function FetchUsersWrapper({ status }: { status?: string }) {
  const urlParams = new URLSearchParams();
  if (status) {
    urlParams.set("status", status);
  }

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
