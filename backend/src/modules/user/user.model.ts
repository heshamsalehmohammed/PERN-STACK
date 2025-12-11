import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import Base from '../../database/models/base.model';

@Entity("users")
export default class User extends Base implements IUser {
  @PrimaryColumn({ name: "user_id", type: "int", generated: "identity" })
  user_id!: number;

  @Index()
  @Column({ name: "user_name", type: "varchar", length: 255 })
  user_name!: string;

  @Index()
  @Column({ name: "email", type: "varchar", length: 255 })
  email!: string;

  @Column({ name: "is_admin", type: "boolean" })
  is_admin!: boolean;

  @Column({ name: "password", type: "varchar", length: 255 })
  password!: string;
}
