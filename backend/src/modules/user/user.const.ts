
import z from "zod";

export const USER_ROLES = ["master", "admin", "user"] as const;
export type TUserRole = (typeof USER_ROLES)[number];

export const USER_PERMISSIONS = [
  "CAN_ADD_TODO",
  "CAN_EDIT_TODO",
  "CAN_DELETE_TODO",
  "CAN_VIEW_TODO",
] as const;

export const UserRoleEnum = z.enum(USER_ROLES).enum;
export const UserPermissionEnum = z.enum(USER_PERMISSIONS).enum;

export type TUserPermission = (typeof USER_PERMISSIONS)[number];
