import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { TODO_STATUS } from './todo.const';
import Base from '../../database/models/base.model';

@Entity('todos')
export default class Todo extends Base implements ITodo {
  @PrimaryColumn({ name: 'todo_id', type: 'int', generated: 'identity' })
  todo_id!: number;

  @Index()
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TODO_STATUS,
    default: TODO_STATUS[0],
  })
  status!: TTodoStatus;

  @Column({ name: 'due_date', type: 'timestamp with time zone', nullable: true })
  due_date?: Date;

  @Column({ name: 'priority', type: 'int', default: 3 })
  priority!: number;
}
