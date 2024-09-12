import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todos } from 'src/model/todos.entity';
import { TodoService } from 'src/service/todo.service';
import { TodoController } from 'src/controller/todo.controller';
import { UsersModule } from './users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todos]), UsersModule],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
