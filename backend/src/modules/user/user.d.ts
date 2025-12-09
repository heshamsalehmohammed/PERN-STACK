
type TUserRole = "master" | "admin" | "user";
type TUserPermission =
  | "CAN_ADD_TODO"
  | "CAN_EDIT_TODO"
  | "CAN_DELETE_TODO"
  | "CAN_VIEW_TODO";

interface IUser extends IBase {
  user_id: number;
  email: string;
  password_hash: string;
  role: TUserRole;
  permissions: TUserPermission[];
  is_active: boolean;
}

interface IUserInsertDTO {
  email: string;
  password: string;
  role: TUserRole;
  permissions?: TUserPermission[];
  is_active?: boolean;
}

interface IUserUpdateDTO {
  email?: string;
  password?: string;
  role?: TUserRole;
  permissions?: TUserPermission[];
  is_active?: boolean;
}

interface ISignedPayload {
  id: string;
  email: string;
  role: TUserRole;
  permissions?: TUserPermission[];
  iat?: number;
  exp?: number;
}
