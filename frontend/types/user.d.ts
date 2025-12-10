interface ISignedPayload {
  id: string;
  email: string;
  role: TUserRole;
  permissions?: TUserPermission[];
  iat?: number;
  exp?: number;
  token?: string;
}
type TUserRole = "master" | "admin" | "user";
type TUserPermission =
  | "CAN_ADD_TODO"
  | "CAN_EDIT_TODO"
  | "CAN_DELETE_TODO"
  | "CAN_VIEW_TODO";
