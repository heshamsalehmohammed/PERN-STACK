'use server';

'use server';

import axiosRequest from '@/helpers/axios';
import envSettings from '@/config/envSettings';
import { revalidatePath } from 'next/cache';

const baseUserURL = `${envSettings.backendHost}todos/`;

 
export async function getTodos(
  params?: URLSearchParams
): Promise<IDataResponse<ITodo[]>> {

  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<ITodo[]> = await axiosRequest(
    'GET',
    `${baseUserURL}${params ? `?${params}` : ''}`,
    {},
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  const { data } = axiosRes;

  if (!data) {
    return {
      success: false,
      message: 'No chains found',
    };
  }

  return {
    success: true,
    message: 'Chains found success',
    data,
  };
}

export async function createTodo(
  todoData: ITodoInsertDTO
): Promise<IDataResponse<ITodo>> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<ITodo> = await axiosRequest(
    'POST',
    baseUserURL,
    todoData,
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  revalidatePath('/todos');

  return {
    success: true,
    message: 'Todo created successfully',
    data: axiosRes.data,
  };
}

export async function deleteTodo(id: number): Promise<IBasicResponse> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IBasicResponse = await axiosRequest(
    'DELETE',
    `${baseUserURL}${id}`,
    {},
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  revalidatePath('/todos');

  return {
    success: true,
    message: 'Todo deleted successfully',
  };
}

export async function getTodoById(id: number): Promise<IDataResponse<ITodo>> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<ITodo> = await axiosRequest(
    'GET',
    `${baseUserURL}${id}`,
    {},
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  return {
    success: true,
    message: 'Todo fetched successfully',
    data: axiosRes.data,
  };
}

export async function updateTodo(
  id: number,
  todoData: Partial<ITodoInsertDTO>
): Promise<IDataResponse<ITodo>> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<ITodo> = await axiosRequest(
    'PUT',
    `${baseUserURL}${id}`,
    todoData,
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  revalidatePath('/todos');

  return {
    success: true,
    message: 'Todo updated successfully',
    data: axiosRes.data,
  };
}

