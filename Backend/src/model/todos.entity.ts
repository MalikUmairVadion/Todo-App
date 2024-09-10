import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Todos {
  @PrimaryGeneratedColumn()
  todoId: number;

  @Column()
  todoTitle: string;

  @Column()
  todoDescription: string;

  @Column({ default: false })
  todoStatus: boolean;

  @ManyToOne(() => Users, (user) => user.todos, { eager: false })
  user: Users;

  @CreateDateColumn()
  todoCreatedDate: Date;

  @UpdateDateColumn({ nullable: true })
  todoUpdatedDate: Date;

  @DeleteDateColumn({ nullable: true })
  todoDeletedDate: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedBy: string;
}
