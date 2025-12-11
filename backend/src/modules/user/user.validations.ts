import * as z from 'zod';



// Create User validation schema
export const createUserSchema = z.object({
  user_name: z
    .string()
    .min(1, 'user name is required')
    .max(255, 'user name must be less than 255 characters'),
  email: z.email(),
  is_admin: z.boolean().optional().default(false),
  password: z.string().min(4,"password need to be more than 4").max(10)
});

// Update User validation schema
export const updateUserSchema = z.object({
  user_name: z
    .string()
    .min(1, "user name is required")
    .max(255, "user name must be less than 255 characters"),
  email: z.email(),
  is_admin: z.boolean().optional().default(false),
  password: z.string().min(4, "password need to be more than 4").max(10),
});

// Get User by ID validation schema
export const getUserByIdSchema = z.object({
  user_id: z.coerce
    .number()
    .int()
    .positive('User ID must be a positive integer'),
});

// Delete User validation schema
export const deleteUserSchema = z.object({
  user_id: z.coerce
    .number()
    .int()
    .positive('User ID must be a positive integer'),
});
