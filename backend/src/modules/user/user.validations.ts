import * as z from "zod";

import { USER_ROLES, USER_PERMISSIONS } from "./user.const";

const userRoleEnum = z.enum(USER_ROLES);
const userPermissionEnum = z.enum(USER_PERMISSIONS);

export const userIdSchema = z.object({
  user_id: z.coerce
    .number()
    .int()
    .positive("User ID must be a positive integer"),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters"),
  role: userRoleEnum.default("user"),
  permissions: z.array(userPermissionEnum).optional().default([]),
  is_active: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).max(255).optional(),
  role: userRoleEnum.optional(),
  permissions: z.array(userPermissionEnum).optional(),
  is_active: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
