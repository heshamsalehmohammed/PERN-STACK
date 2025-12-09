"use server";

import { serverApiRequest } from "@/lib/server/api";

 
export async function getTodos(
  params?: URLSearchParams
): Promise<IDataResponse<ITodo[]>> {
  const query = params ? `?${params.toString()}` : "";

  return serverApiRequest<undefined, ITodo[]>({
    method: "GET",
    path: `todos/${query}`,
    successMessage: "Todos fetched successfully",
  });
}

export async function createTodo(
  todoData: ITodoInsertDTO
): Promise<IDataResponse<ITodo>> {
  return serverApiRequest<ITodoInsertDTO, ITodo>({
    method: "POST",
    path: "todos/",
    body: todoData,
    revalidate: "/todos",
    successMessage: "Todo created successfully",
  });
}

export async function deleteTodo(id: number): Promise<IBasicResponse> {
  const res = await serverApiRequest<undefined, null>({
    method: "DELETE",
    path: `todos/${id}`,
    revalidate: "/todos",
    successMessage: "Todo deleted successfully",
  });

  // Narrow to IBasicResponse
  if (!res.success) {
    return { success: false, message: res.message };
  }

  return { success: true, message: res.message ?? "Todo deleted successfully" };
}

export async function getTodoById(id: number): Promise<IDataResponse<ITodo>> {
  return serverApiRequest<undefined, ITodo>({
    method: "GET",
    path: `todos/${id}`,
    successMessage: "Todo fetched successfully",
  });
}

export async function updateTodo(
  id: number,
  todoData: Partial<ITodoInsertDTO>
): Promise<IDataResponse<ITodo>> {
  return serverApiRequest<Partial<ITodoInsertDTO>, ITodo>({
    method: "PUT",
    path: `todos/${id}`,
    body: todoData,
    revalidate: "/todos",
    successMessage: "Todo updated successfully",
  });
}
