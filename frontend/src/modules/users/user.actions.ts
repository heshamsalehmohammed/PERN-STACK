'use server';

'use server';

import axiosRequest from '@/helpers/axios';
import envSettings from '@/config/envSettings';
import { revalidatePath } from 'next/cache';

const baseUserURL = `${envSettings.backendHost}users/`;

 
export async function getUsers(
  params?: URLSearchParams
): Promise<IDataResponse<IUser[]>> {

  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<IUser[]> = await axiosRequest(
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

export async function createUser(
  userData: IUserInsertDTO
): Promise<IDataResponse<IUser>> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<IUser> = await axiosRequest(
    'POST',
    baseUserURL,
    userData,
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  revalidatePath('/users');

  return {
    success: true,
    message: 'User created successfully',
    data: axiosRes.data,
  };
}

export async function deleteUser(id: number): Promise<IBasicResponse> {
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

  revalidatePath('/users');

  return {
    success: true,
    message: 'User deleted successfully',
  };
}

export async function getUserById(id: number): Promise<IDataResponse<IUser>> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<IUser> = await axiosRequest(
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
    message: 'User fetched successfully',
    data: axiosRes.data,
  };
}

export async function updateUser(
  id: number,
  userData: Partial<IUserInsertDTO>
): Promise<IDataResponse<IUser>> {
  const headers = {
    'access-key': envSettings.accessKey,
  };

  const axiosRes: IDataResponse<IUser> = await axiosRequest(
    'PUT',
    `${baseUserURL}${id}`,
    userData,
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  revalidatePath('/users');

  return {
    success: true,
    message: 'User updated successfully',
    data: axiosRes.data,
  };
}

