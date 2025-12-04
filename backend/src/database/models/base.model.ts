import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default abstract class Base extends BaseEntity implements IBase {
  // shared attributes
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at?: Date;
}
