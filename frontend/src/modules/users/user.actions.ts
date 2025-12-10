"use server";

import { serverApiRequest } from "@/lib/server/api";


export async function getUsers(): Promise<IDataResponse<IUser[]>> {

  return serverApiRequest<undefined, IUser[]>({
    method: "GET",
    path: `users`,
    successMessage: "Users fetched successfully",
  });
}


export async function getUserById(id: number): Promise<IDataResponse<IUser>> {
  return serverApiRequest<undefined, IUser>({
    method: "GET",
    path: `users/${id}`,
    successMessage: "User fetched successfully",
  });
}


export async function createUser(
  userData: IUserInsertDTO
): Promise<IDataResponse<IUser>> {
  return serverApiRequest<IUserInsertDTO, IUser>({
    method: "POST",
    path: "users/",
    body: userData,
    revalidate: "/users", // Revalidate the list of users after creation
    successMessage: "User created successfully",
  });
}


export async function updateUser(
  id: number,
  userData: Partial<IUserInsertDTO>
): Promise<IDataResponse<IUser>> {
  return serverApiRequest<Partial<IUserUpdateDTO>, IUser>({
    method: "PUT",
    path: `users/${id}`,
    body: userData,
    revalidate: "/users", // Revalidate the list of users after update
    successMessage: "User updated successfully",
  });
}


export async function deleteUser(id: number): Promise<IBasicResponse> {
  const res = await serverApiRequest<undefined, null>({
    method: "DELETE",
    path: `users/${id}`,
    revalidate: "/users", // Revalidate the list of users after deletion
    successMessage: "User deleted successfully",
  });

  // Narrow to IBasicResponse (same pattern as your deleteTodo)
  if (!res.success) {
    return { success: false, message: res.message };
  }

  return { success: true, message: res.message ?? "User deleted successfully" };
}