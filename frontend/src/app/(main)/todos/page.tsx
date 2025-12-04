import { getResourceAccessLevel } from "@/general/resource-access.actions";
import { getTodos } from "@/modules/todos/todo.actions";
import { TodoTable } from "@/modules/todos/todo-table";
import { TodoStatusFilter } from "@/modules/todos/todo-status-filter";
import { TodoCreateSheet } from "@/modules/todos/todo-create-sheet";
import { Suspense, Activity } from "react";
import TableSkeleton from "@/features/skeletons/table-skeleton";

interface TodosPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Todos</h1>
        <TodoCreateSheet />
      </div>

      <div className="mb-4">
        <TodoStatusFilter />
      </div>
      <Activity mode={params.status ? "visible" : "hidden"}>
        <Suspense fallback={<TableSkeleton />}>
          <FetchTodosWrapper status={params.status} />
        </Suspense>
      </Activity>
    </div>
  );
}

async function FetchTodosWrapper({ status }: { status?: string }) {
  await getResourceAccessLevel();

  const urlParams = new URLSearchParams();
  if (status) {
    urlParams.set('status', status);
  }

  const dataRes = await getTodos(urlParams);

  if (!dataRes.success || !dataRes.data) {
    return (
      <div className="text-destructive">
        <p>Error fetching todos: {dataRes.message}</p>
      </div>
    );
  }

  return <TodoTable data={dataRes.data} />;
}