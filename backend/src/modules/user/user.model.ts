import { Column, Entity, Index, PrimaryColumn } from "typeorm";

import Base from "../../database/models/base.model";
import { USER_ROLES, USER_PERMISSIONS } from "./user.const";

@Entity("users")
export default class User extends Base implements IUser {
  @PrimaryColumn({ name: "user_id", type: "int", generated: "identity" })
  user_id!: number;

  @Index({ unique: true })
  @Column({ name: "email", type: "varchar", length: 255 })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  password_hash!: string;

  @Column({
    name: "role",
    type: "enum",
    enum: USER_ROLES,
    default: USER_ROLES[2], // 'user'
  })
  role!: TUserRole;

  // Postgres array of enum text values
  @Column({
    name: "permissions",
    type: "varchar",
    array: true,
    default: "{}",
  })
  permissions!: TUserPermission[];

  @Column({ name: "is_active", type: "boolean", default: true })
  is_active!: boolean;
}
