export const USER_ROLES: { value: TUserRole; label: string }[] = [
  { value: "master", label: "Master" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export const ALL_PERMISSIONS: { value: TUserPermission; label: string }[] = [
  { value: "CAN_ADD_TODO", label: "Add Todo" },
  { value: "CAN_EDIT_TODO", label: "Edit Todo" },
  { value: "CAN_DELETE_TODO", label: "Delete Todo" },
  { value: "CAN_VIEW_TODO", label: "View Todos" },
];